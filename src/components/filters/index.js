import React from "react";
import { DatePicker, Form, Row, Col, Input, message } from "antd/lib";
import moment from "moment";
import ReusableInput from "../reUsableInput";
import ReusableSelect from "../reUsableSelect";
import {
  createIdGen,
  disableFutureDates,
  getCamelCase,
} from "@/utils/reusable";
import { getStorage } from "@/utils/storages";
import styles from "./styles.module.css";
import { connect } from "react-redux";
import { useState, useEffect } from "react";
import RegularButton from "@/components/button";
const { RangePicker } = DatePicker;

const Filters = ({
  FilterItems,
  // for search
  setSearchText,
  searchText,
  localStr,
  setLocalStr,
  // forSelector
  setSelectedOption,
  selectedOption,
  // for picker
  setSelectedDateRanges,
  setSelectedDates,
  selectedDates,
  disabledDate,
  setPageNumber,
  fieldSize,
  opt,
  handleInputStr,
  setSelectedRows,
  defaultSelectorValue,
  title,
  pageLoad = false,
  handleBatchCount,
  totalLength,
  handleSelectChange,
  onGenerateClick,
}) => {
  const [form] = Form.useForm();
  const [role, setRole] = useState(null);
  const [count, setCount] = useState(null);
  useEffect(() => {
    const currentRole = getStorage("userRole");
    setRole(currentRole ?? "");
  }, [pageLoad]);

  const handleRangePicker = (dates, dateString, name) => {
    const tabName = getCamelCase(name);
    const formattedDates = Array.isArray(dateString)
      ? dateString?.map((date, index) => {
          const formattedDate =
            index === 1
              ? date &&
                `${moment(date, "MM-DD-YYYY").format(
                  "YYYY-MM-DD"
                )}T23:59:59.999Z`
              : date &&
                `${moment(date, "MM-DD-YYYY").format(
                  "YYYY-MM-DD"
                )}T00:00:00.000Z`;
          return formattedDate;
        })
      : dateString
      ? `${moment(dateString, "MM-DD-YYYY").format("YYYY-MM-DD")}T00:00:00.000Z`
      : null;
    setSelectedDates((prevOptions) => ({
      ...prevOptions,
      [name]: dates,
    }));
    setSelectedDateRanges((prevOptions) => ({
      ...prevOptions,
      [tabName]: Array.isArray(dateString)
        ? { startDate: formattedDates[0], endDate: formattedDates[1] }
        : formattedDates,
    }));
    if (setPageNumber) setPageNumber(0);
  };
  const handleCount = (value) => {
    if (!value) {
      setCount("");
      handleBatchCount("");
    } else if (value > totalLength) {
      message.warning("Please enter proper count");
    } else {
      setCount(value);
    }
  };
  return (
    <Row className="w-100 d-flex align-items-center gap-2">
      {FilterItems &&
        Object.values(FilterItems)
          ?.filter((item) => item.active)
          .map((item, index) => {
            switch (item?.type) {
              case "search":
                return (
                  <Col
                    key={`${item?.title}-${index}`}
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={fieldSize || 3}
                    className={`${styles.filterBox} custom-col-size`}
                  >
                    {!item?.noLabel && (
                      <div
                        className={`d-flex mb-2 mx-2 text-truncate ${styles.filterTitle}`}
                      >
                        {item?.title}
                      </div>
                    )}
                    <div
                      className="custom-rangePicker"
                      data-testid={createIdGen(
                        `${role} ${title} ${item?.title}btn`
                      )}
                      id={createIdGen(`${role} ${title} ${item?.title}btn`)}
                    >
                      <ReusableInput
                        className={styles.filterContainer}
                        placeholder={item?.placeholder}
                        value={searchText}
                        isSearch={item?.type === "search" ? true : false}
                        setSearchText={setSearchText}
                        autoComplete="off"
                        setPageNumber={setPageNumber}
                        localStr={localStr || null}
                        setLocalStr={setLocalStr}
                        handleInputStr={handleInputStr}
                      />
                    </div>
                  </Col>
                );
              case "select":
                return (
                  <Col
                    key={`${item?.title}-${index}`}
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={fieldSize || 3}
                    keys={index}
                    className="custom-col-size"
                  >
                    {!item?.noLabel && (
                      <div
                        className={`d-flex mb-2 mx-2 text-truncate ${styles.filterTitle}`}
                      >
                        {item?.title}
                      </div>
                    )}
                    <div
                      className="w-100"
                      data-testid={createIdGen(
                        `${role} ${title} ${item?.title} select filter`
                      )}
                      id={createIdGen(
                        `${role} ${title} ${item?.title} select filter`
                      )}
                    >
                      <ReusableSelect
                        className={styles.filterContainer}
                        placeholder={item?.placeholder}
                        options={opt ? opt[item?.title] : item?.options}
                        selectorValue={
                          selectedOption?.[getCamelCase(item?.title)] ||
                          defaultSelectorValue ||
                          null
                        }
                        selectedOption={selectedOption}
                        setSelectedOption={setSelectedOption}
                        form={form}
                        allowClearOpt={
                          item?.allowClear?.toString() ? item?.allowClear : true
                        }
                        name={getCamelCase(item?.title)}
                        truncatePlaceholder={item?.truncatePlaceholder}
                        showSearch={item?.showSearch || false}
                        setPageNumber={setPageNumber}
                        setSelectedRows={setSelectedRows}
                        handleSelectChange={handleSelectChange}
                      />
                    </div>
                  </Col>
                );

              // rangePicker
              case "rangePicker":
                return (
                  <Col
                    key={`${item?.title}-${index}`}
                    xs={12}
                    sm={6}
                    md={4}
                    lg={4}
                    xl={fieldSize || 3}
                  >
                    <div
                      className={`d-flex mb-2 mx-2 text-truncate ${styles.filterTitle}`}
                    >
                      {item?.showTitle || item?.showTitle == null
                        ? item?.title
                        : ""}
                    </div>
                    <div
                      className="w-100 custom-rangePicker"
                      data-testid={createIdGen(
                        `${role} ${title} ${item?.title} range picker filter`
                      )}
                      id={createIdGen(
                        `${role} ${title} ${item?.title} range picker filter`
                      )}
                    >
                      <RangePicker
                        className={`w-100 ${styles.filterContainer}`}
                        format="MM/DD/YYYY"
                        style={{ height: "30px" }}
                        value={selectedDates?.[item?.title]}
                        onChange={(date, dateString) => {
                          handleRangePicker(date, dateString, item?.title);
                        }}
                        allowClear={true}
                        disabledDate={
                          disabledDate
                            ? (current) => disableFutureDates(current)
                            : null
                        }
                        showToday={false}
                      />
                    </div>
                  </Col>
                );
              case "datePicker":
                return (
                  <Col
                    key={`${item?.title}-${index}`}
                    xs={12}
                    sm={6}
                    md={4}
                    lg={4}
                    xl={fieldSize || 3}
                  >
                    <div
                      className={`d-flex mb-2 mx-2 text-truncate ${styles.filterTitle}`}
                    >
                      {item?.title}
                    </div>
                    <div
                      className="w-100 custom-rangePicker"
                      data-testid={createIdGen(
                        `${role} ${title} ${item?.title} date picker filter`
                      )}
                      id={createIdGen(
                        `${role} ${title} ${item?.title} date picker filter`
                      )}
                    >
                      <DatePicker
                        className={`w-100 ${styles.filterContainer}`}
                        format="MM/DD/YYYY"
                        style={{ height: "30px" }}
                        value={selectedDates?.[item?.title]}
                        onChange={(date, dateString) => {
                          handleRangePicker(date, dateString, item?.title);
                        }}
                        allowClear={true}
                        disabledDate={
                          disabledDate
                            ? (current) => disableFutureDates(current)
                            : null
                        }
                        showToday={false}
                      />
                    </div>
                  </Col>
                );
              case "batchCount":
                return (
                  <Col
                    key={item}
                    xs={12}
                    sm={6}
                    md={4}
                    lg={fieldSize || 3}
                    xl={fieldSize || 3}
                  >
                    <div
                      className={`d-flex mb-2 mx-2 text-truncate ${styles.filterTitle}`}
                    >
                      {item?.title}
                    </div>
                    <div
                      data-testid={createIdGen(
                        `${role} ${title} ${item?.title} `
                      )}
                      id={createIdGen(`${role} ${title} ${item?.title} `)}
                      // className="batchCount d-flex align-items-end"
                      // style={{border:"1px solid #d9d9d9",borderRadius:"5px"}}
                    >
                      <Input
                        placeholder="Enter Count"
                        className={styles.filterContainer}
                        style={{ height: "40px", padding: "4px 2px 4px 11px" }}
                        value={count}
                        allowClear
                        // type="number"
                        min={1}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) {
                            handleCount(value);
                          }
                        }}
                        suffix={
                          <button
                            name="Submit"
                            type="button"
                            className={`px-2 ${styles.batchCountBtn}`}
                            onClick={() => {
                              handleBatchCount(count);
                            }}
                          >
                            Submit
                          </button>
                        }
                      />
                    </div>
                  </Col>
                );

              case "generateReport":
                return (
                  <Col
                    key={`${item?.title}-${index}`}
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={fieldSize || 3}
                    className={`${styles.filterBox} custom-col-size`}
                  >
                    <div className="mt-4">
                      <RegularButton
                        name="Generate"
                        type="button"
                        bg="#263E50"
                        borderRadius="5px"
                        color="#fff"
                        classes="px-2 py-0 mx-2"
                        onClick={onGenerateClick}
                        id={createIdGen(`${role} Tin generateButton`)}
                      />
                    </div>
                  </Col>
                );
            }
          })}
    </Row>
  );
};
const enhancer = connect((state) => ({
  pageLoad: state?.admin?.patients?.getPageRendering,
}));

export default enhancer(Filters);
