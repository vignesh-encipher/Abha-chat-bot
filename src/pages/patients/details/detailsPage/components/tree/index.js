import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { connect } from "react-redux";
import { actions as patientActions } from "@/store/patients";
import { Tooltip } from "antd/lib";

const TreeView = ({ title, questions, answer, getSelectedDosPageNumber }) => {
  return (
    <div className=" border-bottom">
      <div className="d-flex  align-items-center p-4 ">
        <div className="bg-primary text-white px-4 py-2 rounded shadow fw-semibold text-center">
          {title}
        </div>
        <div className="bg-dark" style={{ height: "2px", width: "60px" }}></div>

        <div className="d-flex justify-content-center align-items-center">
          {/* Left side boxes */}
          <div className="d-flex flex-column justify-content-center gap-4 position-relative">
            <div
              className="position-absolute bg-dark"
              style={{
                right: "100%",
                top: "0",
                bottom: "0",
                width: "2px",

                // marginRight: "20px",
              }}
            ></div>
            {questions?.map((text, i) => (
              <div
                key={i}
                className={`border rounded px-3 py-2 bg-white shadow-sm ms-3 ${
                  text?.hyperLink && "text-primary cr-pointer text-decoration-underline"
                }`}
                onClick={() => {
                  const { supportingString = "", pageNumber = "" } =
                    text?.hyperLink;
                  if (supportingString && pageNumber) {
                    getSelectedDosPageNumber({
                      value: supportingString,
                      page: pageNumber,
                    });
                  }
                }}
              >
                <Tooltip title={text?.hyperLink?.supportingString}>{text.question}</Tooltip>
              </div>
            ))}

            {/* Vertical line connecting them */}
            <div
              className="position-absolute bg-dark"
              style={{
                left: "100%",
                top: "0",
                bottom: "0",
                width: "2px",
                marginLeft: "20px",
              }}
            ></div>
          </div>

          {/* Horizontal connector from junction to right box */}
          <div
            className="bg-dark"
            style={{ height: "2px", width: "60px", marginLeft: "20px" }}
          ></div>

          {/* Right side box */}
          <div className="border rounded px-4 py-3 bg-light shadow-sm">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
};

const enhancer = connect((state) => ({}), {
  getSelectedDosPageNumber: patientActions.getSelectedDosPageNumber,
});
export default enhancer(TreeView);
