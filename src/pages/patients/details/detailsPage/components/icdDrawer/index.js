import { Button, Form, Input, Select, Spin } from "antd/lib";
import React, { useState } from "react";
import { connect } from "react-redux";
import { actions as allActions } from "@/store/patients";
import { getResponsePopup } from "@/utils/reusable";
import { getLocalStored } from "@/utils/storages";

const AddorEditIcd = ({
  form,
  getDXListLoader,
  getDXList,
  getDXCodeAddEdit,
  isAddorEdit,
  getPatientDisease,
  setIsAddorEdit,
}) => {
  const { patientId = "" } = getLocalStored();
  const [opt, setOpt] = useState([]);
  const handleChange = async (code) => {
    if (code.length > 2) {
      try {
        const res = await getDXList({
          code: code,
        });
        if (res.status == "SUCCESS") {
          const data = res?.response.map((item) => ({
            label: `${item.code} - ${item.description}`,
            value: item.code,
            data: item,
          }));
          setOpt(data);
        }
      } catch (error) {}
    } else {
      setOpt([]);
    }
  };

  const handleSave = async (form) => {
    const { diagnosisCode = "", description = "" } = form;
    const { id = "" } = isAddorEdit?.data;
    const obj = isAddorEdit?.data
      ? {
          patientId: patientId,
          codeType: "icd",
          codeId: id,
          diagnosisCode: diagnosisCode,
          actualDescription: description,
        }
      : {
          patientId: patientId,
          codeType: "icd",
          code: diagnosisCode,
          actualDescription: description,
        };
    try {
      const res = await getDXCodeAddEdit({ obj, isEdit: isAddorEdit?.data });
      if (res) {
        getResponsePopup(res);
        if (res.status == "SUCCESS") {
          getPatientDisease();
          setIsAddorEdit({ modal: false, data: "" });
        }
      }
    } catch (error) {}
  };
  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onFinish={(form) => {
          handleSave(form);
        }}
        autoComplete="off"
      >
        <Form.Item
          name="diagnosisCode"
          label="DX"
          rules={[
            {
              required: true,
              message: "Select the Disease",
            },
          ]}
          onChange={(e) => {
            if (e.target.name == "") {
              const code = e.target.value.trim();
              handleChange(code);
            }
          }}
        >
          <Select
            name="diagnosisCode"
            placeholder="Select an DX"
            allowClear
            showSearch
            notFoundContent={
              getDXListLoader ? <Spin size="small" /> : "No data"
            }
            onClear={() => setOpt([])}
            onBlur={() => {
              const selected = form.getFieldValue("diagnosisCode");
              if (!selected) {
                setOpt([]);
              }
            }}
            onChange={(e, value) => {
              form.setFieldsValue({
                description: value?.data?.description,
              });
            }}
            options={!getDXListLoader && opt}
          ></Select>
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[
            { required: true, message: "Please input your description!" },
          ]}
        >
          <Input placeholder="Enter Description" disabled />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const enhancer = connect(
  (state) => ({
    getDXListLoader: state.patients.getDXICDListLoader,
  }),
  {
    getDXList: allActions.getDXICDList,
    getDXCodeAddEdit: allActions.getDXCodeAddEdit,
    getPatientDisease: allActions.getPatientDisease,
  }
);

export default enhancer(AddorEditIcd);
