import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Sidebar = () => {
  const [filters, setFilters] = useState({
    District: { checked: false, options: ["Option 1", "Option 2", "Option 3"] },
    Gida: { checked: false, options: ["Option 1", "Option 2"] },
    Status: { checked: false, options: ["Option 1", "Option 2"] },
    Type: { checked: false, options: ["Option 1", "Option 2"] },
    Classification: { checked: false, options: ["Option 1", "Option 2"] },
    CmsProvider: { checked: false, options: ["Option 1", "Option 2", "Option 3", "Option 4"] },
    LinkProvider: { checked: false, options: ["Option 1", "Option 2"] },
    ElcacArea: { checked: false, options: ["Option 1", "Option 2"] },
    Procurement: { checked: false, options: ["Option 1", "Option 2"] },
    ContractEnd: { checked: false, options: ["Option 1", "Option 2"] },
    Technology: { checked: false, options: ["Fiber Optic", "Satellite", "DSL", "Wireless", "Others"] }
  });

  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});

  const toggleCheckbox = (filterKey) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: { ...prev[filterKey], checked: !prev[filterKey].checked }
    }));
  };

  const toggleDropdown = (filterKey) => {
    setOpenDropdown(openDropdown === filterKey ? null : filterKey);
  };

  const toggleOption = (filterKey, option) => {
    setSelectedOptions((prev) => {
      const currentOptions = prev[filterKey] || [];
      const newOptions = currentOptions.includes(option)
        ? currentOptions.filter((opt) => opt !== option)
        : [...currentOptions, option];
      return { ...prev, [filterKey]: newOptions };
    });
  };

  return (
<div className="absolute w-[262px] bg-[#17319E] text-white p-4 flex flex-col 
        font-montserrat max-h-screen overflow-y-auto overflow-x-hidden custom-scrollbar">

      <div className="flex items-center space-x-2">
        <img src="/logo.webp" alt="DICT Logo" className="w-30" />
        <img src="/freewifilogo.png" alt="Free WiFi Logo" className="w-30" />
      </div>

      <div className="relative mt-4">
        <input
          type="text"
          placeholder="Search province, district, or city"
          className="w-[228px] h-[30px] p-2 pl-8 rounded bg-white text-gray-700"
        />
        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M16.65 10.35a6.3 6.3 0 11-12.6 0 6.3 6.3 0 0112.6 0z"
            />
          </svg>
        </span>
      </div>

      <div className="mt-6 space-y-4">
        <label className="block text-white font-bold mb-2 text-lg">Filters</label>

        {Object.keys(filters).map((filterKey) => (
          <div key={filterKey} className="flex flex-col">
            <div className="flex items-center justify-between bg-[#223DAC] p-2 rounded cursor-pointer">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters[filterKey].checked}
                  onChange={() => toggleCheckbox(filterKey)}
                  className="w-4 h-4 accent-blue-500"
                />
                <span className="text-white">{filterKey.replace(/([A-Z])/g, " $1")}</span>
              </label>

              <button onClick={() => toggleDropdown(filterKey)} className="ml-2">
                {openDropdown === filterKey ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>

            {openDropdown === filterKey && (
              <div className="mt-1 bg-[#17319E] text-white rounded p-2 transition-all duration-300 text-sm">
                {filters[filterKey].options.map((option) => (
                  <label
                    key={option}
                    className="flex items-center space-x-2 p-2 pl-6 hover:bg-[#1A2F85] rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedOptions[filterKey]?.includes(option) || false}
                      onChange={() => toggleOption(filterKey, option)}
                      className="w-4 h-4 accent-blue-500"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar; 
