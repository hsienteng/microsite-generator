import React, { useState, useMemo, useEffect } from "react";

interface DataTableProps {
  title?: string;
  headers?: string[];
  rows?: Array<Record<string, any>>;
  data?: Array<Array<string>>;
}

interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

// Layout variants for data tables
const layoutVariants = {
  variant1: {
    containerClass: "py-8",
    titleClass: "text-2xl font-bold mb-6 text-gray-900 dark:text-white",
    cardClass:
      "bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
    tableClass: "",
    headerClass: "bg-gray-50 dark:bg-gray-800",
  },
  variant2: {
    containerClass: "py-12",
    titleClass:
      "text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
    cardClass:
      "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden",
    tableClass: "text-lg",
    headerClass:
      "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900",
  },
  variant3: {
    containerClass: "py-10",
    titleClass:
      "text-2xl font-bold mb-6 text-right text-gray-900 dark:text-white border-r-4 border-r-blue-500 pr-4",
    cardClass:
      "bg-gray-100 dark:bg-gray-800 rounded-r-lg shadow-md border-l-4 border-l-blue-500 overflow-hidden",
    tableClass: "text-sm",
    headerClass: "bg-blue-50 dark:bg-blue-900",
  },
  variant4: {
    containerClass: "py-16",
    titleClass:
      "text-5xl font-black mb-12 text-center text-gray-900 dark:text-white uppercase tracking-wider",
    cardClass:
      "bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden",
    tableClass: "text-lg",
    headerClass: "bg-gray-100 dark:bg-gray-800",
  },
};

export const DataTable: React.FC<DataTableProps> = ({
  title,
  headers = [],
  rows = [],
  data: rawData = [],
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVariant, setSelectedVariant] =
    useState<keyof typeof layoutVariants>("variant1");
  const rowsPerPage = 10;

  // Select random layout variant on component mount
  useEffect(() => {
    const variants = Object.keys(layoutVariants) as Array<
      keyof typeof layoutVariants
    >;
    const randomVariant = variants[Math.floor(Math.random() * variants.length)];
    setSelectedVariant(randomVariant);
  }, []);

  // Get the current layout styles
  const currentLayout = layoutVariants[selectedVariant];

  // Process data to determine headers and rows
  const { finalHeaders, finalData } = useMemo(() => {
    let processedHeaders = headers;
    let processedData = rows;

    // If we have rawData but no explicit headers, assume first row is headers
    if (rawData.length > 0) {
      if (headers.length === 0 && rawData.length > 0) {
        processedHeaders = rawData[0];
        processedData = rawData.slice(1).map((row) => {
          const rowObj: Record<string, any> = {};
          processedHeaders.forEach((header, index) => {
            rowObj[header.toLowerCase().replace(/\s+/g, "_")] =
              row[index] || "";
          });
          return rowObj;
        });
      } else if (headers.length > 0) {
        // Convert array of arrays to array of objects using provided headers
        processedData = rawData.map((row) => {
          const rowObj: Record<string, any> = {};
          processedHeaders.forEach((header, index) => {
            rowObj[header.toLowerCase().replace(/\s+/g, "_")] =
              row[index] || "";
          });
          return rowObj;
        });
      }
    }

    return { finalHeaders: processedHeaders, finalData: processedData };
  }, [headers, rows, rawData]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return finalData;

    return [...finalData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [finalData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey: string) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return (
        <svg
          className="w-4 h-4 ml-1 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 9l4-4 4 4m0 6l-4 4-4-4"
          />
        </svg>
      );
    }

    if (sortConfig.direction === "asc") {
      return (
        <svg
          className="w-4 h-4 ml-1 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      );
    }

    return (
      <svg
        className="w-4 h-4 ml-1 text-blue-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    );
  };

  if (finalHeaders.length === 0 || finalData.length === 0) {
    return (
      <div className={currentLayout.containerClass}>
        {title && <h3 className={currentLayout.titleClass}>{title}</h3>}
        <div className={`${currentLayout.cardClass} p-8 text-center`}>
          <div className="text-gray-500 dark:text-gray-400">
            <svg
              className="w-12 h-12 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-lg font-medium">No data available</p>
            <p className="text-sm">
              There are no records to display in this table.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={currentLayout.containerClass}>
      {title && <h3 className={currentLayout.titleClass}>{title}</h3>}

      <div className={currentLayout.cardClass}>
        {/* Table */}
        <div className="overflow-hidden">
          <table
            className={`w-full table-auto divide-y divide-gray-200 dark:divide-gray-700 ${currentLayout.tableClass}`}
          >
            <thead className={currentLayout.headerClass}>
              <tr>
                {finalHeaders.map((header, index) => {
                  const columnKey = header.toLowerCase().replace(/\s+/g, "_");
                  return (
                    <th
                      key={index}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 break-words"
                      onClick={() => handleSort(columnKey)}
                    >
                      <div className="flex items-center">
                        {header}
                        {getSortIcon(columnKey)}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  {finalHeaders.map((header, colIndex) => {
                    const columnKey = header.toLowerCase().replace(/\s+/g, "_");
                    const value = row[columnKey];
                    return (
                      <td
                        key={colIndex}
                        className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 break-words align-top"
                      >
                        <div className="whitespace-pre-wrap">
                          {value || "-"}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * rowsPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * rowsPerPage, sortedData.length)}
                  </span>{" "}
                  of <span className="font-medium">{sortedData.length}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === currentPage
                            ? "z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-600 dark:text-blue-400"
                            : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
