import React from "react";

const Avatar = ({ name, width = 50, height = 50 }) => {
  let avatarName = "";

  if (name) {
    const splitName = name.split(" ");
    if (splitName.length > 1) {
      avatarName =
        splitName[0][0].toUpperCase() + splitName[1][0].toUpperCase();
    } else {
      avatarName = splitName[0][0].toUpperCase();
    }
  }

  return (
    <div
      style={{ width: width, height: height }}
      className="rounded-full bg-[#6F0081] text-white flex items-center justify-center font-bold text-lg"
    >
      {avatarName}
    </div>
  );
};

export default Avatar;
