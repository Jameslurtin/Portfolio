import "./App.css";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import About from "./Components/About";
import Project from "./Components/Project";

function App() {
  return (
    <div >
      <div className="container mx-auto px-4">
        <Navbar />
        <Home />
        <About />
        <Project></Project>
      </div>
    </div>
  );
}

export default App;
