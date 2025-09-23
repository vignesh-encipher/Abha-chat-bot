import { createActionThunk } from "../../utils/redux";
import * as network from "./network";

export const tableAction = createActionThunk(
  "TABLEDATA",
  network.tableData
);