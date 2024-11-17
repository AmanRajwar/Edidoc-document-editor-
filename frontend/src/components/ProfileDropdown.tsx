import React, { useState } from "react";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div className="absolute right-0 w-64 mt-1 bg-white border rounded-lg shadow-md p-4">
      {/* Profile Image */}
      <div className="flex flex-col items-center">
        <img
          src="images/user.png" // Replace with the actual image path
          alt="Profile Avatar"
          className="w-16 h-16 rounded-full object-cover"
        />
        <h2 className="mt-3 text-lg font-medium text-gray-800">Aman Rajwar</h2>
      </div>

      {/* Divider */}
      <hr className="my-4 border-gray-200" />

      {/* Options */}
      <div className="space-y-2">
        <button className="w-full text-left text-gray-600 hover:bg-gray-100 px-4 py-2 rounded">
          Settings
        </button>
        <button className="w-full text-left text-gray-600 hover:bg-gray-100 px-4 py-2 rounded">
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
