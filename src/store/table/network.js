import { requestPortal } from "../../utils/network";

export async function tableData(start = 1, end = 20) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `/dbservice/am/patient-list?start=${start}&end=${end}`,
    options
  );
  return data;
}
