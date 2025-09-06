import "./App.css";
import { useState } from "react";
import Navbar from "./components/Navbar";
import BottomNavigation from "./components/BottomNavigation";
import Home from "./components/Home";
import Search from "./components/Search";

function App() {
  const [is24Hour, setIs24Hour] = useState(
    () => localStorage.getItem("timeFormat") === "24h"
  );
  const [activeTab, setActiveTab] = useState("clock");
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="">
      <Navbar
        is24Hour={is24Hour}
        setIs24Hour={(value) => {
          setIs24Hour(value);
          localStorage.setItem("timeFormat", value ? "24h" : "12h");
        }}
      />
      {activeTab === "clock" ? <Home is24Hour={is24Hour} /> : <Search />}
      <BottomNavigation activeTab={activeTab} setActiveTab={handleTabChange} />
    </div>
  );
}

export default App;
