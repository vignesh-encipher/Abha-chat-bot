import { Select } from "antd/lib";
import React from "react";
import styles from "../filters/styles.module.css"
const ReusableSelect = ({
  setPageNumber,
  handleSelectChange,
  placeholder,
  truncatePlaceholder,
  options,
  selectorValue,
  disabled,
  allowClearOpt,
  setSelectedOption,
  name,
  form,
  handleClear,
  showSearch = true,
  height,
  setSelectedRows,
}) => {
  const handleChangeWithConfirmation = (value) => {
    if (handleSelectChange) handleSelectChange(name, value);
    updateOption(value);

    if (setPageNumber) setPageNumber(0);
    if (setSelectedRows) setSelectedRows([]);
  };

  const updateOption = (value) => {
    if (setSelectedOption)
      setSelectedOption((prev) => ({ ...prev, [name]: value }));
    if (form) {
      form.setFieldValue(name, value);
    }
  };
  return (
    <div>
      <Select
        placeholder={
          truncatePlaceholder ? (
            <div className="truncate">{placeholder}</div>
          ) : (
            placeholder
          )
        }
        className={`w-100 ${styles.selectFilter}`}
        options={options}
        value={selectorValue}
        onChange={handleChangeWithConfirmation}
        allowClear={allowClearOpt}
        onClear={() => {
          handleClear&&handleClear(name, null)
        }}
        style={{ height: height || "100%" }}
        disabled={disabled}
        showSearch={showSearch}
        filterOption={(input, option) =>
          option?.label.toLowerCase().includes(input.trim().toLowerCase())
        }
      />
    </div>
  );
};

export default ReusableSelect;
