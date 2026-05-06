import PropTypes from "prop-types";

import { Highlight } from "components/shared/Highlight";
import { ensureString } from "utils/ensureString";

export function PrimaryTextCell({ getValue, column, table }) {
  const globalQuery = ensureString(table.getState().globalFilter);
  const columnQuery = ensureString(column.getFilterValue());
  const value = getValue();

  return (
    <span className="font-medium text-primary-600 dark:text-primary-400">
      <Highlight query={[globalQuery, columnQuery]}>{value || "-"}</Highlight>
    </span>
  );
}

export function TextCell({ getValue, column, table }) {
  const globalQuery = ensureString(table.getState().globalFilter);
  const columnQuery = ensureString(column.getFilterValue());
  const value = getValue();

  return (
    <p className="min-w-28 text-sm-plus font-medium text-gray-800 dark:text-dark-100">
      <Highlight query={[globalQuery, columnQuery]}>{value || "-"}</Highlight>
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
