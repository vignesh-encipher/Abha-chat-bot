import React from "react";
import Style from "./style.module.css";

const RegularButton = ({ type, name, onClick, width,disabled,loading }) => {
  return (
    <button
      className={`btn mx-1 ${
        type === "outline" ? Style.outer : Style.btnColor
      }`}
      onClick={onClick}
      style={{ width: width}}
      disabled={disabled}
    >
      {loading?"Loading...":name}
    </button>
  );
};

export default RegularButton;
