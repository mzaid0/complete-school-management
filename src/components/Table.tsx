import React from "react";

const Table = ({
  columns,
  renderRow,
  data,
}: {
  columns: { header: string; accessor: string; className?: string }[];
  renderRow: (row: any) => React.ReactNode;
  data: any[];
}) => {
  return (
    <table className="min-w-full bg-white mt-4 text-sm">
      <thead>
        <tr className="text-sm text-gray-500 text-left">
          {columns.map((column) => (
            <th key={column.accessor} className={column.className}>
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          // Add `hover:bg-gray-100` class to `tr` for hover effect
          <tr
            key={row.id}
            className="hover:bg-lamaSkyLight border-b border-gray-200 even:bg-slate-50"
          >
            {renderRow(row)}
          </tr>
        ))}
      </tbody>
    </table> 
  );
};

export default Table;
