import { createColumnHelper } from "@tanstack/react-table";

import {
  SelectCell,
  SelectHeader,
} from "components/shared/table/SelectCheckbox";
import { PrimaryTextCell, TextCell } from "./rows";
import { RowActions } from "./RowActions";

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.display({
    id: "select",
    label: "Row Selection",
    header: SelectHeader,
    cell: SelectCell,
  }),
  columnHelper.accessor((row) => row.Username, {
    id: "Username",
    label: "Username",
    header: "Username",
    cell: PrimaryTextCell,
  }),
  columnHelper.accessor((row) => row.Email, {
    id: "Email",
    label: "Email",
    header: "Email",
    cell: TextCell,
  }),
  columnHelper.accessor((row) => row.Phone, {
    id: "Phone",
    label: "Phone",
    header: "Phone",
    cell: TextCell,
  }),
  columnHelper.display({
    id: "actions",
    label: "Row Actions",
    header: "Actions",
    cell: RowActions,
  }),
];
