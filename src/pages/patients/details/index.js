import {
  createIdGen,
  getAge,
  handleCopyTextInput,
  reusableEllipses,
} from "@/utils/reusable";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Skeleton, Tooltip } from "antd/lib";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import style from "./styles.module.css";
import { connect } from "react-redux";
import { actions as allActions } from "@/store/patients";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import DetailsPage from "./detailsPage";

const index = ({
  getPatientDetails,
  getPatientDetailsLoader,
  getSinglePatient,
  getPatientDisease,
  getPatientDetailsApi,
  getPatientDetailsData
}) => {
  const route = useRouter();
  const headerTitles = [
    {
      name: "Patient Name",
      value: getPatientDetails?.patientName
        ? reusableEllipses({
            str:
              getPatientDetails?.patientName.firstName +
              " " +
              getPatientDetails?.patientName.lastName,
            count: 15,
          })
        : "---",
      copyText: true,
    },
    {
      name: "Gender",
      value: getPatientDetails?.gender || "---",
      copyText: false,
    },
   
  ];
  const textCopy = (item) => {
    if (item?.name === "Patient Name") {
      let arr = (
        typeof item?.value === "string"
          ? item?.value
          : item?.value?.props?.title
      )?.split(" ");
      let revArr = arr?.reverse()?.join(" ");
      return revArr?.trim();
    } else {
      return item?.value?.trim();
    }
  };
  const handleBack = () => {
    route.back()
  };

  useEffect(() => {
    getSinglePatient();
    getPatientDisease();
    getPatientDetailsApi();
  }, []);

  return (
    <div>
      <div className="d-flex">
        <div
          className={`${style.rightBorader} p-3 cr-pointer`}
          onClick={() => {
            handleBack();
          }}
        >
          <div
            data-testid={createIdGen(`patient details backbtn`)}
            id={createIdGen(`patient details backbtn`)}
          >
            <FontAwesomeIcon icon={faAngleLeft} />
            <span className="ms-1">Back</span>
          </div>
        </div>
        {getPatientDetailsLoader ? (
          <Skeleton.Input block active className="w-100" />
        ) : (
          <div className={`${style.headerTitles} d-flex gap-4 ps-2`}>
            {headerTitles?.map((item, index) => (
              <div
                key={index}
                style={
                  {
                    // borderRight: index == 2 && "1px solid #d9d9d9",
                    // width: index == 0 || (index == 2 && "100px"),
                  }
                }
              >
                <h6
                  className={`mb-1 ${
                    item?.name !== "Priority" ? style.header : style.header2
                  }`}
                >
                  {item?.name}
                </h6>
                <Tooltip title={item.tooltip} placement="topLeft">
                  <div
                    className={`d-flex justify-content-start align-items-center ${style.headerValues}`}
                    onClick={item?.onClick}
                    data-testid={createIdGen(
                      `patient details ${item.name} copyicon`
                    )}
                    id={createIdGen(`patient details ${item.name} copyicon`)}
                  >
                    {item?.value || "--"}
                    {item?.copyText && (
                      <FontAwesomeIcon
                        icon={faCopy}
                        className="cr-pointer d-flex align-items-center justify-content-center mx-2"
                        onClick={() => {
                          handleCopyTextInput(textCopy(item));
                        }}
                      />
                    )}
                  </div>
                </Tooltip>
              </div>
            ))}
          </div>
        )}
      </div>
      <hr className="m-0"/>
      <DetailsPage />
    </div>
  );
};
const enhancer = connect(
  (state) => ({
    getPatientDetails: state?.patients?.getSinglePatientData?.data?.response,
    getPatientDetailsLoader: state?.patients?.getSinglePatientLoader,
    getPatientDiseaseData:
      state?.patients?.getPatientDiseaseData?.data?.response,
    getPatientDiseaseLoader: state?.patients?.getPatientDisease,
  }),
  {
    getSinglePatient: allActions.getSinglePatient,
    getPatientDisease: allActions.getPatientDisease,
    getPatientDetailsApi: allActions.getPatientDetails,
  }
);
export default enhancer(index);
