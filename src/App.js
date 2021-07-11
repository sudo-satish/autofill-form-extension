import './App.css';
import { useForm } from "react-hook-form";

const logData = () => {
  console.log('Log Data')
  window.chrome.storage.sync.get("formData", ({ formData }) => {
    const {selector, value} = formData;
    document.querySelector(selector).value = value;
  });
};

function App() {
  const { register, handleSubmit} = useForm();
  const onSubmit = async formData => {

    let [tab] = await window.chrome.tabs.query({ active: true, currentWindow: true });

    window.chrome.storage.sync.set({ formData });

    window.chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: logData,
    });

    console.log(formData)
  };
  return (
    <div className="App">
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("selector")} defaultValue="" className="input" placeholder="Enter selector" />
        <input {...register("value")} defaultValue="" className="input" placeholder="Enter value" />
        <button className="btn">Populate</button>
      </form>
    </div>
  );
}

export default App;
