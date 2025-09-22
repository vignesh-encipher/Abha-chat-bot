import { reusableEllipses } from "@/utils/reusable";
import { Card, Empty, Modal, Spin, Skeleton, Drawer, Form } from "antd/lib";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { actions as patientActions } from "@/store/patients";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faPlusSquare,
} from "@fortawesome/free-regular-svg-icons";
import AddorEditCpt from "../components/cptDrawer";
import AddorEditIcd from "../components/icdDrawer";
import { faSitemap } from "@fortawesome/free-solid-svg-icons";
import TreeView from "../components/tree";

const FileDetailsPages = ({
  getPatientDiseaseLoader,
  getPatientDiseaseData,
  getSelectedDosPageNumber,
  activeTab,
}) => {
  const [form] = Form.useForm();
  const [isAddorEdit, setIsAddorEdit] = useState({ modal: false, data: "" });
  const [showTree, setShowTree] = useState(false);

  const generateContent = ({ list, showEllipses, isPrimary }) =>
    list?.map((data) => (
      <div className="border rounded p-2 mb-2 w-100">
        <div className="d-flex me-2">
          <div className="flex-grow-1 d-flex justify-content-between">
            <span className="fw-bold">
              {"Code : "} {isPrimary && data?.diagnosisCode}{" "}
              {!isPrimary && data?.code}
            </span>

            <div>
              {/* {isPrimary && (
                <span
                  className="cr-pointer px-2 border-end-1"
                  onClick={() => {
                    setShowTree(true);
                  }}
                >
                  <FontAwesomeIcon icon={faSitemap} />
                </span>
              )} */}

              <span
                className="cr-pointer"
                onClick={() => {
                  if (isPrimary) {
                    setIsAddorEdit({ modal: "cptEdit", data: data });
                  } else {
                    setIsAddorEdit({ modal: "icdEdit", data: data });
                  }
                }}
              >
                {<FontAwesomeIcon icon={faPenToSquare} />}
              </span>
            </div>
          </div>
        </div>
        <div
          className="fw-normal text-justify"
          style={{ maxWidth: !showEllipses && "250px" }}
        >
          <span className="fw-bold">{"Description : "}</span>
          {showEllipses
            ? reusableEllipses({
                str: data?.actualDescription,
                count: 60,
              }) || "--"
            : data?.actualDescription}
        </div>
        {!isPrimary && (
          <>
            <div
              className="fw-normal text-justify"
              style={{ maxWidth: !showEllipses && "250px" }}
            >
              <span className="fw-bold">{"Reference : "}</span>
              <span
                onClick={() =>
                  getSelectedDosPageNumber({
                    value: data?.hyperLink?.supportingString,
                    page: data?.hyperLink?.pageNumber,
                  })
                }
                className="text-primary cr-pointer text-decoration-underline"
              >
                {showEllipses
                  ? reusableEllipses({
                      str:
                        data?.hyperLink?.supportingString || data?.searchString,
                      count: 60,
                    }) || "--"
                  : data?.hyperLink?.supportingString || data?.searchString}
              </span>
            </div>
            <div
              className="fw-normal text-justify"
              style={{ maxWidth: !showEllipses && "250px" }}
            >
              <span className="fw-bold">{"File Name : "}</span>
              {showEllipses
                ? reusableEllipses({
                    str: data?.hyperLink?.fileName || data?.source,
                    count: 60,
                  }) || "--"
                : data?.hyperLink?.fileName || data?.source}
            </div>
          </>
        )}
      </div>
    ));

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

  const {
    medicalFlag = [],
    riskAssessment = [],
    severityRating = [],
    riskAssessmentAnswer = "",
    medicalFlagAnswer = "",
    severityRatingAnswer = "",
  } = getPatientDiseaseData?.length > 0
    ? getPatientDiseaseData[0]?.mdmDetailResponse
    : [];

  return (
    <div className="row mt-2 px-3">
      <div>
        {activeTab?.originalFileName == "Code View" ? (
          <section className="row w-100">
            {getPatientDiseaseLoader ? (
              <Skeleton.Input block active className="w-100" />
            ) : getPatientDiseaseData?.length > 0 ? (
              getPatientDiseaseData?.map((item, index) => (
                <div className="col-md-12 mb-4" key={index}>
                  <Card
                    style={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px" }}
                  >
                    <div className="mb-2">
                      <span className="fw-bold">Patient Id</span> : &nbsp;
                      <span className="fw-regular">
                        {item?.patientId || "--"}
                      </span>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div
                          className="fw-bold p-2 mb-1 rounded d-flex justify-content-between"
                          style={{
                            background: "#263e50",
                            color: "#fff",
                          }}
                        >
                          <span>CPT</span>
                          <span
                            className="cr-pointer"
                            onClick={() =>
                              setIsAddorEdit({ modal: "cptAdd", data: "" })
                            }
                          >
                            <FontAwesomeIcon icon={faPlusSquare} />
                          </span>
                        </div>
                        <div
                          className="mb-2"
                          style={{ height: "60vh", overflowY: "scroll" }}
                        >
                          {item?.primaryDiseases?.length > 0 &&
                            generateContent({
                              list: item?.primaryDiseases,
                              showEllipses: true,
                              isPrimary: true,
                            })}
                        </div>
                      </div>
                      <div className="col-6">
                        <div
                          className="fw-bold p-2 mb-1 rounded d-flex justify-content-between"
                          style={{
                            background: "#263e50",
                            color: "#fff",
                          }}
                        >
                          <span>ICD</span>
                          <span
                            className="cr-pointer"
                            onClick={() =>
                              setIsAddorEdit({ modal: "icdAdd", data: "" })
                            }
                          >
                            <FontAwesomeIcon icon={faPlusSquare} />
                          </span>
                        </div>
                        <div
                          className="mb-2"
                          style={{ height: "60vh", overflowY: "scroll" }}
                        >
                          {item?.icdList?.length > 0 &&
                            generateContent({
                              list: item?.icdList,
                              showEllipses: true,
                            })}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))
            ) : (
              <Empty description="No Diseases Found" />
            )}
          </section>
        ) : (
          <div style={{ height: "80vh", overflow: "scroll" }}>
            {severityRating?.length > 0 && (
              <TreeView
                title={"Number & Complexity of Problems Addressed"}
                questions={severityRating}
                answer={severityRatingAnswer}
              />
            )}
            {medicalFlag?.length > 0 && (
              <TreeView
                title={
                  "Amount and/or Complexity of Data to be Reviewed and Analyzed"
                }
                questions={medicalFlag}
                answer={medicalFlagAnswer}
              />
            )}
            {riskAssessment?.length > 0 && (
              <TreeView
                title={
                  "Risk of Complications and/or Morbidity or Mortality of Patient Management"
                }
                questions={riskAssessment}
                answer={riskAssessmentAnswer}
              />
            )}
          </div>
        )}
      </div>
      <Drawer open={isAddorEdit?.modal} onClose={() => setIsAddorEdit("")}>
        {isAddorEdit?.modal == "icdAdd" || isAddorEdit?.modal == "icdEdit" ? (
          <AddorEditIcd
            form={form}
            isAddorEdit={isAddorEdit}
            setIsAddorEdit={setIsAddorEdit}
          />
        ) : (
          <AddorEditCpt
            form={form}
            isAddorEdit={isAddorEdit}
            setIsAddorEdit={setIsAddorEdit}
          />
        )}
      </Drawer>
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
export default enhancer(FileDetailsPages);
