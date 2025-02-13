import React from "react";
import { useSelector } from "react-redux";
import { licenseColumns } from "../../components/table/columns";
import { DataTable } from "../../components/table/data-table";
import { useGetAccountByIdQuery, useGenerateUserGuideMutation } from "../../features/api/apiSlice";
import jsPDF from "jspdf";
import * as XLSX from 'xlsx';

const Index = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  console.log("userr info", userInfo);
  const { data, error, isLoading } = useGetAccountByIdQuery(userInfo.accountId);
  console.log("my data", data);

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
  const [generateUserGuide, { isLoading: isGenerating }] = useGenerateUserGuideMutation();

  const handleGenerateUserGuide = async () => {
   const response = await generateUserGuide(data?._id);
   console.log("response", response);
   if(response?.data?.success === true){
    alert(response?.data?.message);
   }else{
    alert(response?.data?.message);
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

    doc.autoTable({
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

  const handleExportToExcel = () => {
    const tableColumn = ["S.No", "License Code", "Parent License", "User Name", "Owner", "Email", "Role"];
    const tableRows = data.license.map((item, index) => [
      index + 1,
      item.licenseCode || "Not assigned",
      item.parentLicense || "Not assigned",
      item.username || "Not assigned",
      item.owner || "Not assigned",
      item.email || "Not assigned",
      item.role || "Not assigned"
    ]);

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([tableColumn, ...tableRows]);
    
    // Set column widths (approximately 15 characters wide)
    const colWidth = 15;
    const wscols = tableColumn.map((col, index) => ({
      wch: index === 0 ? 8 : colWidth  // Make S.No column slightly narrower
    }));
    ws['!cols'] = wscols;

    // Auto-fit row heights
    const wsrows = Array(tableRows.length + 1).fill({ hpt: 25 }); // 25 points height
    ws['!rows'] = wsrows;

    XLSX.utils.book_append_sheet(wb, ws, "License Keys");
    XLSX.writeFile(wb, "license-keys.xlsx");
  };

  return (
    <div className=" mt-10 px-7">
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-medium">License Keys</div>
        <div className="space-x-2">
          {data?.userGuideUrl ? (
            <button onClick={() => window.open(data.userGuideUrl, '_blank')} className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm">
              Download User Guide
            </button>
          ) : (
            <button onClick={handleGenerateUserGuide} className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm">
             {isGenerating ? "Generating..." : "Generate User Guide"}
            </button>
          )}
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
