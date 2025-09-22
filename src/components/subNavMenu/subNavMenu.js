import { useState, useEffect } from "react";
import { connect } from "react-redux";
import styles from "./styles.module.css";
import RegularButton from "../button";
import SubNavContent from "./subNavContent";
import ReusableFilters from "./reusableFilters";
import { createIdGen } from "@/utils/reusable";
import { getStorage } from "@/utils/storages";
const SubNavMenu = ({
  activeTab,
  handleTabs,
  tabs,
  allTabs,
  title,
  isAddBtn,
  btnName,
  btnOnclick,
  //filter
  filterOptions = {},
  setFilterOptions,
  initialFilterOptions,
  setSearchText,
  setSelectedDateRanges,
  setSelectedOption,
  setLocalStr,
  showFilters,
  isPrimaryBtn,
  primaryOnclick,
  disablePrimaryBtn,
  subNavContent,
  totalLength,
  pageLoad = false,
  fromSettings,
  dynamicList = [],
}) => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const currentRole = getStorage("userRole");
    setRole(currentRole ?? "");
  }, [pageLoad]);
  return (
    <div>
      <div
        className={`w-100 d-flex p-2 justify-content-between ${styles.headerContainer}`}
      >
        <div className="d-flex align-items-center  gap-2">
          <div className={styles.header}>{title}</div>
          {allTabs && (
            <div className={`${styles.tabContainer} d-flex`}>
              {tabs.map((item) => {
                const isActive = activeTab === item;
                return (
                  <div
                    className={`${
                      isActive ? styles.activeTab : styles.inactiveTab
                    } ${styles.tabItem} cr-pointer`}
                    onClick={() => handleTabs(item)}
                    data-testid={createIdGen(`${role} ${title} ${item}btn`)}
                    id={createIdGen(`${role} ${title} ${item}btn`)}
                  >
                    {item}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {/* {role !== "ADMIN" && ( */}
        <div className="d-flex justify-content-end ">
          {isPrimaryBtn && (
            <div
              className={`${styles.addBtnStyle} mx-2`}
              data-testid={createIdGen(`${role} ${title} ${isPrimaryBtn}btn`)}
              id={createIdGen(`${role} ${title} ${isPrimaryBtn}btn`)}
            >
              <RegularButton
                name={isPrimaryBtn}
                onClick={primaryOnclick}
                bg="#263E50"
                color="#fff"
                disabled={disablePrimaryBtn}
                id={createIdGen(`${role} navbar ${isPrimaryBtn}Button`)}
              />
            </div>
          )}
          {isAddBtn && (
            <div
              className={`${styles.addBtnStyle}`}
              data-testid={createIdGen(`${role} ${title} ${btnName}btn`)}
              id={createIdGen(`${role} ${title} ${btnName}btn`)}
            >
              <RegularButton
                name={btnName}
                onClick={btnOnclick}
                bg="#263E50"
                color="#fff"
                id={createIdGen(`${role} navbar ${btnName}Button`)}
              />
            </div>
          )}
          {showFilters && (
            <div
              data-testid={createIdGen(`${role} ${title} filterbtn`)}
              id={createIdGen(`${role} ${title} filterbtn`)}
            >
              <ReusableFilters
                filterOptions={filterOptions}
                setFilterOptions={setFilterOptions}
                initialFilterOptions={initialFilterOptions}
                setSearchText={setSearchText}
                setSelectedDateRanges={setSelectedDateRanges}
                setSelectedOption={setSelectedOption}
                setLocalStr={setLocalStr}
              />
            </div>
          )}
          {dynamicList.length > 0 && (
            <div className="d-flex">
              {dynamicList.map((item) => (
                <div className=" mx-2">
                  <span>{item.key} : </span>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
          )}

          {subNavContent && <SubNavContent totalLength={totalLength} />}
        </div>
        {/* )} */}
      </div>
      {!fromSettings && <div className={styles.navbar}></div>}
    </div>
  );
};
const enhancer = connect((state) => ({
  pageLoad: state?.admin?.patients?.getPageRendering,
}));
export default enhancer(SubNavMenu);
