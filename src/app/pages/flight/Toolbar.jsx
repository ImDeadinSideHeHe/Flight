import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { ArrowPathIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import PropTypes from "prop-types";

import { Button, Input } from "components/ui";
import { TableConfig } from "./TableConfig";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";

export function Toolbar({ table }) {
  const { isXs } = useBreakpointsContext();
  const isFullScreenEnabled = table.getState().tableSettings.enableFullScreen;

  return (
    <div className="table-toolbar">
      <div
        className={clsx(
          "transition-content flex items-center justify-between gap-4",
          isFullScreenEnabled ? "px-4 sm:px-5" : "px-(--margin-x) pt-4",
        )}
      >
        <div className="min-w-0">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            Flight Details
          </h2>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="outlined"
            className="h-8 space-x-2 rounded-md px-3 text-xs"
            onClick={table.options.meta?.refreshData}
            disabled={table.options.meta?.isLoading}
          >
            <ArrowPathIcon
              className={clsx(
                "size-4",
                table.options.meta?.isLoading && "animate-spin",
              )}
            />
            {!isXs && <span>Refresh</span>}
          </Button>

          <Button
            color="primary"
            className="h-8 space-x-2 rounded-md px-3 text-xs"
            onClick={table.options.meta?.openCreateModal}
          >
            <PlusIcon className="size-4" />
            <span>New Flight</span>
          </Button>
        </div>
      </div>

      <div
        className={clsx(
          "custom-scrollbar transition-content flex justify-between space-x-4 overflow-x-auto pb-1 pt-4",
          isFullScreenEnabled ? "px-4 sm:px-5" : "px-(--margin-x)",
        )}
        style={{
          "--margin-scroll": isFullScreenEnabled
            ? "1.25rem"
            : "var(--margin-x)",
        }}
      >
        <SearchInput table={table} />
        <TableConfig table={table} />
      </div>
    </div>
  );
}

function SearchInput({ table }) {
  return (
    <Input
      value={table.getState().globalFilter}
      onChange={(event) => table.setGlobalFilter(event.target.value)}
      prefix={<MagnifyingGlassIcon className="size-4" />}
      classNames={{
        input: "h-8 text-xs ring-primary-500/50 focus:ring-3",
        root: "shrink-0",
      }}
      placeholder="Search flights..."
    />
  );
}

Toolbar.propTypes = {
  table: PropTypes.object,
};

SearchInput.propTypes = {
  table: PropTypes.object,
};
