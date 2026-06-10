import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../components/ui/input-group"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
import { Button } from "./ui/button"
import { Search } from "lucide-react"


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterColumn?: string | string[]
  clickable?: boolean
  filterPlaceholder?: string
  filterOff?: boolean
  extraFilters?: React.ReactNode //Mudei para função
  meta?: any
  onRowClick?: (data: TData) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterColumn,
  clickable = false,
  filterOff = false,
  filterPlaceholder,
  extraFilters,
  meta,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [rowSelection, setRowSelection] = React.useState({})

  const isMultiColumn = Array.isArray(filterColumn)

  const multiColumnFilter: FilterFn<TData> = React.useCallback(
    (row, _columnId, filterValue: string) => {
      if (!filterValue) return true
      const cols = filterColumn as string[]
      return cols.some((col) => {
        const val = row.getValue(col)
        return String(val ?? "")
          .toLowerCase()
          .includes(filterValue.toLowerCase())
      })
    },
    [filterColumn]
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    globalFilterFn: multiColumnFilter,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      ...(isMultiColumn ? { globalFilter } : {}),
    },
    meta: meta,
  })

  const filterValue = isMultiColumn
    ? globalFilter
    : ((table
        .getColumn((filterColumn as string) ?? "")
        ?.getFilterValue() as string) ?? "")

  const handleFilterChange = (value: string) => {
    if (isMultiColumn) {
      setGlobalFilter(value)
    } else {
      table.getColumn((filterColumn as string) ?? "")?.setFilterValue(value)
    }
  }

  return (
    <div className="w-full">
      {/* Filtro por nome + filtros extras */}
      <div className="flex items-center justify-between gap-3 py-4">
        {!filterOff && (
          <InputGroup className="w-100">
            <InputGroupInput
              placeholder={filterPlaceholder || "Filtrar..."}
              value={filterValue}
              onChange={(event) => handleFilterChange(event.target.value)}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-xs" className="cursor-pointer">
                <Search />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        )}

        {extraFilters &&  (
          <div className="flex items-center gap-2">{extraFilters}</div>
        )}
      </div>

      {/* Tabela */}
      <div className="rounded-md border border-gray-200">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="px-4 text-left">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={`hover:bg-blue-200 even:bg-zinc-100 ${clickable ? "cursor-pointer " : ""}`}
                  onClick={() => clickable && onRowClick && onRowClick(row.original)}
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell
                      key={cell.id}
                      className={`px-4 ${index === 0 ? "text-left font-medium" : ""}`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* rodapé tabela */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próximo
          </Button>
        </div>
      </div>
    </div>
  )
}
