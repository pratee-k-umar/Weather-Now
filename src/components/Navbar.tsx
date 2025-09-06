import "./../App.css";

interface NavbarProps {
  is24Hour: boolean;
  setIs24Hour: (value: boolean) => void;
}

function Navbar({ is24Hour, setIs24Hour }: NavbarProps) {
  return (
    <div className="navbar flex justify-between items-center px-4 h-16">
      <img src="logo.png" alt="Logo" className="w-15" />
      <div className="slider rounded-full w-28 h-9 relative shadow-xl">
        <div
          className={`absolute inset-y-0 my-auto w-[52px] h-8 bg-black rounded-full shadow transition-all duration-300 mx-0.5 ${
            is24Hour ? "translate-x-[54px]" : ""
          }`}
        />
        <div className="relative flex h-full">
          <button
            className={`w-[54px] h-full z-10 transition-colors duration-300 ${
              !is24Hour ? "text-white" : "text-black"
            }`}
            onClick={() => setIs24Hour(false)}
          >
            12h
          </button>
          <button
            className={`w-[54px] h-full z-10 transition-colors duration-300 ${
              is24Hour ? "text-white" : "text-black"
            }`}
            onClick={() => setIs24Hour(true)}
          >
            24h
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
