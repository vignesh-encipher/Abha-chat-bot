import React, { useCallback, useEffect } from "react";
import { Input } from "antd/lib";
import { SearchOutlined } from "@ant-design/icons/lib";
import { debounce, disallowedCharacters } from "@/utils/reusable";
const ReusableInput = ({
  setPageNumber,
  disabled,
  placeholder,
  value,
  isSearch,
  handleInputStr,
  name,
  setSearchText,
  height,
  props,
  width,
  className,
  type,
  prefixIcon,
  handleClear,
  localStr,
  setLocalStr,
}) => {
  const debounceFunc = useCallback(
    debounce((text) => setSearchText(text.trim()), 700),
    []
  );

  const handleChange = (text) => {
    setLocalStr && setLocalStr(text.trimStart());
    if (isSearch && !handleInputStr) {
      debounceFunc(text);
    } else {
      handleInputStr(name, text);
    }
    if (setPageNumber) setPageNumber(0);
  };

  useEffect(() => {
    setLocalStr && setLocalStr(value?.trimStart());
  }, []);

  return (
    <div>
      <Input
        {...props}
        placeholder={placeholder}
        value={localStr}
        onChange={(e) => {
          if (disabled) return;
          setLocalStr && setLocalStr(e.target.value.trimStart());
          handleChange(e.target.value);
        }}
        // maxLength={25}
        style={{ height: height || "40px" }}
        name={name}
        allowClear={true}
        disabled={disabled}
        autoComplete="off"
        suffix={
          prefixIcon ? (
            prefixIcon
          ) : (
            <SearchOutlined
              className={`text-secondary`}
              data-testid="fa-search"
            />
          )
        }
        onKeyDown={(e) => {
          // Prevent input of backslash ("\")
          if (disallowedCharacters.includes(e.key)) {
            e.preventDefault();
          }
        }}
        className={className}
        type={type}
        onClear={handleClear && handleClear}
      />
    </div>
  );
};

export default ReusableInput;
