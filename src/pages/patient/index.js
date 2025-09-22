// import React, { useEffect } from 'react'
// import { actions as dashbaordActions } from "../../store/dashboard";
// import {connect} from "react-redux";

// const Home = ({workFlowData, WorlFlow}) => {
//     console.log(WorlFlow);

// useEffect(() => {
//     workFlowData()
// }, [])
//   return (
//     <div>Home</div>
//   )
// }
// const enhancer = connect(
//     (state) => ({
//       WorlFlow: state
//     }),
//     {
//       workFlowData:dashbaordActions.workFlowAction
//     }
//   );
// export default enhancer(Home)

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import CommonTable from "@/components/table";
import Filters from "@/components/filters";
import { getLocalStored, setStorage } from "@/utils/storages";
import { actions as patientActions } from "../../store/patients";
import SubNavMenu from "@/components/subNavMenu/subNavMenu";
import { Form, Input, Modal, Select } from "antd/lib";
import { createIdGen, getResponsePopup } from "@/utils/reusable";
import RegularButton from "@/components/button";
import UploadModal from "./uploadModal";

export const columns = [
  {
    name: "Patient Name",
    value: "patientName",
    firstNameLastName: true,
  },
  {
    name: "File Count",
    value: "beforeOcrFileIds",
    isLength: true,
  },
  {
    name: "Gender",
    value: "gender",
  },
  {
    name: "Status",
    value: "triggerStatus",
    isStatus: true,
  },
  {
    name: "File Upload",
    isUpload: true,
    isTrigger: true,
    isDownload: true,
  },
];

const Patients = ({
  getPatientsList,
  patientsResult,
  patientsLoader,
  // routeDetails,
  getRouteDetails,
  createPatients,
  triggerPatient,
  downloadPatientReport,
}) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { role = "" } = getLocalStored();
  const actionType = "Add";
  const reportTabs = ["Export View", "Excel View"];
  const [pageNumber, setPageNumber] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [selectedOption, setSelectedOption] = useState({});
  const [open, setOpen] = useState(false);
  // const [uploadModel, setUploadModel] = useState(false);
  const [activeTab, setActiveTab] = useState("Bulk Upload");
  const [values, setValues] = useState({ reason: null, comments: "" });
  const [openModal, setOpenModal] = useState({ status: false, data: null });
  // const [checkedLoader, setCheckedLoader] = useState(false);
  // const [selectedRows, setSelectedRows] = useState([]);
  const [filesList, setFilesList] = useState([]);
  const [processingFilesList, setProcessingFilesList] = useState({
    processing: [],
    completed: [],
    failed: [],
  });
  // const [filterOptionList, setFilterOptionsList] = useState({
  //   CODER1_ALLOCATED_TO: "",
  //   CODER2_ALLOCATED_TO: "",
  //   QA_ALLOCATED_TO: "",
  //   DOWNLOADER_ALLOCATED_TO: "",
  //   OWNER_ALLOCATED_TO: "",
  // });
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedDateRanges, setSelectedDateRanges] = useState({});
  const [localStr, setLocalStr] = useState(null);
  const handleTabs = (name) => {
    setTabName(name);
  };
  const opt = {};

  const filters = [
    {
      id: 1,
      title: "Search By Patient ",
      type: "search",
      value: null,
      placeholder: "Search",
      active: true,
    },
  ];

  const initialFilterOptions = filters.reduce((acc, item) => {
    acc[item.title] = { ...item, value: item.active };
    return acc;
  }, {});
  const [filterOptions, setFilterOptions] = useState(initialFilterOptions);

  const handleRowClick = (data) => {
    if (data.triggerStatus == "SUCCESS") {
      setStorage("patientId", data.id);
      router.push("/patients/details");
    } else {
      getResponsePopup({
        status: "USER_DEFINED_ERROR",
        message: "File Not Computed",
      });
    }
  };

  const getList = async () => {
    try {
      await getPatientsList({
        pageNumber,
        searchText,
        selectedOption,
        selectedDateRanges,
      });
    } catch (error) {}
  };

  const onFinish = async (e) => {
    const obj = {
      patientName: {
        firstName: e?.firstName || "",
        lastName: e?.lastName || "",
      },
      gender: e?.gender || "",
    };
    try {
      const res = await createPatients({ obj });
      if (res.status == "SUCCESS") {
        getResponsePopup(res);
        setOpen(false);
        getList();
        form.resetFields();
      } else {
        getResponsePopup(res);
      }
    } catch (error) {}
  };

  const handleUpload = (data, action) => {
    setOpenModal({
      status: true,
      data: data,
      action: action || "Patient List",
    });
  };

  const getBackValues = async () => {
    if (getRouteDetails) {
      const {
        pageNumber,
        searchText,
        selectedOption,
        selectedDateRanges,
        filterOptions,
      } = getRouteDetails;
      setPageNumber(pageNumber);
      setSearchText(searchText);
      setSelectedOption(selectedOption);
      setSelectedDateRanges(selectedDateRanges);
      setFilterOptions(filterOptions);
      try {
        const res = await getPatientsList({
          pageNumber: getRouteDetails.pageNumber,
          searchText: getRouteDetails.searchText,
          selectedOption: getRouteDetails.selectedOption,
          selectedDateRanges: getRouteDetails.selectedDateRanges,
        });
        if (res.status == "SUCCESS") {
          // routeDetails(null);
          setPageNumber(
            res?.response?.patientDtoPageList?.page?.totalElements <= 13
              ? 0
              : getRouteDetails.pageNumber
          );
        }
      } catch (error) {}
    }
  };

  const handleTrigger = async (data) => {
    const res = await triggerPatient({ patientId: data?.id });
    if (res?.status === "SUCCESS") {
      getList();
      getResponsePopup(res);
    } else {
      getResponsePopup(res);
    }
  };
  const handleisDownload = async (data) => {
    try {
      const res = await downloadPatientReport({ patientId: data?.id });
      const blob =
        res instanceof Blob ? res : new Blob([res], { type: res.type || "" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "report.xlsx"; 
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      getResponsePopup({status: "USER_DEFINED_ERROR", message: "Something went wrong while downloading the file."});
    }
  };

  useEffect(() => {
    if (!getRouteDetails) {
      getList();
    } else {
      getBackValues();
    }
  }, [pageNumber, searchText, selectedOption, selectedDateRanges]);

  return (
    <>
      <SubNavMenu
        filterOptions={filterOptions}
        handleTabs={handleTabs}
        title={"Patients"}
        tabs={reportTabs}
        filters={filters}
        setFilterOptions={setFilterOptions}
        initialFilterOptions={initialFilterOptions}
        showFilters={true}
        setLocalStr={setLocalStr}
        setSearchText={setSearchText}
        setSelectedOption={setSelectedOption}
        setSelectedDates={setSelectedDates}
        setSelectedDateRanges={setSelectedDateRanges}
        isPrimaryBtn={"Create Patient"}
        primaryOnclick={() => setOpen(true)}
      />
      <div className="p-4">
        <Filters
          setPageNumber={setPageNumber}
          FilterItems={filterOptions}
          setSearchText={setSearchText}
          searchText={searchText}
          setSelectedOption={setSelectedOption}
          selectedOption={selectedOption}
          setSelectedDates={setSelectedDates}
          selectedDates={selectedDates}
          setSelectedDateRanges={setSelectedDateRanges}
          disabledDate={true}
          setLocalStr={setLocalStr}
          localStr={localStr}
          opt={opt}
          title={"patient"}
        />
        <CommonTable
          data={patientsResult?.content}
          column={columns}
          loader={patientsLoader}
          totalLength={patientsResult?.page?.totalElements}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          totalPages={patientsResult?.page?.totalPages}
          pageSize={10}
          onRowClick={handleRowClick}
          handleUpload={handleUpload}
          handleTrigger={handleTrigger}
          handleisDownload={handleisDownload}
        />
      </div>

      <Modal
        title={"Create Patient"}
        open={open}
        footer={false}
        onCancel={() => setOpen(false)}
      >
        <div
          data-testid={createIdGen(
            `${role} ${"patient details"} ${actionType} DOS form`
          )}
          id={createIdGen(
            `${role} ${"patient details"} ${actionType} DOS form`
          )}
        >
          <Form
            form={form}
            name="basic"
            onFinish={onFinish}
            layout="vertical"
            autoComplete="off"
            ref={null}
          >
            <div className="row">
              <div className="col-12">
                <Form.Item
                  name="firstName"
                  label="First Name"
                  rules={[
                    {
                      required: true,
                      message: "Enter the First Name",
                    },
                  ]}
                >
                  <Input placeholder={"First Name"} name="lastName" />
                </Form.Item>
              </div>

              <div className="col-12">
                <Form.Item
                  name="lastName"
                  label="Last Name"
                  rules={[
                    {
                      required: true,
                      message: "Enter the Last Name",
                    },
                  ]}
                >
                  <Input placeholder={"Last Name"} name="lastName" />
                </Form.Item>
              </div>
              <div className="col-12">
                <Form.Item
                  name="gender"
                  label="Gender"
                  rules={[
                    {
                      required: true,
                      message: "Enter the Gender",
                    },
                  ]}
                >
                  <Select
                    placeholder="Select Gender"
                    name="gender"
                    options={[
                      { label: "Male", value: "MALE" },
                      { label: "Female", value: "FEMALE" },
                      {
                        label: "Others",
                        value: "OTHERS",
                      },
                    ]}
                    showSearch
                  />
                </Form.Item>
              </div>
            </div>
            <div className="row text-center mt-5">
              <Form.Item className="d-flex justify-content-center align-items-center">
                <RegularButton
                  name={actionType === "edit" ? "Update" : "Add"}
                  bg={"#263E50"}
                  color={"#fff"}
                  classes={"py-2"}
                  type="submit"
                  title={"Patient Details"}
                  // loading={loader}
                  // disabled={loader}
                  id={createIdGen(
                    `${role} ${"patient details"} ${
                      actionType === "edit" ? "Update" : "Add"
                    } dos form`
                  )}
                />
              </Form.Item>
            </div>
          </Form>
        </div>
      </Modal>

      <Modal
        open={openModal?.status}
        footer={false}
        onCancel={() => {
          setOpenModal({ status: false, data: null });
        }}
        width="60%"
        className="downloaderBulkUploadModal"
      >
        <UploadModal
          openModal={openModal}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          values={values}
          setValues={setValues}
          filesList={filesList}
          setFilesList={setFilesList}
          setOpenModal={setOpenModal}
          setProcessingFilesList={setProcessingFilesList}
          processingFilesList={processingFilesList}
          getCall={getList}
          getFileUrl={() => {}}
        />
      </Modal>
    </>
  );
};
const enhancer = connect(
  (state) => ({
    patientsResult: state?.patients.getPatientsList?.data?.response,
    patientsLoader: state?.patients.patientsLoader,
    // getTins: state?.admin.patients.getTinList?.data?.response,
    // getPractice: state?.admin.patients.getPracticeList?.data?.response,
    // pageLoad: state?.admin.patients.getPageRendering,
    // getRouteDetails: state.admin.patients.getRouteDetails,
  }),
  {
    getPatientsList: patientActions.getPatientsList,
    createPatients: patientActions.createPatients,
    triggerPatient: patientActions.triggerPatient,
    downloadPatientReport: patientActions.downloadPatientReport,
    // getTinList: patientActions.getTinList,
    // getProviderList: patientActions.getProviderList,
    // getPracticeList: patientActions.getPracticeList,
    // getPatinetFilterList: patientActions.getPatinetFilterList,
    // routeDetails: patientActions.routeDetails,
  }
);

export default enhancer(Patients);
