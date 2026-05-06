import { createColumnHelper } from "@tanstack/react-table";

import {
  SelectCell,
  SelectHeader,
} from "components/shared/table/SelectCheckbox";
import { RowActions } from "./RowActions";
import { DateTimeCell, DurationCell, TextCell } from "./rows";

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.display({
    id: "select",
    label: "Row Selection",
    header: SelectHeader,
    cell: SelectCell,
  }),
  columnHelper.accessor((row) => row.TailNumber, {
    id: "TailNumber",
    label: "Tail Number",
    header: "Tail Number",
    cell: TextCell,
  }),
  columnHelper.accessor((row) => row.FlightID, {
    id: "FlightID",
    label: "Flight ID",
    header: "Flight ID",
    cell: TextCell,
  }),
  columnHelper.accessor((row) => row.TakeOff_Time, {
    id: "TakeOff_Time",
    label: "Takeoff Time",
    header: "Takeoff",
    cell: DateTimeCell,
  }),
  columnHelper.accessor((row) => row.Landing_Time, {
    id: "Landing_Time",
    label: "Landing Time",
    header: "Landing",
    cell: DateTimeCell,
  }),
  columnHelper.accessor((row) => row.Duration, {
    id: "Duration",
    label: "Duration",
    header: "Duration",
    cell: DurationCell,
  }),
  columnHelper.display({
    id: "actions",
    label: "Row Actions",
    header: "Actions",
    cell: RowActions,
  }),
];
