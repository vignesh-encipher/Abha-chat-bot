import React from "react";
import dayjs from "dayjs";
import uploadStyle from '../fileUploader/style.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { ageCalculate, handleCopyTextInput } from "@/utils/reusable";


const MultipleUpload = ({ openModal,activeTab }) => {
  const headerData = [
    {
      title: "Patient Name",
      key: `${openModal?.data?.patientName?.firstName||"--"} ${openModal?.data?.patientName?.lastName||"--"}` || "--",
    },
    // { title: "MBI Number", key: openModal?.data?.mbi || "--" },
    // { title: "Tin", key: openModal?.data?.tinDto?.tinName || "--" },
    { title: "Gender", key: openModal?.data?.gender || "--" },
    // {
    //   title: "Date Of Birth",
    //   key: openModal?.data?.dob
    //     ? `${dayjs(openModal?.data?.dob).format("MM/DD/YYYY")} (${ageCalculate(
    //         openModal?.data?.dob
    //       )} yr)`
    //     : "--",
    // },
    // {
    //   title: "Death Date",
    //   key: openModal?.data?.deathDate
    //     ? `${dayjs(openModal?.data?.deathDate).format("MM/DD/YYYY")}`
    //     : "--",
    // },
  ];
  return (
    <section className="row mt-4">
      {headerData?.map((item,index) => (
        <section className="col-4 mb-4">
          <article className={`${uploadStyle.header}`}>{item?.title}</article>
          <article className={`my-2 ${uploadStyle.headerContent}`}>{item?.key} {index<=2 && item?.key!=="--" && <FontAwesomeIcon icon={faCopy} onClick={()=>{handleCopyTextInput(item?.key)}} className="cr-pointer mx-2"/>}</article>
        </section>
      ))}
    </section>
  );
};

export default MultipleUpload;
