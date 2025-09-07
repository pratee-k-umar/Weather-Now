interface BottomNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, setActiveTab }) => {
  const navigationItems = [
    { name: "clock", icon: "clock.png" },
    { name: "search", icon: "search.png" },
  ];

  return (
    <div className="fixed bottom-4 flex left-1/2 -translate-x-1/2 bg-transparent p-3 rounded-full">
      {navigationItems.map((item) => (
        <div
          key={item.name}
          className={`cursor-pointer rounded-full p-4 ${
            activeTab === item.name ? "bg-black" : "bg-white"
          }`}
          onClick={() => setActiveTab(item.name)}
        >
          <img
            src={item.icon}
            alt={item.name}
            className={`w-10 bg-transparent ${
              activeTab === item.name ? "brightness-0 invert" : ""
            }`}
          />
        </div>
      ))}
    </div>
  );
};

export default BottomNavigation;
