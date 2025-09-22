import React, { useEffect } from "react";
import { actions as dashbaordActions } from "../../store/dashboard";
import { connect } from "react-redux";
import AppTable from "@/components/tables";

const Home = ({ workFlowData, WorlFlow }) => {
  useEffect(() => {
    workFlowData();
  }, []);
  return (
    <div>
      <AppTable />
    </div>
  );
};
const enhancer = connect(
  (state) => ({
    WorlFlow: state,
  }),
  {
    workFlowData: dashbaordActions.workFlowAction,
  }
);
export default enhancer(Home);
