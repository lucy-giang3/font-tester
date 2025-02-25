import "./App.css";
import FontTester from "./components/FontTester";

function App() {
  return (
    <div className="bg-[#1d1d1d] flex flex-col justify-between items-center">
      <div className="min-h-screen flex items-center justify-center bg-black">
        <FontTester />
      </div>
    </div>
  );
}

export default App;
