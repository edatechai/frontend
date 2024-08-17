import { useState } from "react";
import {
  useCreateAccountMutation,
  useGetAllAccountsQuery,
} from "../../features/api/apiSlice";

const LicenseModal = ({
  isVisible,
  onClose,
  license,
}: {
  isVisible: boolean;
  onClose: () => void;
  license: {
    license: string;
    accountName: string;
    email: string;
    numberOfLicense: string;
    category: string;
  };
}) => {
  if (!isVisible) return null;

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = license.license.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const totalPages = Math.ceil(license.license.length / recordsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-xl font-bold mb-4">License Information</h2>
        <p>
          <strong>Name of Organization:</strong> {license.accountName}
        </p>
        <p>
          <strong>Email:</strong> {license.email}
        </p>
        <p>
          <strong>Category:</strong> {license.category}
        </p>
        <p>
          <strong>Number of Licenses:</strong> {license.numberOfLicense}
        </p>

        <div className="overflow-x-auto mt-10">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>License</th>
                <th>Parent License</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((item, index) => (
                <tr key={index}>
                  <td>{item.fullName ? item.fullName : "Not Assigned"}</td>
                  <td>{item.email ? item.email : "Not Assigned"}</td>
                  <td>{item.licenseCode}</td>
                  <td>{item.parentLicense}</td>
                  <td> {item.role ? item.role : "Not Assigned"}</td>
                  {/* <td> {
                      item.licenseLimit === 1 ? "Active" : "In-Active"
                    }</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="btn btn-primary"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="btn btn-primary"
          >
            Next
          </button>
        </div>

        <button onClick={onClose} className="mt-4 btn btn-primary">
          Close
        </button>
      </div>
    </div>
  );
};

const Index = () => {
  const [accountName, SetAccountName] = useState("");
  const [contactFullName, setContactFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Admin");
  const [category, setCategory] = useState("");
  const [numberOfLicense, setNumberOfLicense] = useState("");
  const [licenseStatus, setLicenseStatus] = useState("active");
  const [showToast, setShowToast] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [createAccount, { isloading, isError, isSuccess }] =
    useCreateAccountMutation();
  const { data, isLoading } = useGetAllAccountsQuery();
  console.log("this is data", data);

  const handleSubmit = async () => {
    const payload = {
      accountName,
      contactFullName,
      email,
      role,
      category,
      numberOfLicense,
      licenseStatus,
    };

    try {
      const response = await createAccount(payload);
      console.log("res", response);

      if (response.error) {
        alert(response.error.data.message);
      } else {
        document.getElementById("my-drawer-4").checked = false;
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 40000);
      }
    } catch (error) {
      console.error("Error creating account", error);
    } finally {
      SetAccountName("");
      setContactFullName("");
      setEmail("");
      setRole("");
      setCategory("");
      setNumberOfLicense("");
      setLicenseStatus("");
    }

    console.log("payload", payload);
  };

  const handleViewLicense = (license) => {
    setSelectedLicense(license);
    setIsModalVisible(true);
  };

  return (
    <div className="flex lg:max-w-full px-8 py-5">
      <div className="justify-between">
        <div className="drawer drawer-end">
          <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content py-6">
            <label
              htmlFor="my-drawer-4"
              className="drawer-button btn btn-primary mb-4"
            >
              Create Organization
            </label>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>
                      <input type="checkbox" className="checkbox" />
                    </th>
                    <th>Contact Details</th>
                    <th>Name of Organization</th>
                    <th>Email Address</th>
                    <th>Category</th>
                    <th>Number of Licenses</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((item, index) => (
                    <tr key={index}>
                      <th>
                        <input type="checkbox" className="checkbox" />
                      </th>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                              <img
                                src="https://img.daisyui.com/tailwind-css-component-profile-5@56w.png"
                                alt="Avatar Tailwind CSS Component"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">
                              {item.license[0].fullName}
                            </div>
                            <div className="text-sm opacity-50">Nigeria</div>
                          </div>
                        </div>
                      </td>
                      <td>{item.accountName}</td>
                      <td>{item.license[0].email}</td>
                      <td>{item.category}</td>
                      <td>{item.numberOfLicense}</td>
                      <td>
                        <span
                          className="badge badge-ghost badge-sm cursor-pointer"
                          onClick={() => handleViewLicense(item)}
                        >
                          View License
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="drawer-side">
            <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
            <div className="w-[27%] bg-white min-h-screen flex flex-col px-5 justify-between">
              <div className="flex-row justify-end py-3 flex">
                <label
                  htmlFor="my-drawer-4"
                  className="drawer-button btn-circle btn btn-primary"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </label>
              </div>

              <div className="py-8">
                <div className="mt-4">
                  <div className="text-md font-sm py-2">Organization name</div>
                  <input
                    value={accountName}
                    onChange={(e) => SetAccountName(e.target.value)}
                    type="text"
                    placeholder="Organization name"
                    className="input input-bordered w-full min-w-full"
                  />
                </div>

                <div className="mt-4">
                  <div className="text-md font-sm py-2">
                    Organization Contact Full Name
                  </div>
                  <input
                    value={contactFullName}
                    onChange={(e) => setContactFullName(e.target.value)}
                    type="text"
                    placeholder="Organization contact full Name"
                    className="input input-bordered w-full min-w-full"
                  />
                </div>

                <div className="mt-4">
                  <div className="text-md font-sm py-2">
                    Organization Contact Email
                  </div>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="text"
                    placeholder="Organization contact email"
                    className="input input-bordered w-full min-w-full"
                  />
                </div>

                <div className="mt-4">
                  <div className="text-md font-sm py-2">
                    Organization Category
                  </div>
                  <select
                    onChange={(e) => setCategory(e.target.value)}
                    className="select select-bordered w-full min-w-full"
                  >
                    <option disabled selected>
                      Select Organization Category
                    </option>
                    <option value="College">College</option>
                    <option value="High School">High School</option>
                    <option value="High School">Primary School</option>
                    <option value="University">University</option>
                  </select>
                </div>

                <div className="mt-4">
                  <div className="text-md font-sm py-2">Number of License</div>
                  <input
                    value={numberOfLicense}
                    onChange={(e) => setNumberOfLicense(e.target.value)}
                    type="number"
                    placeholder="Number of license"
                    className="input input-bordered w-full min-w-full"
                  />
                </div>

                <div className="mt-4">
                  <button
                    disabled={isloading}
                    onClick={handleSubmit}
                    className="btn btn-wide min-w-full btn-primary"
                  >
                    {isloading ? (
                      <span className="loading loading-spinner loading-md"></span>
                    ) : (
                      "Create Organization"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LicenseModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        license={selectedLicense}
      />
    </div>
  );
};

export default Index;
