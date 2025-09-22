import React from "react";
import styles from "./styles.module.css";
function SubNavContent({ totalLength }) {
  const subNavItems = [
    { name: "Total Patients", value: totalLength },
    // { name: "Patients Reassigned", value: 3 },
    // { name: "Patients Completed", value: 2 },
  ];

  return (
    <div className={`d-flex justify-content-end align-items-center ${styles.SubNavContent}`}>
      {subNavItems?.map((item) => (
        <div key={item.name} className="ps-3 fw-bold">
          <span className="fw-bold">{item.name}</span> :{" "}
          {item.value < 10
            ? item.value === 0
              ? 0
              : "0" + item.value
            : item.value}
        </div>
      ))}
    </div>
  );
}

export default SubNavContent;
