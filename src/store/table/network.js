import { requestPortal } from "../../utils/network";

export async function tableData(start = 1, end = 20) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `/data-agent/patients`,
    options
  );
  return data;
}
export async function chatResponse({payload}) {
  const options = {
    method: "POST",
    body:JSON.stringify(payload)
  };
  const data = await requestPortal(
    `/data-agent/query`,
    options
  );
  return data;
}

export async function tableDataChat(prompt, mrnNo) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `/dbservice/am/patient-list?prompt=${prompt}&mrnNo=${mrnNo}`,
    options
  );
  return data;
}
