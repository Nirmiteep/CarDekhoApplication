import Home from "./components/Home";
import LoginRegister from "./components/LoginRegister";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom"; 

function App() {
  return (
    <div>
      <Navbar />
 
        <Outlet />
      </div>
    
  );
}

export default App;