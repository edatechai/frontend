import React, {useState} from 'react'
import { TbCurrencyNaira } from "react-icons/tb";
//import Cardone from '../components/cards/cardone';
import { useCreateAccountMutation, useGetAllAccountsQuery } from '../../features/api/apiSlice';

const Index = () => {
  const[accountName, SetAccountName] = useState()
  const[contactFullName, setContactFullName] = useState()
  const[email, setEmail] = useState()
  const[role, setRole] = useState('Admin')
  const[category, setCategory] = useState()
  const[numberOfLicense, setNumberOfLicense] = useState()
  const[licenseStatus, setLicenseStatus] = useState('active')
  const [showToast, setShowToast] = useState(false);

  const [createAccount, {isloading, isError, isSuccess}] = useCreateAccountMutation()
  const {data, isLoading} = useGetAllAccountsQuery()
  console.log("this is data", data)

  const handleSubmit = async()=>{
    const payload = {
      accountName,
      contactFullName,
      email,
      role,
      category,
      numberOfLicense,
      licenseStatus
    }

    try {
      const response = await createAccount(payload);
      console.log("res", response);
      // if (response.data.status === true) {
      //   console.log("account created");
      //   document.getElementById('my-drawer-4').checked = false; // Close the drawer
      //   setShowToast(true); // Show toast message
      //   setTimeout(() => {
      //     setShowToast(false); // Hide toast message after 4 seconds
      //   }, 40000);
      // }else{
      //   console.log("here",response.error.data.status)
      // }

      if(response.error){
        alert(response.error.data.message)
      }else{
        document.getElementById('my-drawer-4').checked = false; // Close the drawer
        setShowToast(true); // Show toast message
        setTimeout(() => {
          setShowToast(false); // Hide toast message after 4 seconds
        }, 40000);

      }
    } catch (error) {
      console.error("Error creating account", error);
    } finally {
      // Reset form fields
      SetAccountName('');
      setContactFullName('');
      setEmail('');
      setRole('');
      setCategory('');
      setNumberOfLicense('');
      setLicenseStatus('');
    

    }

    console.log("payload", payload);
  };


    return (
        <div className="flex lg:max-w-full px-8 py-5">

        <div className="justify-between">
          {/* <div className=''>Create Organization</div> */}

          <div className="drawer drawer-end">
  <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
  <div className="drawer-content py-6">
    {/* Page content here */}
    <label htmlFor="my-drawer-4" className="drawer-button btn btn-primary mb-4">Create Organization</label>
    <div className="overflow-x-auto">
  <table className="table">
    {/* head */}
    <thead>
      <tr>
        <th>
          <label>
            <input type="checkbox" className="checkbox" />
          </label>
        </th>
        <th>Contact Details</th>
        <th>Name of Organization</th>
        <th>Email Address</th>
        <th>Category</th>
        <th>Number of License</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
     
      {/* row 4 */}
      {
        data?.map((item, index)=>{
          return(
              <tr>
        <th>
          <label>
            <input type="checkbox" className="checkbox" />
          </label>
        </th>
        <td>
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="mask mask-squircle w-12 h-12">
                <img src="https://img.daisyui.com/tailwind-css-component-profile-5@56w.png" alt="Avatar Tailwind CSS Component" />
              </div>
            </div>
            <div>
              <div className="font-bold">{item.license[0].fullName}</div>
              <div className="text-sm opacity-50">Nigeria</div>
            </div>
          </div>
        </td>
        <td>
        {item.accountName}
        </td>
        <td>{item.license[0].email}</td>
        <td>
        <td>{item.category}</td>
        </td>
        <td>
        <td>{item.numberOfLicense}</td>
        </td>
        <td>
          <td className='badge badge-ghost badge-sm cursor'>View License</td>
        </td>
      </tr>
          )
        })
      }
    
    </tbody>
    
    
  </table>
</div>
   
  </div> 


  <div className="drawer-side">
    <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>

    <div className='w-[27%] bg-white min-h-screen  flex flex-col px-5  justify-between '>
      {/* <h1>jfjkjkjks</h1> */}
      <div className='flex-row justify-end py-3 flex'>
         <label htmlFor="my-drawer-4" className="drawer-button btn-circle btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
         </label>  
      </div>

      <div className='py-8'>
      <div className='mt-4'>
        <div className='text-md font-sm py-2'>Name of Organization</div>
      <input
      value={accountName}
      onChange={(e) => SetAccountName(e.target.value)}
       type="text" placeholder="Organization's name" className="input input-bordered w-full min-w-full" />
      </div>

      <div className='mt-4'>
        <div className='text-md font-sm py-2'>Organization's contacts full name</div>
      <input
      value={contactFullName}
      onChange={(e) => setContactFullName(e.target.value)}
       type="text" placeholder="Contact full name" className="input input-bordered w-full min-w-full" />
      </div>

      <div className='mt-4'>
        <div className='text-md font-sm py-2'>Organization's contacts email address</div>
      <input 
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      type="text" placeholder="Contact email address" className="input input-bordered w-full min-w-full" />
      </div>

      <div className='mt-4'>
        <div className='text-md font-sm py-2'>Organization's Category</div>
        <select   onChange={(e) => setCategory(e.target.value)} className="select select-bordered w-full min-w-full">
  <option disabled selected>Select Org Category</option>
  <option value="College">College</option>
  <option value="High School">High School</option>
  <option value="Univercity">Univercity</option>
</select>
      </div>
      <div className='mt-4'>
        <div className='text-md font-sm py-2'>Number of Licenses</div>
      <input
      value={numberOfLicense}
      onChange={(e) => setNumberOfLicense(e.target.value)}
       type="number" placeholder="Number of Licenses" className="input input-bordered w-full min-w-full" />
      </div>

      <div className='mt-4'>
      <button
      disabled={isloading} 
      onClick={handleSubmit}
      className="btn btn-wide min-w-full btn-primary">
        {
          isloading ? <span className="loading loading-spinner loading-md"></span>  : "Create Organization"
        }
        </button>
      </div>


      </div>
    </div>
    
    
 

    
    </div>
   

</div>





          
        </div>
      </div>
      
    )
}

export default Index