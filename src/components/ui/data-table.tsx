
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type DataTableProps = {
  data: any[];
  columns: {
    header: string;
    accessor: string;
    cell?: (value: any, row: any) => React.ReactNode;
  }[];
  title?: string;
  className?: string;
  itemsPerPage?: number;
};

export function DataTable({ data, columns, title, className, itemsPerPage = 5 }: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Paginación
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.length);
  const paginatedData = data.slice(startIndex, endIndex);

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
          {paginatedData.map((row, rowIndex) => (
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
      
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-4 space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="bg-black/40 text-flota-text border-flota-secondary/30 hover:bg-black/60"
          >
            Anterior
          </Button>
          <span className="text-sm text-flota-text">
            Página {currentPage} de {totalPages}
          </span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="bg-black/40 text-flota-text border-flota-secondary/30 hover:bg-black/60"
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}
