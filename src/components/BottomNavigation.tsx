import { useState } from "react";

interface BottomNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const BottomNavigation = ({ activeTab, setActiveTab  }): BottomNavigationProps<any> => {
  const navigationItems = [
    { name: "clock", icon: "clock.png" },
    { name: "search", icon: "search.png" },
  ];

  const [tab, setTab] = useState("clock")

  return (
    <div className="fixed bottom-4 flex left-1/2 -translate-x-1/2 bg-transparent p-3 rounded-full">
      {navigationItems.map((item) => (
        <div
          key={item.name}
          className={`cursor-pointer rounded-full p-4 ${
            tab === item.name ? "bg-black" : "bg-white"
          }`}
          onClick={() => setTab(item.name as "clock" | "search")}
        >
          <img
            src={item.icon}
            alt={item.name}
            className={`w-10 bg-transparent ${
              tab === item.name ? "brightness-0 invert" : ""
            }`}
          />

        </div>
      ))}
    </div>
  );
};

export default BottomNavigation;
