import React, { useEffect, useState } from "react";
import Image from "next/image";
import { connect } from "react-redux";
import { Tooltip } from "antd/lib";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons/lib";
import styles from "../styles.module.css";
// import filter from "../../../../assets/dashboard/filter.png";
import RegularButton from "@/components/button";
import { getStorage } from "@/utils/storages";
import { createIdGen } from "@/utils/reusable";

const ReusableFilters = ({
  filterOptions,
  setFilterOptions,
  setSearchText,
  setSelectedOption,
  setSelectedDateRanges,
  setLocalStr,
  initialFilterOptions,
  title,
  pageLoad = false,
}) => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const currentRole = getStorage("userRole");
    setRole(currentRole ?? "");
  }, [pageLoad]);
  const handleSelectAll = () => {
    const updatedFilterOptions = Object.keys(filterOptions).reduce(
      (acc, item) => {
        acc[item] = { ...filterOptions[item], active: true };
        return acc;
      },
      {}
    );

    setFilterOptions(updatedFilterOptions);
  };
  const handleReset = () => {
    setFilterOptions(initialFilterOptions);
    setSearchText && setSearchText("");
    setSelectedOption && setSelectedOption({});
    setSelectedDateRanges && setSelectedDateRanges({});
    setLocalStr && setLocalStr(null);
  };

  const handleFilterInput = (key) => {
    setFilterOptions((prev) => ({
      ...prev,
      [key]: { ...prev[key], active: !prev[key].active },
    }));
  };
  const filterTooltip = (
    <div className={`${styles.tooltip}`}>
      <div className={`${styles.tooltipContent}`} style={{ gap: "10px" }}>
        <div
          className={`mt-1 d-flex align-items-center justify-content-center ${styles.addBtnStyle}`}
        >
          <RegularButton
            name={"Select All"}
            onClick={handleSelectAll}
            bg="#263E50"
            color="#fff"
            id={createIdGen(`${role} filter selectAllButton`)}
          />
        </div>
        {Object?.keys(filterOptions).map((item) => {
          return (
            <div className="d-flex justify-content-between align-items-center mt-2 w-100">
              <div style={{ color: "black" }}>{item}</div>
              <div style={{ marginLeft: "20px" }}>
                <span
                  style={{ color: "black" }}
                  className="cr-pointer"
                  onClick={() => {
                    handleFilterInput(item);
                  }}
                >
                  {!filterOptions[item].active ? (
                    <div
                      data-testid={createIdGen(
                        `${role} ${title} ${item} eyevisibilebtn`
                      )}
                      id={createIdGen(
                        `${role} ${title} ${item} eyevisibilebtn`
                      )}
                    >
                      <EyeInvisibleOutlined style={{ color: "black" }} />
                    </div>
                  ) : (
                    <div
                      data-testid={createIdGen(
                        `${role} ${title} ${item} eyeclosedbtn`
                      )}
                      id={createIdGen(`${role} ${title} ${item} eyeclosedbtn`)}
                    >
                      <EyeOutlined style={{ color: "black" }} />
                    </div>
                  )}
                </span>
              </div>
            </div>
          );
        })}
        <div
          className={`mt-1 d-flex align-items-center justify-content-center ${styles.addBtnStyle}`}
        >
          <RegularButton
            name={"Reset"}
            onClick={handleReset}
            bg="#263E50"
            color="#fff"
            id={createIdGen(`${role} filter resetButton`)}
          />
        </div>
      </div>
    </div>
  );
  return (
    <div>
      <div className={styles.filterIcon}>
        <Tooltip
          title={filterTooltip}
          placement="bottomLeft"
          color="white"
          trigger={"click"}
        >
          {/* <div className={`${styles.nonActive}`}>
            <Image src={filter} alt="filter" className={`${styles.icon}`} />
            Filter
          </div> */}
        </Tooltip>
      </div>
    </div>
  );
};
const enhancer = connect((state) => ({
  // pageLoad: state?.admin.patients.getPageRendering,
}));

export default enhancer(ReusableFilters);
