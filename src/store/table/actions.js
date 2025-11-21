import { createActionThunk } from "../../utils/redux";
import * as network from "./network";

export const tableAction = createActionThunk(
  "TABLEDATA",
  network.tableData
);

export const chatResponse = createActionThunk(
  "TABLEDATA",
  network.chatResponse
);

export const tableActionChat = createActionThunk(
  "TABLEDATACHAT",
  network.tableDataChat
);