import { reusableEllipses } from "@/utils/reusable";
import { Card, Empty, Modal, Spin, Skeleton, Drawer, Form } from "antd/lib";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PdfViewerComponent from "./PdfViewerComponent";
import { setStorage } from "@/utils/storages";
import { actions as patientActions } from "@/store/patients";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faPlusSquare,
} from "@fortawesome/free-regular-svg-icons";
import AddorEditCpt from "./components/cptDrawer";
import AddorEditIcd from "./components/icdDrawer";
import { faSitemap } from "@fortawesome/free-solid-svg-icons";
import TreeView from "./components/tree";
import Tabs from "@/components/tabs/Tabs";
import FileDetailsPages from "./file";

const index = ({
  getPatientDetailsData,
  getPatientFile,
  getPatientFileLoader,
}) => {
  const [form] = Form.useForm();
  const [fileId, setFileId] = useState("");
  const [isAddorEdit, setIsAddorEdit] = useState({ modal: false, data: "" });
  let items =
    getPatientDetailsData?.fileDetailsList?.map((item, i) => ({
      ...item,
      fileSource: "File_" + (i + 1),
    })) || [];
  const item = [
    { originalFileName: "Code View" },
    { originalFileName: "Tree View" },
  ];
  const [activeTab, setActiveTab] = useState(items[0]);
  const [activeTab1, setActiveTab1] = useState({
    originalFileName: "Code View",
  });

  const onChangeTabs = (item) => {
    setActiveTab(item);
    setStorage("fileId", item.blobPath);
    getBlobUrl(item.blobPath);
  };
  const onChangeTabs1 = (item) => {
    setActiveTab1(item);
  };

  const getBlobUrl = async (id) => {
    const res = await getPatientFile(id);
    if (res.status == "SUCCESS") {
      setFileId(res.response);
    }
  };

  useEffect(() => {
    if (getPatientDetailsData) {
      setActiveTab(items[0]);
      // getBlobUrl(getPatientDetailsData?.fileDetailsList[0]?.blobPath);
      setStorage("fileId", getPatientDetailsData?.fileDetailsList[0]?.blobPath);
    }
  }, [getPatientDetailsData]);

  useEffect(() => {
    if (isAddorEdit?.modal) {
      if (isAddorEdit?.modal == "cptEdit") {
        const { diagnosisCode = "", actualDescription = "" } =
          isAddorEdit?.data;
        form.setFieldsValue({
          diagnosisCode: diagnosisCode,
          description: actualDescription,
        });
      } else if (isAddorEdit?.modal == "icdEdit") {
        const { code = "", actualDescription = "" } = isAddorEdit?.data;
        form.setFieldsValue({
          diagnosisCode: code,
          description: actualDescription,
        });
      }
    }
  }, [isAddorEdit]);

  return (
    <div className="row mt-2 px-3">
      <div className="col-5">
        {getPatientFileLoader ? (
          <div className="text-center">
            <Spin />
          </div>
        ) : (
          <PdfViewerComponent
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onChangeTabs={onChangeTabs}
            items={items}
            src={activeTab?.blobPath || ""}
            fileDetails={fileId}
          />
        )}
      </div>
      <div className="col-7">
        <Tabs
          tabsList={item}
          activeTab={activeTab1}
          onChangeTabs={onChangeTabs1}
          // isTooltip={true}
        />
        <FileDetailsPages activeTab={activeTab1}/>
      </div>
    </div>
  );
};
const enhancer = connect(
  (state) => ({
    getPatientDiseaseData:
      state?.patients?.getPatientDiseaseData?.data?.response,
    getPatientDiseaseLoader: state?.patients?.getPatientDiseaseLoader,
    getPatientFileLoader: state?.patients?.getPatientFileLoader,
    getPatientDetailsData:
      state?.patients?.getPatientDetailsData?.data?.response,
  }),
  {
    getPatientFile: patientActions.getPatientFile,
    getSelectedDosPageNumber: patientActions.getSelectedDosPageNumber,
  }
);
export default enhancer(index);
