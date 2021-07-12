import './App.css';
import { useForm, useFieldArray } from "react-hook-form";

const logData = () => {
  console.log('Log Data')
  window.chrome.storage.sync.get("formData", ({ formData }) => {
    formData.fields.forEach(({ selector, value }) => {
      document.querySelector(selector).value = value;
    });
  });
};

function App() {
  const { register, control, handleSubmit} = useForm({defaultValues: {fields: [{selector: '', value: ''}]}});
  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields"
  });

  const onSubmit = async formData => {

    if (window.chrome && window.chrome.extension) {
      let [tab] = await window.chrome.tabs.query({ active: true, currentWindow: true });
      window.chrome.storage.sync.set({ formData });
      window.chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: logData,
      });
    }

    console.log(formData)
  };
  return (
    <div className="App">
      <form onSubmit={handleSubmit(onSubmit)}>
          {fields.map((item, index) => {
            return (
              <div className="form-field-wrapper" key={item.id}>
                <input
                  {...register(`fields.${index}.selector`)}
                  className="input" placeholder="Enter selector"
                  defaultValue={item.selector}
                />
                <input
                  {...register(`fields.${index}.value`)}
                  className="input" placeholder="Enter value"
                  defaultValue={item.value}
                />
                <button type="button" className="btn" onClick={() => remove(index)}>
                  Delete
                </button>
              </div>
            );
          })}
        <button
          type="button"
          className="btn"
          onClick={() => {
            append({ selector: "", value: '' });
          }}
        >
          Add Field
        </button>
        <button className="btn">Populate</button>
      </form>
    </div>
  );
}

export default App;
