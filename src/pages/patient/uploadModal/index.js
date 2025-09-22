import React, { useState } from "react";
import dayjs from "dayjs";
import { connect } from "react-redux";
import { Select, Input, Popover } from "antd/lib";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { InfoCircleOutlined } from "@ant-design/icons/lib";
import styles from "../fileUploader/style.module.css";
import uploadStyle from "../fileUploader/style.module.css";
import FileUploader, { normalizeFileName } from "../fileUploader";
import MultipleUpload from "../multipleUpload";
import RegularButton from "@/components/button";
import { createIdGen, getResponsePopup, pdfEncrypt } from "@/utils/reusable";
import { actions as patientActions } from "@/store/patients";
import { getStorage } from "@/utils/storages";
import { pdfControl, portalPdfUrl, serverControl } from "@/utils/config";

export const getUploaderFunc = async ({
  filesList,
  setLoader,
  getUploadFiles,
  openModal,
  getCall,
  getFileUrl,
  setOpenModal
}) => {
  setLoader(true);
  const uploadPromises = filesList?.map((item) => {
    const formData = new FormData();
    formData.append("file", item);
    formData.append("patientId", openModal?.data?.id || "");
    return getUploadFiles({ obj: formData });
  });
  const responses = await Promise.all(uploadPromises);
  let allSuccessful = true;
  responses?.forEach((res, idx) => {
    if (res?.status !== "SUCCESS") {
      allSuccessful = false;
      getResponsePopup(res);
      // getCall();
      getFileUrl(openModal?.data?.id);
    }
  });

  setLoader(false);
  if (allSuccessful) {
    getResponsePopup(responses[responses.length - 1]);
    getCall();
    getFileUrl(openModal?.data?.id);
    setOpenModal({status:false,data:null})
  }
};

export const getBulkUploaderFunc = async ({
  filesList,
  setFilesList,
  setLoader,
  getUploadFiles,
  setProcessingFilesList,
  getCall,
}) => {
  setProcessingFilesList({
    processing: filesList,
    completed: [],
    failed: [],
  });

  const MAX_CONCURRENT_UPLOADS = 5;

  const processFile = async (item) => {
    const formData = new FormData();
    formData.append("file", item);

    try {
      const response = await getUploadFiles({ obj: formData });
      if (!response?.response) {
        getResponsePopup(response);
      }
      return {
        item,
        status: response?.status === "SUCCESS" ? "SUCCESS" : "FAILED",
      };
    } catch (error) {
      return { item, status: "FAILED" };
    }
  };
  const workerPool = async (files) => {
    const queue = [...files];
    const results = [];
    const runWorker = async () => {
      while (queue.length > 0) {
        const item = queue.shift();
        const result = await processFile(item);
        results.push(result);
        setProcessingFilesList((prevState) => {
          const newState = { ...prevState };
          newState.processing = newState.processing.filter(
            (file) => file !== item
          );
          if (result.status === "SUCCESS") {
            newState.completed = [...newState.completed, item];
          } else {
            newState.failed = [...newState.failed, item];
          }
          return newState;
        });
      }
    };
    const workers = Array(Math.min(MAX_CONCURRENT_UPLOADS, files.length))
      .fill(null)
      .map(runWorker);
    await Promise.all(workers);
    return results;
  };
  const results = await workerPool(filesList);
  if (setFilesList) setFilesList([]);
  if (setLoader) setLoader(false);
  const completedFiles = results
    .filter((res) => res.status === "SUCCESS")
    .map((res) => res.item);
  if (completedFiles.length > 0) {
    getResponsePopup(completedFiles[completedFiles.length - 1]);
    getCall();
  }
};

const UploadModal = ({
  openModal,
  activeTab,
  values,
  setValues,
  filesList,
  setFilesList,
  getUploadFiles,
  notCompleteLoader,
  recordsList,
  getCall,
  setOpenModal,
  getFileUrl,
}) => {
  const role = getStorage("userRole");
  const [loader, setLoader] = useState(false);

  const handleNextFunctionality = async (activeTab, notCompleteData) => {
    setLoader(true);
    
    // const currentItem = getAllList?.findIndex(
    //   (item) => item?.patientId === openModal?.data?.id
    // );
    // const data = {
    //   patientId: openModal?.data?.id,
    //   role: getStorage("userRole"),
    //   processedStatus: "DOWNLOADER_COMPLETED",
    // };
    // // const res = await changeProcessedStatus(data);
    // const res1 = await getOneDownLoadersList({
    //   patientId: getAllList[currentItem + 1]?.patientId,
    // });
    // const updateAPI =
    //   activeTab === "Not Complete"
    //     ? getNotComplete({ obj: data })
    //     : saveAndNext({ patientId: openModal?.data?.id });
    // const res2 = await updateAPI;
    // if (
    //   res?.status === "SUCCESS" &&
    //   res2?.status === "SUCCESS" &&
    //   res2?.status === "SUCCESS"
    // ) {
    //   setOpenModal({
    //     status: true,
    //     data: res1?.response?.patientDtoPageList?.content[0],
    //     action: "Patient List",
    //   });
    //   setLoader(false);
    //   getResponsePopup(res);
    //   setFilesList([]);
    //   setValues({ reason: "", comments: "" });
    //   getCall();
    //   getAllList[currentItem + 1]?.patientId &&
    //     getFileUrl(getAllList[currentItem + 1]?.patientId);
    //   if (getAllList?.length === currentItem + 1) {
    //     setOpenModal({ status: false, data: null });
    //   }
    // }
  };

  const handleFilesChange = (list) => {
    // openModal?.action !== "Bulk Upload"
    //   ? 
      getUploaderFunc({
          filesList: list,
          setLoader,
          getUploadFiles,
          openModal,
          getFileUrl,
          getCall,
          setFileList: setFilesList,
          setOpenModal,
        })
      // : getBulkUploaderFunc({
      //     filesList: list,
      //     setFilesList,
      //     setLoader,
      //     getUploadFiles: getBulkUploadFiles,
      //     setProcessingFilesList,
      //     getCall,
      //   });
  };
  const handleNext = async (list) => {
    // if (list && list?.length > 0 && activeTab === "Upload") {
    const data = {
      patientId: openModal?.data?.id,
      notCompleteReason: {
        reasonType: values?.reason || "",
        comments: values?.comments || "",
      },
    };
    setLoader(true);
    setOpenModal({ status: false,data:null });
    // next functionality
    // handleNextFunctionality(activeTab, data);
    // }
    // if (activeTab === "Not Complete") {
    //   const res = await getNotComplete({ obj: data });
    //   if (res?.status === "SUCCESS") {
    //     getResponsePopup(res);
    //     setValues({ reason: "", comments: "" });
    //     setOpenModal({ status: false });
    //     getCall();
    //   }
    // }
  };
  const handleChange = (value, name) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setFilesList([]);
  };
  const handleDisabled = () => {
    if (openModal?.action !== "Bulk Upload" && activeTab === "Not Complete") {
      return values?.reason && !notCompleteLoader
        ? false
        : true;
    }
    if (activeTab === "Upload") {
      return filesList?.length > 0 && !loader ? false : true;
    }
  };
  const popContent = (file) => (
    <>
      <div className={`${uploadStyle.header} my-2`}>
        File Name: {file?.name}
      </div>
      {/* <div className={`${uploadStyle.header} my-2`}>
        Uploaded By:{" "}
        {`${openModal?.data?.patientName?.firstName} ${openModal?.data?.patientName?.lastName}`}
      </div> */}
      <div className={`${uploadStyle.header} my-2`}>
        Uploaded On :
        {file?.lastModifiedDate
          ? dayjs(file?.lastModifiedDate).format("MM/DD/YYYY")
          : "--"}
      </div>
    </>
  );

  // const handleDelete = async (file) => {
  //   const filteredList = filesList?.filter((item) => item !== file);
  //   const res = await getDeleteFile({
  //     obj: {
  //       fileId: file?.fileId,
  //       patientId: file?.patientId,
  //     },
  //   });
  //   if (res?.status === "SUCCESS") {
  //     getResponsePopup(res);
  //     setFilesList(filteredList);
  //   }
  // };

  const viewFile = async (file) => {
    // const res = await getBlobUrl({ pdfName: file?.blobPath });
    // if (res?.status === "SUCCESS") {
    const getData = pdfEncrypt(file?.blobPath);
    const pdfUrl = encodeURIComponent(getData.pass);
    // const pdfUrl = res?.response;
    const header = {
      "X-Org-Id": getStorage("orgId"),
      "X-Client-Id": getStorage("clientId"),
      "X-Project-Id": getStorage("projectId"),
      "X-Role-Name": getStorage("userRole"),
    };
    if (pdfUrl) {
      window.open(
        `${portalPdfUrl}?file=${pdfUrl}&salt=${getData.iv}&token=${getStorage(
          "token"
        )}&baseEnv=${serverControl}&pdfEnv=${pdfControl}&header=${JSON.stringify(
          header
        )}`,
        "_blank"
      );
    }
    // }
  };

  return (
    <>
      <section className="d-flex">
        <div className={`${styles.title}`}>{openModal?.action}</div>
        {/* {openModal?.action !== "Bulk Upload" && (
          <article className={`d-flex ${tinStyles.tabContainer} mx-2`}>
            {tabs.map((item, index) => {
              const isActive = activeTab === item;
              return (
                <div
                  key={index} // <-- Ensure key is added
                  className={`${
                    isActive ? tinStyles.activeTab : tinStyles.inactiveTab
                  } ${tinStyles.tabItem} cr-pointer`}
                  onClick={() => setActiveTab(item)}
                >
                  {item}
                </div>
              );
            })}
          </article>
        )} */}
      </section>
      {/* {openModal?.action !== "Bulk Upload" && ( */}
        <MultipleUpload openModal={openModal} activeTab={activeTab} />
      {/* )} */}
      {/* {activeTab !== "Not Complete" && ( */}
        <div>
          <FileUploader
            setFilesList={setFilesList}
            handleFilesChange={handleFilesChange}
            filesList={filesList}
          />
          {openModal?.action !== "Bulk Upload" && (
            <div className="my-2 mb-4 row gap-2 w-100 m-auto">
              {filesList?.map((item) => (
                <div
                  className={`col-3 ${uploadStyle.filename} px-2 py-1 d-flex justify-content-start align-items-center cr-pointer`}
                  onClick={() => recordsList?.length > 0 && viewFile(item)}
                >
                  <div style={{ width: "80%" }} className="text-truncate">
                    {/* {reusableEllipses({ str: item?.name, count: 20 })} */}
                    <Popover content={item?.name}>
                      {normalizeFileName(item?.name)}
                    </Popover>
                  </div>
                  <Popover content={popContent(item)}>
                    <InfoCircleOutlined
                      className="mx-2 cr-pointer"
                      style={{ color: "red" }}
                    />
                  </Popover>
                  {/* <FontAwesomeIcon
                    icon={faCircleXmark}
                    className={`mx-2 ${
                      !loader ? "cr-pointer" : ""
                    } d-flex align-items-center`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!notCompleteLoader || !loader) {
                        handleDelete(item);
                      }
                    }}
                  /> */}
                </div>
              ))}
            </div>
          )}
        </div>
      {/* )} */}
      {/* {openModal?.action === "Bulk Upload" && (
        <section
          className={`${styles.getBulkUploadFiles} d-flex justify-content-between`}
        >
          {tableTitles?.map((item) => (
            <div className={`p-2 ${styles.tableDiv}`}>
              <div className={`my-2 ${styles.tableTitle}`}>{item}</div>
              <CommonTable
                column={[{ name: "File Name", value: "fileName" }]}
                data={getTableData(item, processingFilesList)}
                pagination={false}
                ellipsesCount={45}
              />
            </div>
          ))}
        </section>
      )} */}
      {/* {openModal?.action !== "Bulk Upload" && activeTab === "Not Complete" && (
        <div className="mb-4">
          <div className={`${uploadStyle.header} my-2`}>Reason Type</div>
          <Select
            placeholder="Select Type"
            options={[
              { label: "No Patient Found", value: "NO_PATIENT_FOUND" },
              { label: "Patient Deceased", value: "PATIENT_DECEASED" },
              { label: "No Visit", value: "NO_VISIT" },
            ]}
            style={{ width: "200px" }}
            value={values?.reason}
            onChange={(value) => handleChange(value, "reason")}
          />
          <div className={`${uploadStyle.header} my-2`}>Comments</div>
          <TextArea
            placeholder="Enter Comments"
            style={{ width: "400px" }}
            rows={4}
            value={values?.comments}
            onChange={(e) => handleChange(e.target.value, "comments")}
          />
        </div>
      )} */}
      {/* {openModal?.action !== "Bulk Upload" && ( */}
        {/* <div className="d-flex justify-content-center align-items-center">
          <RegularButton
            name={"Submit"}
            onClick={() => handleNext(filesList)}
            bg="#263E50"
            color="#fff"
            disabled={loader}
            // loading={loader}
            id={createIdGen(`${role} downloader submit&NextButton`)}
          />
        </div> */}
      {/* )} */}
    </>
  );
};

const connector = connect(
  (state) => ({
    // notCompleteLoader: state?.downloadReducer?.downloader?.notCompleteLoader,
    // getAllList:
    //   state?.downloadReducer?.downloader?.allList?.data?.response
    //     ?.patientIdNameDtoList,
    // getList:
    //   state?.downloadReducer?.downloader?.getList?.data?.response
    //     ?.patientDtoPageList,
    // recordsList: state?.admin?.patients?.recordsList?.data?.response,
    // userDetails: state.authReducer?.userDetails?.data?.response,
  }),
  {
    getUploadFiles: patientActions.uploadPatients,
    // getBulkUploadFiles: allActions.getBulkUploadFiles,
    // getBlobUrl: allActions.getBlobUrl,
    // getNotComplete: allActions.getNotComplete,
    // getOneDownLoadersList: allActions.getOneDownLoadersList,
    // saveAndNext: allActions.saveAndNext,
    // changeProcessedStatus: patientActions.changeProcessedStatus,
    // getRecordOptions: patientActions.getRecordOptions,
    // getDeleteFile: allActions.getDeleteFile,
  }
);
export default connector(UploadModal);
