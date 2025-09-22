import React, { useState } from "react";
import styles from "./styles.module.css";
import { Skeleton } from "antd";
import { useRouter } from "next/router";
import { createIdGen, reusableEllipses } from "../../utils/reusable";
import { Tooltip } from "antd/lib";

const Tabs = ({ tabsList, activeTab, onChangeTabs, isTooltip }) => {
  const router = useRouter();
  return (
    <div className={`${styles.tabMainConatiner}`}>
      <div className={`${styles.tabContainer} d-flex`}>
        {tabsList.map((item) => (
          // <Tooltip title={isTooltip && item.originalFileName}>
            <div
              fileId={item?.fileId}
              id={createIdGen(
                router.pathname.replaceAll("/", " ") + " " + item?.originalFileName
              )}
              data-testid={createIdGen(
                router.pathname.replaceAll("/", " ") + " " + item?.originalFileName
              )}
              className={`${
                activeTab?.originalFileName == item.originalFileName
                  ? styles.activeTab
                  : styles.inactiveTab
              } ${styles.tabItem}`}
              onClick={() => onChangeTabs(item)}
            >
              <label className={`my-0 cr-pointer`}>
                {reusableEllipses({str: item?.originalFileName?.replaceAll("_", " "), count: 10})}
              </label>
            </div>
          // </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
