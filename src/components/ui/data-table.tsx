
import { cn } from "@/lib/utils";

type DataTableProps = {
  data: any[];
  columns: {
    header: string;
    accessor: string;
    cell?: (value: any, row: any) => React.ReactNode;
  }[];
  title?: string;
  className?: string;
};

export function DataTable({ data, columns, title, className }: DataTableProps) {
  return (
    <div className={cn("card-dashboard overflow-x-auto", className)}>
      {title && <h3 className="font-montserrat text-xl mb-4">{title}</h3>}
      <table className="w-full text-left">
        <thead className="text-flota-text bg-black/40 border-b border-flota-secondary/20">
          <tr>
            {columns.map((column) => (
              <th key={column.accessor} className="px-4 py-3 font-montserrat">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              className="border-b border-flota-secondary/10 hover:bg-black/30"
            >
              {columns.map((column) => (
                <td key={column.accessor} className="px-4 py-3">
                  {column.cell 
                    ? column.cell(row[column.accessor], row) 
                    : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
