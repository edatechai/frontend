import React from "react";
import { useSelector } from "react-redux";
import { licenseColumns } from "../../components/table/columns";
import { DataTable } from "../../components/table/data-table";
import { useGetAccountByIdQuery } from "../../features/api/apiSlice";

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

  return (
    <div className=" mt-10 px-7">
      <div className="text-xl font-medium">License Keys</div>
      {data?.license && (
        <DataTable columns={licenseColumns} data={data?.license} />
      )}
    </div>
  );
};

export default Index;
