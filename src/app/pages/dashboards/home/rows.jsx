import dayjs from "dayjs";
import PropTypes from "prop-types";

import { Highlight } from "components/shared/Highlight";
import { ensureString } from "utils/ensureString";
import { formatFlightDuration } from "./store";

export function PrimaryTextCell({ getValue, column, table }) {
  const globalQuery = ensureString(table.getState().globalFilter);
  const columnQuery = ensureString(column.getFilterValue());

  return (
    <span className="font-medium text-primary-600 dark:text-primary-400">
      <Highlight query={[globalQuery, columnQuery]}>{getValue()}</Highlight>
    </span>
  );
}

export function TextCell({ getValue, column, table }) {
  const globalQuery = ensureString(table.getState().globalFilter);
  const columnQuery = ensureString(column.getFilterValue());
  const value = getValue();

  return (
    <p className="min-w-28 text-sm-plus font-medium text-gray-800 dark:text-dark-100">
      <Highlight query={[globalQuery, columnQuery]}>{value ?? "-"}</Highlight>
    </p>
  );
}

export function DateTimeCell({ getValue }) {
  const value = getValue();

  if (!value) {
    return <span className="text-gray-400 dark:text-dark-300">-</span>;
  }

  const date = dayjs(value);

  return (
    <>
      <p className="font-medium text-gray-800 dark:text-dark-100">
        {date.format("DD MMM YYYY")}
      </p>
      <p className="mt-0.5 text-xs text-gray-400 dark:text-dark-300">
        {date.format("hh:mm A")}
      </p>
    </>
  );
}

export function DurationCell({ row }) {
  const duration = formatFlightDuration(
    row.original.TakeOff_Time,
    row.original.Landing_Time,
  );

  return (
    <p className="min-w-24 text-sm-plus font-semibold text-gray-800 dark:text-dark-100">
      {duration}
    </p>
  );
}

PrimaryTextCell.propTypes = {
  getValue: PropTypes.func,
  column: PropTypes.object,
  table: PropTypes.object,
};

TextCell.propTypes = {
  getValue: PropTypes.func,
  column: PropTypes.object,
  table: PropTypes.object,
};

DateTimeCell.propTypes = {
  getValue: PropTypes.func,
};

DurationCell.propTypes = {
  row: PropTypes.object,
};
