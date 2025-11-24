import { useState, useMemo, useEffect } from 'react';
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, flexRender } from '@tanstack/react-table';
import { ActionMenu } from './ActionMenu';

export default function UsersTable({ users, globalFilter, roleFilter, joinedFilter, removeUser, editUser, patchUser }) {
  const [sorting, setSorting] = useState([]);
  const [filteredData, setFilteredData] = useState(users);

  useEffect(() => {
    let result = users;

    if (globalFilter) {
      const lowercasedFilter = globalFilter.toLowerCase();
      result = result.filter(user =>
        user.name.toLowerCase().includes(lowercasedFilter) ||
        user.email.toLowerCase().includes(lowercasedFilter) ||
        user.location.toLowerCase().includes(lowercasedFilter)
      );
    }

    if (roleFilter !== 'all') {
      const lowercasedFilter = roleFilter.toLowerCase();
      result = result.filter(user => user.role.toLowerCase().includes(lowercasedFilter));
    }

    if (joinedFilter !== 'Anytime') {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();

      result = result.filter(user => {
        const joinedYear = extractYearFromDate(user.joined);
        const joinedMonth = extractMonthFromDate(user.joined);

        if (joinedFilter === 'Last Year') {
          return joinedYear === currentYear - 1;
        }

        if (joinedFilter === 'Last Month') {
          let targetMonth = currentMonth - 1;
          let targetYear = currentYear;

          if (targetMonth < 0) {
            targetMonth = 11;
            targetYear = currentYear - 1;
          }

          return joinedYear === targetYear && joinedMonth === targetMonth;
        }

        return true;
      });
    }

    setFilteredData(result);
  }, [globalFilter, roleFilter, joinedFilter, users]);

  function extractYearFromDate(dateString) {
    const yearMatch = dateString.match(/\b(\d{4})\b/);
    return yearMatch ? parseInt(yearMatch[1]) : null;
  }

  function extractMonthFromDate(dateString) {
    const months = {
      'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5,
      'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11
    };

    const monthMatch = dateString.toLowerCase().match(/(january|february|march|april|may|june|july|august|september|october|november|december)/);
    return monthMatch ? months[monthMatch[0]] : null;
  }


  const columns = useMemo(() => [
    {
      id: 'select',
      header: ({ table }) => (
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
          <span className="checkmark"></span>
        </label>
      ),
      cell: ({ row }) => (
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
          <span className="checkmark"></span>
        </label>
      ),
      size: 60,
    },
    {
      accessorKey: 'name',
      header: 'Full Name',
      cell: ({ row }) => (
        <div className="user-cell">
          <img src={row.original.avatar} className="user-avatar" alt={row.original.name} />
          <span className="user-name">{row.original.name}</span>
        </div>
      ),
      size: 190,
    },
    {
      accessorKey: 'email',
      header: 'Email Address',
      cell: ({ getValue }) => <span className="user-email">{getValue()}</span>,
      size: 220,
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ getValue }) => <span className="user-location">{getValue()}</span>,
      size: 200,
    },
    {
      accessorKey: 'joined',
      header: 'Joined',
      cell: ({ getValue }) => <span className="user-joined">{getValue()}</span>,
      size: 180,
    },
    {
      accessorKey: 'role',
      header: 'Permissions',
      cell: ({ getValue }) => (
        <span className={`badge badge-${getValue()?.toLowerCase()}`}>
          {getValue()}
        </span>
      ),
      size: 160,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => <ActionMenu
        userId={row.original.id}
        onDelete={removeUser}
        onEdit={editUser}
        onPatch={patchUser}
      />,
      size: 80,
    },
  ], []);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="table-container">
      <table className="tanstack-table">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className="table-header">
              {headerGroup.headers.map(header => (
                <th key={header.id} style={{ width: header.getSize() }}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="table-row">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} style={{ width: cell.column.getSize() }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="table-footer">
        <div className="pagination-container">

          <button
            className="nav-btn"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            ‹
          </button>

          <button
            className={`page-btn ${table.getState().pagination.pageIndex === 0 ? "active" : ""}`}
            onClick={() => table.setPageIndex(0)}
          >
            1
          </button>

          <button
            className={`page-btn ${table.getState().pagination.pageIndex === 1 ? "active" : ""}`}
            onClick={() => table.setPageIndex(1)}
          >
            2
          </button>

          <button
            className={`page-btn ${table.getState().pagination.pageIndex === 2 ? "active" : ""}`}
            onClick={() => table.setPageIndex(2)}
          >
            3
          </button>

          <button
            className={`page-btn ${table.getState().pagination.pageIndex === 3 ? "active" : ""}`}
            onClick={() => table.setPageIndex(3)}
          >
            4
          </button>

          <span className="ellipsis">…</span>

          <button
            className={`page-btn ${table.getState().pagination.pageIndex === 9 ? "active" : ""}`}
            onClick={() => table.setPageIndex(9)}
          >
            10
          </button>

          <button
            className="nav-btn"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            ›
          </button>

        </div>

        <div className="rows-per-page">
          Show{' '}
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>{' '}
          rows
        </div>
      </div>
    </div>
  );
}