import { useGetUsersByAccountIdQuery } from "../../features/api/apiSlice";
import { useSelector } from "react-redux";
import { useState } from "react";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const ActiveLicenses = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const { data, isLoading, isError, error } = useGetUsersByAccountIdQuery(userInfo.accountId);

  // Calculate pagination values
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = data?.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil((data?.length || 0) / recordsPerPage);

  // Handle page changes
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };


  const handleExportToPDF = () => {
    const doc = new jsPDF();
    
    // Create table data
    const tableColumn = ["Sr. No.", "License Code", "Full Name", "Email", "Role"];
    const tableRows = [];

    data?.forEach((item: any, index: number) => {
      const rowData = [
        (index + 1).toString().padStart(2, '0'),
        item.license || "Not assigned",
        item.fullName || "Not assigned", 
        item.email || "Not assigned",
        item.role || "Not assigned"
      ];
      tableRows.push(rowData);
    });

    // Update column widths to be more evenly distributed
    const pageWidth = doc.internal.pageSize.width;
    const margins = 20;
    const usableWidth = pageWidth - margins;
    const columnWidth = usableWidth / 5; // 5 columns

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { 
        fontSize: 9,
        cellPadding: 3,
        halign: 'left',
        valign: 'middle',
      },
      columnStyles: {
        0: { cellWidth: columnWidth * 0.5 },  // Slightly smaller for index
        1: { cellWidth: columnWidth * 1.2 },  // Slightly larger for license
        2: { cellWidth: columnWidth * 1.1 },  // Slightly larger for name
        3: { cellWidth: columnWidth * 1.2 },  // Slightly larger for email
        4: { cellWidth: columnWidth * 1 },    // Normal for role
      },
      headStyles: {
        fillColor: [0, 0, 139],
        textColor: 255,
        fontStyle: 'bold',
      },
    });

    doc.setFontSize(16);
    doc.text("Active Licenses", 14, 15);
    
    doc.save("active-licenses.pdf");
  };

  const handleExportToExcel = () => {
    // Prepare data in the same format as the table
    const excelData = data?.map((item: any, index: number) => ({
      'Sr. No.': (index + 1).toString().padStart(2, '0'),
      'License Code': item.license || 'Not assigned',
      'Full Name': item.fullName || 'Not assigned',
      'Email': item.email || 'Not assigned',
      'Role': item.role || 'Not assigned'
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const columnWidths = [
      { wch: 10 },  // Sr. No.
      { wch: 25 },  // License Code
      { wch: 25 },  // Full Name
      { wch: 25 },  // Email
      { wch: 25 }   // Role
    ];
    ws['!cols'] = columnWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Active Licenses');

    // Save file
    XLSX.writeFile(wb, 'active-licenses.xlsx');
  };





  return (
    <div className=" px-7">
      <div className="flex justify-between items-center mb-4 mt-10">
        <h1>Active Licenses</h1>
        <div className="space-x-2">
          <button 
            onClick={handleExportToExcel} 
            className="mb-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm"
          >
            Export to Excel
          </button>
          <button 
            onClick={handleExportToPDF} 
            className="mb-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
          >
            Export to PDF
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white mt-5 w-full">
        <table className="table w-full">
          <thead>
            <tr className="bg-blue-800 text-white">
              <th className="w-[10%]"></th>
              <th className="w-[22.5%]">License</th>
              <th className="w-[22.5%]">Full Name</th>
              <th className="w-[22.5%]">Email</th>
              <th className="w-[22.5%]">Role</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords?.map((user: any, index: number) => (
              <tr key={index}>
                <th className="w-[10%]">{indexOfFirstRecord + index + 1}</th>
                <td className="w-[22.5%]">{user.license || 'Not Assigned'}</td>
                <td className="w-[22.5%]">{user.fullName || 'Not Assigned'}</td>
                <td className="w-[22.5%]">{user.email || 'Not Assigned'}</td>
                <td className="w-[22.5%]">{user.role || 'Not Assigned'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-end gap-2 my-4 mx-5">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-blue-800 text-white disabled:bg-gray-400"
          >
            Previous
          </button>
          
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === index + 1 
                  ? 'bg-blue-800 text-white' 
                  : 'bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-blue-800 text-white disabled:bg-gray-400"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveLicenses;
