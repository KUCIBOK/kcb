import React, { useState } from 'react'
import { ChevronUp, ChevronDown, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './Button'
import { Input } from './Input'
import { Badge } from './Badge'

/**
 * Design System - DataTable Component
 *
 * Advanced table with sorting, filtering, pagination, and selection
 *
 * Features:
 * - Column sorting
 * - Search/filter
 * - Pagination
 * - Row selection
 * - Custom cell rendering
 * - Loading state
 * - Empty state
 */

export function DataTable({
  data = [],
  columns = [],
  loading = false,
  searchable = true,
  filterable = false,
  selectable = false,
  pagination = true,
  pageSize = 10,
  onRowClick,
  onSelectionChange,
  emptyMessage = 'Aucune donnée disponible',
  className = '',
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState(null)
  const [sortDirection, setSortDirection] = useState('asc')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRows, setSelectedRows] = useState(new Set())

  // Sorting
  const handleSort = (columnId) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(columnId)
      setSortDirection('asc')
    }
  }

  // Filtering
  const filteredData = searchQuery
    ? data.filter((row) =>
        columns.some((col) =>
          String(row[col.accessor]).toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : data

  // Sorting
  const sortedData = sortColumn
    ? [...filteredData].sort((a, b) => {
        const aVal = a[sortColumn]
        const bVal = b[sortColumn]

        if (aVal === bVal) return 0

        const comparison = aVal > bVal ? 1 : -1
        return sortDirection === 'asc' ? comparison : -comparison
      })
    : filteredData

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedData = pagination
    ? sortedData.slice(startIndex, startIndex + pageSize)
    : sortedData

  // Selection
  const toggleRowSelection = (rowId) => {
    const newSelection = new Set(selectedRows)
    if (newSelection.has(rowId)) {
      newSelection.delete(rowId)
    } else {
      newSelection.add(rowId)
    }
    setSelectedRows(newSelection)
    onSelectionChange?.(Array.from(newSelection))
  }

  const toggleAllSelection = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set())
      onSelectionChange?.([])
    } else {
      const allIds = new Set(paginatedData.map((_, idx) => idx))
      setSelectedRows(allIds)
      onSelectionChange?.(Array.from(allIds))
    }
  }

  if (loading) {
    return (
      <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] overflow-hidden">
        <div className="animate-pulse p-6">
          <div className="h-4 bg-white/[0.08] rounded-[4px] w-1/4 mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-white/[0.08] rounded-[4px] mb-2"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`bg-kcb-ardoise border border-white/[0.06] rounded-[4px] overflow-hidden ${className}`}
    >
      {/* Header with search */}
      {searchable && (
        <div className="p-4 border-b border-white/[0.06]">
          <Input
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            leftIcon={Search}
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/[0.03]">
            <tr>
              {selectable && (
                <th className="px-4 py-3 text-left w-12">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onChange={toggleAllSelection}
                    className="w-4 h-4 rounded-[4px] border-white/[0.08] bg-kcb-noir text-kcb-or focus:ring-kcb-or"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.accessor}
                  className={`px-4 py-3 text-left text-xs font-medium text-kcb-pierre uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:text-white' : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column.accessor)}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable &&
                      sortColumn === column.accessor &&
                      (sortDirection === 'asc' ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-12 text-center text-kcb-pierre"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className={`hover:bg-white/[0.03] transition ${
                    onRowClick ? 'cursor-pointer' : ''
                  } ${selectedRows.has(rowIndex) ? 'bg-kcb-or/10' : ''}`}
                >
                  {selectable && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(rowIndex)}
                        onChange={() => toggleRowSelection(rowIndex)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 rounded-[4px] border-white/[0.08] bg-kcb-noir text-kcb-or focus:ring-kcb-or"
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.accessor} className="px-4 py-3 text-sm text-kcb-sable">
                      {column.render
                        ? column.render(row[column.accessor], row)
                        : row[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="px-4 py-3 border-t border-white/[0.06] flex items-center justify-between">
          <div className="text-sm text-kcb-pierre">
            Affichage {startIndex + 1}-{Math.min(startIndex + pageSize, sortedData.length)} sur{' '}
            {sortedData.length}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon={ChevronLeft}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            />
            <span className="text-sm text-kcb-sable">
              Page {currentPage} sur {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              icon={ChevronRight}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTable
