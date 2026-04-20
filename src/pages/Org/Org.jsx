import React from "react";
import { useSelector } from "react-redux";
import { licenseColumns } from "../../components/table/columns";
import { DataTable } from "../../components/table/data-table";
import { useGetAccountByIdQuery } from "../../features/api/apiSlice";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from 'exceljs';

const Index = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const { data, error, isLoading } = useGetAccountByIdQuery(userInfo.accountId);

  const handleCopyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };
  const [isDownloading, setIsDownloading] = React.useState(false);

  const handleDownloadUserGuide = async () => {
    try {
      setIsDownloading(true);
      const token = localStorage.getItem('Token');
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const response = await fetch(`${baseUrl}/api/users/downloadUserGuide`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to download user guide');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'EDATECH-User-Guide.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Could not download user guide. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleExportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["S.No", "License Code", "Parent License", "User Name", "Owner", "Email", "Role"];
    const tableRows = [];

    data.license.forEach((item, index) => {
      const rowData = [
        index + 1,
        item.licenseCode || "Not assigned",
        item.parentLicense || "Not assigned", 
        item.username || "Not assigned",
        item.owner || "Not assigned",
        item.email || "Not assigned",
        item.role || "Not assigned"
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      styles: { cellWidth: 'auto', fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 20 },  // S.No column
        1: { cellWidth: 34 },
        2: { cellWidth: 34 },
        3: { cellWidth: 25 },
        4: { cellWidth: 30 },
        5: { cellWidth: 30 },
        6: { cellWidth: 30 }
      }
    });
    doc.save("license-keys.pdf");
  };

  const handleExportToExcel = async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('License Keys');

    ws.columns = [
      { header: 'S.No',           key: 'sno',           width: 8  },
      { header: 'License Code',   key: 'licenseCode',   width: 15 },
      { header: 'Parent License', key: 'parentLicense', width: 15 },
      { header: 'User Name',      key: 'username',      width: 15 },
      { header: 'Owner',          key: 'owner',         width: 15 },
      { header: 'Email',          key: 'email',         width: 15 },
      { header: 'Role',           key: 'role',          width: 15 },
    ];

    data.license.forEach((item, index) => {
      ws.addRow({
        sno:           index + 1,
        licenseCode:   item.licenseCode   || 'Not assigned',
        parentLicense: item.parentLicense || 'Not assigned',
        username:      item.username      || 'Not assigned',
        owner:         item.owner         || 'Not assigned',
        email:         item.email         || 'Not assigned',
        role:          item.role          || 'Not assigned',
      });
    });

    const buffer = await wb.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'license-keys.xlsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className=" mt-10 px-7">
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-medium">License Keys</div>
        <div className="space-x-2">
          <button onClick={handleDownloadUserGuide} disabled={isDownloading} className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm disabled:opacity-60">
            {isDownloading ? "Downloading..." : "Download User Guide"}
          </button>
          <button onClick={handleExportToPDF} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
            Export to PDF
          </button>
          <button onClick={handleExportToExcel} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm">
            Export to Excel
          </button>
        </div>
      </div>
      {data?.license && (
        <DataTable columns={licenseColumns} data={data?.license} />
      )}
    </div>
  );
};

export default Index;
