import React from "react";

const Avatar = ({ name }) => {
  const firstLetter = name ? name.charAt(0).toUpperCase() : "?";

  return (
    <div
      className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-xl"
    >
      {firstLetter}
    </div>
  );
};

export default Avatar;
