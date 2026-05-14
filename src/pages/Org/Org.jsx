import React from "react";
import { useSelector } from "react-redux";
import { licenseColumns } from "../../components/table/columns";
import { DataTable } from "../../components/table/data-table";
import { useGetAccountByIdQuery, useAddOrgAdminMutation } from "../../features/api/apiSlice";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from 'exceljs';
import { toast } from 'sonner';

const AddOrgAdminModal = ({ isVisible, onClose, accountId, licenses = [] }) => {
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [addOrgAdmin, { isLoading }] = useAddOrgAdminMutation();

  const availableLicenses = licenses.filter(
    (l) => l.licenseCode?.startsWith('OA') && !l.fullName
  );
  const nextLicense = availableLicenses[0] ?? null;

  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  const handleSubmit = async () => {
    if (!fullName.trim()) {
      toast.error('Full name is required');
      return;
    }
    if (!email.trim()) {
      toast.error('Email address is required');
      return;
    }
    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    const response = await addOrgAdmin({ id: accountId, fullName: fullName.trim(), email: email.trim() });
    if (response.error) {
      toast.error(response.error.data?.message || 'Failed to add org-admin');
    } else {
      toast.success('Org-admin added. Login details sent to their email.');
      setFullName('');
      setEmail('');
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">Add Org Admin</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        {!nextLicense ? (
          <div className="px-6 py-8 flex flex-col items-center gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-2xl">!</div>
            <div>
              <p className="font-semibold text-gray-800">No org-admin licenses available</p>
              <p className="text-sm text-gray-500 mt-1">
                Ask a super-admin to add more org-admin licenses to your organisation before inviting a new admin.
              </p>
            </div>
            <button onClick={onClose} className="btn btn-outline w-full">Close</button>
          </div>
        ) : (
          <div className="px-6 py-5 flex flex-col gap-4">
            <p className="text-sm text-gray-500">The new admin will receive an email with their login credentials.</p>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-indigo-500 font-medium uppercase tracking-wide">License to be assigned</p>
                <p className="text-sm font-mono font-semibold text-indigo-800 mt-0.5">{nextLicense.licenseCode}</p>
              </div>
              <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full font-medium">
                {availableLicenses.length} available
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input
                disabled={isLoading}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                type="text"
                placeholder="e.g. John Smith"
                className="input input-bordered w-full"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="e.g. john@school.com"
                className={`input input-bordered w-full ${email && !isValidEmail(email) ? 'input-error' : ''}`}
              />
              {email && !isValidEmail(email) && (
                <span className="text-xs text-red-500 mt-0.5">Please enter a valid email address</span>
              )}
            </div>
            <button
              disabled={isLoading}
              onClick={handleSubmit}
              className="btn btn-primary w-full"
            >
              {isLoading ? <span className="loading loading-spinner loading-md"></span> : 'Send Invitation'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Index = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const { data, error, isLoading, refetch } = useGetAccountByIdQuery(userInfo.accountId);
  const [showAddOrgAdmin, setShowAddOrgAdmin] = React.useState(false);

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
        0: { cellWidth: 20 },
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
    <div className="mt-10 px-7">
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-medium">License Keys</div>
        <div className="space-x-2">
          <button
            onClick={() => { refetch(); setShowAddOrgAdmin(true); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm"
          >
            + Add Org Admin
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
      <AddOrgAdminModal
        isVisible={showAddOrgAdmin}
        onClose={() => setShowAddOrgAdmin(false)}
        accountId={userInfo.accountId}
        licenses={data?.license ?? []}
      />
    </div>
  );
};

export default Index;
