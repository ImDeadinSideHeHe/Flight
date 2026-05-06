import {
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { useState } from "react";
import { toast } from "sonner";

import { Card, Table, TBody, Td, Th, THead, Tr } from "components/ui";
import { FlightDetailsModal } from "./FlightDetailsModal";
import { Page } from "components/shared/Page";
import { PaginationSection } from "components/shared/table/PaginationSection";
import { SelectedRowsActions } from "./SelectedRowsActions";
import { TableSortIcon } from "components/shared/table/TableSortIcon";
import { Toolbar } from "./Toolbar";
import { columns } from "./columns";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import { getUserAgentBrowser } from "utils/dom/getUserAgentBrowser";
import { useDidUpdate, useLocalStorage, useLockScrollbar } from "hooks";
import { useFlightDetailsStore } from "./store";
import { useSkipper } from "utils/react-table/useSkipper";
import { useThemeContext } from "app/contexts/theme/context";

const isSafari = getUserAgentBrowser() === "Safari";

function flightIdFilter(row, _columnId, filterValue) {
  const search = String(filterValue ?? "").trim().toLowerCase();

  if (!search) return true;

  return String(row.original.FlightID ?? "")
    .toLowerCase()
    .includes(search);
}

export default function FlightDetails() {
  const { cardSkin } = useThemeContext();
  const {
    flights,
    isLoading,
    isSaving,
    errorMessage,
    fetchFlights,
    createFlight,
    updateFlight,
    deleteFlight,
    deleteFlights,
  } = useFlightDetailsStore();

  const [tableSettings, setTableSettings] = useState({
    enableFullScreen: false,
    enableRowDense: false,
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [modalMode, setModalMode] = useState("create");
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [columnVisibility, setColumnVisibility] = useLocalStorage(
    "column-visibility-flight-details",
    {},
  );

  const [columnPinning, setColumnPinning] = useLocalStorage(
    "column-pinning-flight-details",
    {},
  );

  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  const openCreateModal = () => {
    setSelectedFlight(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const openEditModal = (flight) => {
    setSelectedFlight(flight);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFlight(null);
  };

  const handleSaveFlight = async (values) => {
    try {
      if (modalMode === "edit" && selectedFlight) {
        await updateFlight(selectedFlight.id, values);
        toast.success("Flight updated");
      } else {
        await createFlight(values);
        toast.success("Flight created");
      }
      closeModal();
    } catch (error) {
      toast.error(error.message || "Unable to save flight");
    }
  };

  const table = useReactTable({
    data: flights,
    columns,
    state: {
      globalFilter,
      sorting,
      columnVisibility,
      columnPinning,
      tableSettings,
    },
    meta: {
      isLoading,
      refreshData: fetchFlights,
      openCreateModal,
      openEditModal,
      deleteRow: async (row) => {
        skipAutoResetPageIndex();
        await deleteFlight(row.original.id);
        toast.success("Flight deleted");
      },
      deleteRows: async (rows) => {
        skipAutoResetPageIndex();
        await deleteFlights(rows.map((row) => row.original.id));
        table.resetRowSelection();
        toast.success("Selected flights deleted");
      },
      setTableSettings,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    enableSorting: tableSettings.enableSorting,
    enableColumnFilters: tableSettings.enableColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    globalFilterFn: flightIdFilter,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    autoResetPageIndex,
  });

  useDidUpdate(() => table.resetRowSelection(), [flights]);
  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <Page title="Flight Details">
      <div className="transition-content w-full pb-5">
        <div
          className={clsx(
            "flex h-full w-full flex-col",
            tableSettings.enableFullScreen &&
              "fixed inset-0 z-61 bg-white pt-3 dark:bg-dark-900",
          )}
        >
          <Toolbar table={table} />
          <div
            className={clsx(
              "transition-content flex grow flex-col pt-3",
              tableSettings.enableFullScreen
                ? "overflow-hidden"
                : "px-(--margin-x)",
            )}
          >
            <Card
              className={clsx(
                "relative flex grow flex-col",
                tableSettings.enableFullScreen && "overflow-hidden",
              )}
            >
              <div className="table-wrapper min-w-full grow overflow-x-auto">
                <Table
                  hoverable
                  dense={tableSettings.enableRowDense}
                  sticky={tableSettings.enableFullScreen}
                  className="w-full text-left rtl:text-right"
                >
                  <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <Tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <Th
                            key={header.id}
                            className={clsx(
                              "bg-gray-200 font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100 first:ltr:rounded-tl-lg last:ltr:rounded-tr-lg first:rtl:rounded-tr-lg last:rtl:rounded-tl-lg",
                              header.column.getCanPin() && [
                                header.column.getIsPinned() === "left" &&
                                  "sticky z-2 ltr:left-0 rtl:right-0",
                                header.column.getIsPinned() === "right" &&
                                  "sticky z-2 ltr:right-0 rtl:left-0",
                              ],
                            )}
                          >
                            {header.column.getCanSort() ? (
                              <div
                                className="flex cursor-pointer select-none items-center space-x-3"
                                onClick={header.column.getToggleSortingHandler()}
                              >
                                <span className="flex-1">
                                  {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext(),
                                      )}
                                </span>
                                <TableSortIcon
                                  sorted={header.column.getIsSorted()}
                                />
                              </div>
                            ) : header.isPlaceholder ? null : (
                              flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )
                            )}
                          </Th>
                        ))}
                      </Tr>
                    ))}
                  </THead>
                  <TBody>
                    {isLoading && (
                      <Tr>
                        <Td
                          colSpan={columns.length}
                          className="py-10 text-center text-gray-500 dark:text-dark-300"
                        >
                          Loading flights...
                        </Td>
                      </Tr>
                    )}

                    {!isLoading && errorMessage && (
                      <Tr>
                        <Td
                          colSpan={columns.length}
                          className="py-10 text-center text-error dark:text-error-light"
                        >
                          {errorMessage}
                        </Td>
                      </Tr>
                    )}

                    {!isLoading &&
                      !errorMessage &&
                      table.getRowModel().rows.length === 0 && (
                        <Tr>
                          <Td
                            colSpan={columns.length}
                            className="py-10 text-center text-gray-500 dark:text-dark-300"
                          >
                            No flight records found.
                          </Td>
                        </Tr>
                      )}

                    {!isLoading &&
                      !errorMessage &&
                      table.getRowModel().rows.map((row) => (
                        <Tr
                          key={row.id}
                          className={clsx(
                            "relative border-y border-transparent border-b-gray-200 dark:border-b-dark-500",
                            row.getIsSelected() &&
                              !isSafari &&
                              "row-selected after:pointer-events-none after:absolute after:inset-0 after:z-2 after:h-full after:w-full after:border-3 after:border-transparent after:bg-primary-500/10 ltr:after:border-l-primary-500 rtl:after:border-r-primary-500",
                          )}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <Td
                              key={cell.id}
                              className={clsx(
                                "relative bg-white",
                                cardSkin === "shadow"
                                  ? "dark:bg-dark-700"
                                  : "dark:bg-dark-900",
                                cell.column.getCanPin() && [
                                  cell.column.getIsPinned() === "left" &&
                                    "sticky z-2 ltr:left-0 rtl:right-0",
                                  cell.column.getIsPinned() === "right" &&
                                    "sticky z-2 ltr:right-0 rtl:left-0",
                                ],
                              )}
                            >
                              {cell.column.getIsPinned() && (
                                <div
                                  className={clsx(
                                    "pointer-events-none absolute inset-0 border-gray-200 dark:border-dark-500",
                                    cell.column.getIsPinned() === "left"
                                      ? "ltr:border-r rtl:border-l"
                                      : "ltr:border-l rtl:border-r",
                                  )}
                                />
                              )}
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </Td>
                          ))}
                        </Tr>
                      ))}
                  </TBody>
                </Table>
              </div>
              <SelectedRowsActions table={table} />
              {table.getCoreRowModel().rows.length > 0 && (
                <div
                  className={clsx(
                    "px-4 pb-4 sm:px-5 sm:pt-4",
                    tableSettings.enableFullScreen &&
                      "bg-gray-50 dark:bg-dark-800",
                    !(
                      table.getIsSomeRowsSelected() ||
                      table.getIsAllRowsSelected()
                    ) && "pt-4",
                  )}
                >
                  <PaginationSection table={table} />
                </div>
              )}
            </Card>
          </div>
        </div>
        <FlightDetailsModal
          flight={selectedFlight}
          isOpen={isModalOpen}
          isSaving={isSaving}
          mode={modalMode}
          onClose={closeModal}
          onSubmit={handleSaveFlight}
        />
      </div>
    </Page>
  );
}
