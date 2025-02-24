import React, { useState, useEffect, useMemo } from 'react';
import { TbCurrencyNaira } from 'react-icons/tb';
//import Cardone from '../components/cards/cardone';
import { useCreateAccountMutation, useGetAllAccountsQuery, useDeleteLicenseMutation, useDeleteAccountAndUsersMutation, useAddMoreLicensesMutation, useUpdateMonthlyRequestLimitMutation } from '../../features/api/apiSlice';
import countryList from "react-select-country-list";
const LicenseModal = ({ isVisible, onClose, license }) => {
  console.log("this is data ", license);
  if (!isVisible) return null;

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = license.license.slice(indexOfFirstRecord, indexOfLastRecord);

  const totalPages = Math.ceil(license.license.length / recordsPerPage);

  const [deleteLicense, {isLoading, isError, isSuccess}] = useDeleteLicenseMutation()
  const [updateMonthlyRequestLimit, {isLoading: isLoadingUpdateMonthlyRequestLimit, isError: isErrorUpdateMonthlyRequestLimit, isSuccess: isSuccessUpdateMonthlyRequestLimit}] = useUpdateMonthlyRequestLimitMutation()

  const handleDeleteLicense = async(license, id)=>{
    console.log("license", license, id);
    const payload = {
      id: id,
      licenseCode: license.licenseCode
    }

    try {
      const response = await deleteLicense(payload)
      // pop a modal to confirm the deletion, telling the user this action cannot be undone
      if(confirm("You are about to delete a license and the user associated with it, this action cannot be undone")){
        console.log("response", response);
        if(response.error) {
          alert(response.error.data.message);
          onClose();
        } else {
          alert("License deleted successfully");
          onClose();
        }
      }
    } catch (error) {
      console.log("error", error);
    }

   

  
  }

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
      <div className="bg-white p-6 rounded-lg shadow-lg w-[80%]">
        <h2 className="text-xl font-bold mb-4">License Information</h2>
        <p><strong>Name of Organization:</strong> {license.accountName}</p>
        <p><strong>Email:</strong> {license.email}</p>
        <p><strong>Category:</strong> {license.category}</p>
        <p><strong>Number of Licenses:</strong> {license.license.length}</p>
        <p><strong>Monthly Request Limit:</strong> {license.monthlyRequestLimit}</p>
        <div className="overflow-x-auto mt-10">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>License</th>
                <th>Parent License</th>
                <th>Role</th>
                <th>Action</th>
             
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((item, index) => (
                <tr key={index}>
                  <td> 
                    {
                      item.fullName ? item.fullName : "Not Assigned"
                    }
                    </td>
                  <td>
                  {
                      item.email ? item.email : "Not Assigned"
                    }
                    </td>
                  <td>{item.licenseCode}</td>
                  <td>{item.parentLicense}</td>
                  <td> {
                      item.role ? item.role : "Not Assigned"
                    }</td>
                  <td>
                    <span className=' cursor-pointer' onClick={() => handleDeleteLicense(item, license._id)}>Delete License</span>
                  </td>
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
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="btn btn-primary"
          >
            Next
          </button>
        </div>

        <button onClick={onClose} className="mt-4 btn btn-primary">Close</button>
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
  console.log('this is data', data);
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

    console.log("this is the country", payload);

    try {
      const response = await createAccount(payload);
      console.log('res', response);

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

    console.log('payload', payload);
  };

  const handleViewLicense = (license) => {
    setSelectedLicense(license);
    setIsModalVisible(true);
  };

  const [deleteAccountAndUsers] = useDeleteAccountAndUsersMutation()

  const handleDeleteAccountAndUsers = async(id) => {
    console.log("this is the id", id);  
    if(confirm("You are about to delete an organization and all the users associated with it, this action cannot be undone")){
      const response = await deleteAccountAndUsers(id)
      console.log("response", response);
      if(response.error){
        alert(response.error.data.message);
      } else {
        alert("Organization and users deleted successfully");
      }
    }
  }

  const handleAddMoreLicenses = (item) => {
    console.log("this is the item", item);
    setItem(item);
    document.getElementById('my_modal_3').showModal()
  }

  const handleUpdateMonthlyRequestLimit = (item) => {
    console.log("this is the item", item);
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
    console.log("response", response);
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


  console.log("this is the payload", payload);
}

const handleUpdateMonthlyRequestLimitSubmit = async() => {
  console.log("this is the item", item);
  const payload = {
    id: item._id,
    monthlyRequestLimit: monthlyRequestLimit
  }

  try {
    const response = await updateMonthlyRequestLimit(payload)
    console.log("response", response);
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
                  <select onChange={(e) => setCategory(e.target.value)} className="select select-bordered w-full min-w-full">
                    <option disabled selected>Select Organization Category</option>
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
