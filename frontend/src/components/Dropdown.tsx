import { useRef, useState, useEffect } from 'react';

type DropdownProps<T> = {
  options: T[];
  selectedOption: T;
  onOptionSelect: (option: T) => void;
  label?: string;
  containerClassName?: string;       // Custom class for container
  buttonClassName?: string;          // Custom class for dropdown button
  dropdownClassName?: string;        // Custom class for dropdown options
};

const Dropdown = <T extends string | { label: string; value: string }>({
  options,
  selectedOption,
  onOptionSelect,
  label,
  containerClassName = '',          // Default to empty string if not provided
  buttonClassName = '',
  dropdownClassName = '',
}: DropdownProps<T>) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option: T) => {
    onOptionSelect(option);
    setOpenDropdown(false);
  };

  // Helper function to get display text
  const getOptionLabel = (option: T) =>
    typeof option === 'string' ? option : option.label;

  return (
    <div className={`relative  hover:bg-slate-200 ${containerClassName} `} ref={dropdownRef}>
      {label && <label className="block text-sm font-semibold mb-1">{label}</label>}
      
      <div
        className={`flex justify-center items-center gap-3 cursor-pointer px-5  p-1 rounded-[4px] ${buttonClassName}`}
        onClick={() => setOpenDropdown(!openDropdown)}
      >
        <h1 className="text-[14px] font-semibold tracking-wide text-slate-700">
          {getOptionLabel(selectedOption)}
        </h1>
        <img src="/images/dropdown.png" alt="down-arrow" className="size-[11px]" />
      </div>

      {openDropdown && (
        <div className={`text-[14px] newShadow py-3 w-40 text-center rounded-[4px] absolute left-0 top-[120%] bg-white ${dropdownClassName}`}>
          {options.map((option, index) => (
            <div
              key={index}
              className={`h-8 hover:bg-slate-100 text-center flex items-center justify-center cursor-pointer ${
                getOptionLabel(option) === getOptionLabel(selectedOption) ? 'font-bold' : ''
              }`}
              onClick={() => handleOptionClick(option)}
            >
              <p>{getOptionLabel(option)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
