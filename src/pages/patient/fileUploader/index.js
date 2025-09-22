import React, { useRef, useState } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import styles from "./style.module.css";
import { actions as allActions } from "@/store/downloader/downloader";

export const normalizeFileName = (name) => {
  return name
    .replace(/,/g, "") // Remove commas
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, "_") // Replace spaces with underscores
    .replace(/\.pdf$/, ""); // Remove ".pdf" extension
};
const FileUploader = ({
  height = "200px",
  setFilesList,
  handleFilesChange,
  filesList,
}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const removeDuplicates = (files, e) => {
    if (files && files.length > 0) {
      const filesArray = Array.from(files);

      const existingNames = new Set(
        filesList
          .filter((f) => f.name) // guard against empty objects
          .map((f) => normalizeFileName(f.name))
      );
      const uniqueFiles = [];
      const duplicateFiles = [];

      for (const file of filesArray) {
        const normalized = normalizeFileName(file.name);
        if (!existingNames.has(normalized)) {
          uniqueFiles.push(file);
          existingNames.add(normalized); // prevent intra-batch duplicates too
        } else {
          duplicateFiles.push(file.name);
        }
      }

      if (uniqueFiles.length > 0) {
        setFilesList((prev) => [...prev, ...uniqueFiles]);
        handleFilesChange(uniqueFiles);
      }

      if (duplicateFiles.length > 0) {
        alert(`Duplicate file(s): ${duplicateFiles.join(", ")}`);
      }

      e.target.value = null;
    }
  };
  const handleChange = async (e) => {
    const files = e?.target?.files;
    removeDuplicates(files, e);
  };

  // Handle drag-over event
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  // Handle drag-leave event
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    removeDuplicates(files, e);
    // if (files && files.length > 0) {
    //   const filesArray = Array.from(files);
    //   setFilesList((prev) => [...prev, ...filesArray]);
    //   handleFilesChange(filesArray);
    //   e.target.value = null;
    // }
  };
  return (
    <div className={styles.cover}>
      <label
        style={{ height: height }}
        className={`d-flex justify-content-center align-items-center cr-pointer`}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          className="input"
          type={"file"}
          onChange={handleChange}
          name="file"
          multiple={
            true
            // action==="Bulk Upload"?true:false
          }
          id="file-input"
          accept={".pdf"}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
        <div
          className={`ant-badge ${
            isDragging ? styles.dragOver : styles.videoFlex
          }`}
        >
          <FontAwesomeIcon
            icon={faArrowUpFromBracket}
            className={`${styles.icon} my-2`}
          />
          <div className={`${styles.header} my-2`}>
            Drag & drop files or Browse
          </div>
          <div className={`${styles.subText} my-2`}>Supported format : PDF</div>
        </div>
      </label>
    </div>
  );
};
const connector = connect((state) => ({ state }), {
  getUploadFiles: allActions.getUploadFiles,
  getBlobUrl: allActions.getBlobUrl,
});
export default connector(FileUploader);
