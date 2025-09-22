import React from "react";
import { Pagination } from "antd/lib";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./style.module.css";
import RegularButton from "../button";
import { createIdGen } from "@/utils/reusable";
import { getStorage } from "@/utils/storages";

const ReusablePagination = ({
  totalLength,
  totalPages,
  pageNumber,
  setPageNumber,
  setPaginationFirst,
  pageSize,
  initialPage,
}) => {
  const userRole = getStorage("userRole");
  const handlePagination = (page) => {
    setPageNumber(page - 1);
    if (initialPage) {
      setPaginationFirst(page);
    }
  };
  const itemRender = (current, type, originalElement) => {
    if (type === "prev") {
      return (
        <div
          className={`${styles.button} d-flex justify-content-center align-items-center`}
        >
          <RegularButton
            name={
              <FontAwesomeIcon
                icon={faAngleLeft}
                className="d-flex justify-content-center align-items-center"
              />
            }
            bg="transparent"
            classes="px-0 py-0"
            id={createIdGen(`${userRole} pagination prevButton`)}
             type="outline"
          />
        </div>
      );
    }
    if (type === "next") {
      return (
        <div
          className={`${styles.button} d-flex justify-content-center align-items-center`}
        >
          <RegularButton
            name={
              <FontAwesomeIcon
                icon={faAngleRight}
                className="d-flex justify-content-center align-items-center"
              />
            }
            bg="transparent"
            classes="px-0 py-0"
            id={createIdGen(`${userRole} pagination nextButton`)}
            type="outline"
          />
        </div>
      );
    }
    return originalElement;
  };
  return (
    totalLength > 0 && (
      <div className={`d-flex justify-content-center gap-2 ${styles.layout}`}>
        {totalPages > 1 && (
          <div
            className={`${styles.button} d-flex justify-content-center align-items-center bg-white`}
          >
            <RegularButton
              name={<FontAwesomeIcon icon={faAnglesLeft} />}
              onClick={() => handlePagination(1)}
              bg="transparent"
              data-testid="previous-button"
              classes="px-0 py-0"
              id={createIdGen(`${userRole} pagination prev1Button`)}
               type="outline"
            />
          </div>
        )}
        <div className="d-flex flex-wrap">
          {/* {totalLength > 0 && ( */}
          <div className={`pagination ${styles.paginationBtn}`}>
            <Pagination
              total={totalLength}
              current={pageNumber + 1}
              itemRender={itemRender}
              onChange={(page) => {
                handlePagination(page);
              }}
              pageSize={pageSize}
              showSizeChanger={false}
            />
          </div>
          {/* )} */}
        </div>
        {totalPages > 1 && (
          <div
            className={`${styles.button} d-flex justify-content-center align-items-center`}
          >
            <RegularButton
              name={<FontAwesomeIcon icon={faAnglesRight} />}
              onClick={() => setPageNumber(totalPages - 1)}
              bg="transparent"
              classes="px-0 py-0"
              id={createIdGen(`${userRole} pagination next1Button`)}
               type="outline"
            />
          </div>
        )}
        <div
          className={`d-flex justify-content-center align-items-center text-secondary ${styles.totalElementsCount}`}
        >
          <span className={`${styles.totalElementsColor} font2`}>
            TotalElements&nbsp;:&nbsp;
          </span>
          {totalLength < 10 ? `0${totalLength}` : totalLength}
        </div>
      </div>
    )
  );
};

export default ReusablePagination;
