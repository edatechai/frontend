import React, { useState, useEffect, useMemo } from 'react';
import { TbCurrencyNaira } from 'react-icons/tb';
//import Cardone from '../components/cards/cardone';
import { useCreateAccountMutation, useGetAllAccountsQuery, useDeleteLicenseMutation, useDeleteAccountAndUsersMutation, useAddMoreLicensesMutation, useUpdateMonthlyRequestLimitMutation } from '../../features/api/apiSlice';
import countryList from "react-select-country-list";
const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className="ml-1 px-1.5 py-0.5 text-xs rounded border border-gray-300 hover:bg-gray-100 text-gray-500"
      title="Copy"
    >
      {copied ? '✓' : 'Copy'}
    </button>
  );
};

const LicenseModal = ({ isVisible, onClose, license }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteLicense, { isLoading }] = useDeleteLicenseMutation();

  if (!isVisible) return null;

  const recordsPerPage = 10;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = license.license.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(license.license.length / recordsPerPage);

  const handleDeleteLicense = async (item, id) => {
    if (!confirm("You are about to delete a license and the user associated with it. This action cannot be undone.")) return;
    try {
      const response = await deleteLicense({ id, licenseCode: item.licenseCode });
      if (response.error) {
        alert(response.error.data.message);
      } else {
        alert("License deleted successfully");
        onClose();
      }
    } catch (error) {}
  };

  const assigned = license.license.filter(l => l.fullName).length;
  const unassigned = license.license.length - assigned;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{license.accountName}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{license.email} &middot; {license.category}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none mt-1">&times;</button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 px-6 py-4 border-b bg-gray-50">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{license.license.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">Total Licenses</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{assigned}</p>
            <p className="text-xs text-gray-500 mt-0.5">Assigned</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-500">{unassigned}</p>
            <p className="text-xs text-gray-500 mt-0.5">Unassigned</p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto flex-1 px-6 py-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
                <th className="pb-3 pr-4 w-36">Name</th>
                <th className="pb-3 pr-4 w-44">Email</th>
                <th className="pb-3 pr-4">License Key</th>
                <th className="pb-3 pr-4">Parent License</th>
                <th className="pb-3 pr-4 w-28">Role</th>
                <th className="pb-3 w-20">Status</th>
                <th className="pb-3 w-20 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentRecords.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 pr-4 font-medium text-gray-800">
                    {item.fullName || <span className="text-gray-400 italic">Unassigned</span>}
                  </td>
                  <td className="py-3 pr-4 text-gray-600 truncate max-w-[160px]">
                    {item.email || <span className="text-gray-400 italic">—</span>}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono text-gray-700">{item.licenseCode}</code>
                      <CopyButton text={item.licenseCode} />
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1">
                      <code className="text-xs bg-blue-50 px-2 py-1 rounded font-mono text-blue-700">{item.parentLicense}</code>
                      <CopyButton text={item.parentLicense} />
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    {item.role
                      ? <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 capitalize">{item.role}</span>
                      : <span className="text-gray-400 italic text-xs">—</span>
                    }
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.licenseLimit === 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {item.licenseLimit === 1 ? 'Active' : 'Free'}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      disabled={isLoading}
                      onClick={() => handleDeleteLicense(item, license._id)}
                      className="text-xs text-red-500 hover:text-red-700 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50 rounded-b-xl">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="btn btn-sm btn-outline"
          >
            ← Previous
          </button>
          <span className="text-sm text-gray-600">Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong></span>
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="btn btn-sm btn-outline"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};




const Index = () => {
  const options = useMemo(() => countryList().getData(), []);
  const [accountName, SetAccountName] = useState('');
  const [contactFullName, setContactFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Admin');
  const [category, setCategory] = useState('');
  const [numberOfLicense, setNumberOfLicense] = useState('');
  const [licenseStatus, setLicenseStatus] = useState('active');
  const [country, setCountry] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [monthlyRequestLimit, setMonthlyRequestLimit] = useState('');

  const [createAccount, { isloading, isError, isSuccess }] = useCreateAccountMutation();
  const [addMoreLicenses, { isLoading: isLoadingAddMoreLicenses, isError: isErrorAddMoreLicenses, isSuccess: isSuccessAddMoreLicenses }] = useAddMoreLicensesMutation();
  const { data, isLoading } = useGetAllAccountsQuery();
  const [item, setItem] = useState(null);
  const [updateMonthlyRequestLimit, {isLoading: isLoadingUpdateMonthlyRequestLimit, isError: isErrorUpdateMonthlyRequestLimit, isSuccess: isSuccessUpdateMonthlyRequestLimit}] = useUpdateMonthlyRequestLimitMutation()

 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdownId && !event.target.closest('.relative')) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdownId]);

  const handleSubmit = async () => {
    const payload = {
      accountName,
      contactFullName,
      email,
      role,
      category,
      numberOfLicense,
      licenseStatus,
      country: country?.label,
      countryCode: country?.value
    };


    try {
      const response = await createAccount(payload);

      if (response.error) {
        alert(response.error.data.message);
      } else {
        document.getElementById('my-drawer-4').checked = false;
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 40000);
      }
    } catch (error) {
      console.error('Error creating account', error);
    } finally {
      SetAccountName('');
      setContactFullName('');
      setEmail('');
      setRole('');
      setCategory('');
      setNumberOfLicense('');
      setLicenseStatus('');
    }

  };

  const handleViewLicense = (license) => {
    setSelectedLicense(license);
    setIsModalVisible(true);
  };

  const [deleteAccountAndUsers] = useDeleteAccountAndUsersMutation()

  const handleDeleteAccountAndUsers = async(id) => {
    if(confirm("You are about to delete an organization and all the users associated with it, this action cannot be undone")){
      const response = await deleteAccountAndUsers(id)
      if(response.error){
        alert(response.error.data.message);
      } else {
        alert("Organization and users deleted successfully");
      }
    }
  }

  const handleAddMoreLicenses = (item) => {
    setItem(item);
    document.getElementById('my_modal_3').showModal()
  }

  const handleUpdateMonthlyRequestLimit = (item) => {
    setItem(item);
    document.getElementById('my_modal_9').showModal()
  }

  const handleAddMoreLicensesSubmit = async() => {
    // validate the number of license
    if(numberOfLicense < 1){
      alert("Number of licenses cannot be less than 1");
      return;
    }
    // validate the number of license is a number
    if(isNaN(numberOfLicense)){
      alert("Number of licenses must be a number");
      return;
    }
   const payload = {
    id: item._id,
    numberOfLicense
  }

  try {
    const response = await addMoreLicenses(payload)
    if(response.error){
      alert(response.error.data.message);
      // close the modal
      setNumberOfLicense('');
      document.getElementById('my_modal_3').close()

    } else {
      alert("Licenses added successfully");
      // close the modal
      setNumberOfLicense('');
      document.getElementById('my_modal_3').close()
    }
  } catch (error) {
    console.error("Error adding more licenses", error);
  }


}

const handleUpdateMonthlyRequestLimitSubmit = async() => {
  const payload = {
    id: item._id,
    monthlyRequestLimit: monthlyRequestLimit
  }

  try {
    const response = await updateMonthlyRequestLimit(payload)
    if(response.error){
      alert(response.error.data.message);
    } else {
      setMonthlyRequestLimit('');
      document.getElementById('my_modal_9').close()
      alert("Monthly request limit updated successfully");
    }
  } catch (error) {
    console.error("Error updating monthly request limit", error);
  }
  
}
  

 


  return (
    
    <>

    {/* You can open the modal using document.getElementById('ID').showModal() method */}

<dialog id="my_modal_3" className="modal">
  <div className="modal-box">
    <form method="dialog">
      <div>{item?.accountName}</div>
      {/* if there is a button in form, it will close the modal */}
      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <h3 className="font-bold text-lg">Add More Licenses</h3>
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-2 mt-10'>
        
        <input
        disabled={isLoadingAddMoreLicenses}
         value={numberOfLicense} onChange={(e) => setNumberOfLicense(e.target.value)} type="text" id="licenseNumber" placeholder='Number of licenses' className='input input-bordered w-full' />
      </div>
      <button
       disabled={isLoadingAddMoreLicenses}
       onClick={handleAddMoreLicensesSubmit} className='btn btn-primary'>
        {isLoadingAddMoreLicenses ? <span className="loading loading-spinner loading-md"></span> : "Add Licenses"}
      </button>
    </div>
   
  </div>
</dialog>

<dialog id="my_modal_9" className="modal">
  <div className="modal-box">
    <form method="dialog">
      <div>{item?.accountName}</div>
      {/* if there is a button in form, it will close the modal */}
      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <h3 className="font-bold text-lg">Update Monthly Request Limit</h3>
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-2 mt-10'>
        
        <input
        disabled={isLoadingUpdateMonthlyRequestLimit}
         value={monthlyRequestLimit} onChange={(e) => setMonthlyRequestLimit(e.target.value)} type="text" id="monthlyRequestLimit" placeholder='Monthly Request Limit' className='input input-bordered w-full' />
      </div>
      <button
       disabled={isLoadingUpdateMonthlyRequestLimit}
       onClick={handleUpdateMonthlyRequestLimitSubmit} className='btn btn-primary'>
        {isLoadingUpdateMonthlyRequestLimit ? <span className="loading loading-spinner loading-md"></span> : "Update Monthly Request Limit"}
      </button>
    </div>
   
  </div>
</dialog>


    <div className="flex lg:max-w-full  py-5 h-full">
      <div className="justify-between">
        <div className="drawer drawer-end">
          <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content py-6">
            <label htmlFor="my-drawer-4" className="drawer-button btn btn-primary mb-4">Create Organization</label>
            <div className="overflow-x-auto max-h-full h-full w-full min-w-full">
              <table className="table w-full h-full min-w-full">
                <thead className='h-full'>
                  <tr>
                   
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
                      
                      <td>
                        <div className="flex items-center gap-3">
                          
                          <div>
                            <div className="font-bold">{item.license[0].fullName}</div>
                            {/* <div className="text-sm opacity-50">Nigeria</div> */}
                          </div>
                        </div>
                      </td>
                      <td>{item.accountName}</td>
                      <td>{item.license[0].email}</td>
                      <td>{item.category}</td>
                      <td>{item.license.length}</td>

                      <td>
                        <div className="relative">
                          <button 
                            onClick={() => setOpenDropdownId(openDropdownId === item._id ? null : item._id)}
                            className="px-4 py-2 text-sm bg-white border rounded-md shadow-sm hover:bg-gray-50 focus:outline-none flex items-center"
                          >
                            Actions
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          
                          {openDropdownId === item._id && (
                            <ul className="absolute right-0 bottom-full  mb-1 w-48 bg-white border rounded-md shadow-lg m">
                               <li>
                                <button 
                                  onClick={() => {
                                    handleUpdateMonthlyRequestLimit(item);
                                    setOpenDropdownId(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Update Monthly Request Limit
                                </button>
                              </li>
                              <li>
                                <button 
                                  onClick={() => {
                                    handleAddMoreLicenses(item);
                                    setOpenDropdownId(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Add More Licenses
                                </button>
                              </li>
                              <li>
                                <button 
                                  onClick={() => {
                                    handleViewLicense(item);
                                    setOpenDropdownId(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  View License
                                </button>
                              </li>
                              <li>
                                <button 
                                  onClick={() => {
                                    handleDeleteAccountAndUsers(item._id);
                                    setOpenDropdownId(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                                >
                                  Delete Organization
                                </button>
                              </li>
                            </ul>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="drawer-side">
            <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
            <div className='w-[27%] bg-white min-h-screen flex flex-col px-5 justify-between'>
              <div className='flex-row justify-end py-3 flex'>
                <label htmlFor="my-drawer-4" className="drawer-button btn-circle btn btn-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </label>
              </div>

              <div className='py-8'>
                <div className='mt-4'>
                  <div className='text-md font-sm py-2'>Organization name</div>
                  <input
                    value={accountName}
                    onChange={(e) => SetAccountName(e.target.value)}
                    type="text"
                    placeholder="Organization name"
                    className="input input-bordered w-full min-w-full"
                  />
                </div>

                <div className='mt-4'>
                  <div className='text-md font-sm py-2'>Organization Contact Full Name</div>
                  <input
                    value={contactFullName}
                    onChange={(e) => setContactFullName(e.target.value)}
                    type="text"
                    placeholder="Organization contact full Name"
                    className="input input-bordered w-full min-w-full"
                  />
                </div>

                <div className='mt-4'>
                  <div className='text-md font-sm py-2'>Organization Contact Email</div>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="text"
                    placeholder="Organization contact email"
                    className="input input-bordered w-full min-w-full"
                  />
                </div>

                <div className='mt-4'>
                  <div className='text-md font-sm py-2'>Organization Category</div>
                  <select defaultValue="" onChange={(e) => setCategory(e.target.value)} className="select select-bordered w-full min-w-full">
                    <option disabled value="">Select Organization Category</option>
                    <option value="College">College</option>
                    <option value="High School">High School</option>
                    <option value="High School">Primary School</option>
                    <option value="University">University</option>
                  </select>
                </div>

                <div className='mt-4'>
                  <div className='text-md font-sm py-2'>Number of License</div>
                  <input
                    value={numberOfLicense}
                    onChange={(e) => setNumberOfLicense(e.target.value)}
                    type="number"
                    placeholder="Number of license"
                    className="input input-bordered w-full min-w-full"
                  />
                </div>

                <div className="mt-4">
                <div className="text-md font-sm py-2">Counrtry</div>
                <select
                  onChange={(e) =>
                    setCountry(
                      options.find((country) => country.value == e.target.value)
                    )
                  }
                  className="select select-bordered w-full min-w-full"
                >
                  {options.map((val) => (
                    <option value={val.value} key={val.value}>
                      {val.label}
                    </option>
                  ))}
                </select>
              </div>

                <div className='mt-4'>
                  <button
                    disabled={isloading}
                    onClick={handleSubmit}
                    className="btn btn-wide min-w-full btn-primary">
                    {isloading ? <span className="loading loading-spinner loading-md"></span> : "Create Organization"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LicenseModal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} license={selectedLicense} />
    </div>
    </>
  );
};

export default Index;
