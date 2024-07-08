import React from 'react';
import { useSelector } from 'react-redux';
import { useGetAccountByIdQuery } from '../../features/api/apiSlice';

const Index = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  console.log("userr info", userInfo);
  const { data, error, isLoading } = useGetAccountByIdQuery(userInfo.accountId);
  console.log("my data", data);
  return (
    <div className=' mt-10 px-7'>
      <div className='text-xl font-medium'>License Keys </div>
    <div className="overflow-x-auto min-w-full">
  <table className="table table-zebra">
    {/* head */}
    <thead>
      <tr>
        <th className='font-bold'>License Code</th>
        <th className='font-bold'>License Limit</th>
        <th className='font-bold'>Parent License</th>
        <th className='font-bold'>Owner</th>
        <th className='font-bold'>Email</th>
        <th className='font-bold'>Role</th>
        <th className='font-bold'>Action</th>
      </tr>
    </thead>
    <tbody>
      {/* row 1 */}
      {
        data?.license.map((item, index)=>{
          return(
             <tr>
        <td className="gap-2">{item.licenseCode}  <div className="badge badge-ghost p-3 badge-sm cursor">copy</div> </td>
        <td>{item.licenseLimit}</td>
        <td>{item.parentLicense} <div className="badge badge-ghost p-3 badge-sm cursor">copy</div> </td>
        <th> 
          {
            item.fullName === undefined  ? "Not Assigned" : item.fullName
          }
         
          </th>
        <td>
        {
            item.email === undefined  ? "Not Assigned" : item.email
          }
          </td>
        <td>
        {
            item.role === undefined  ? "Not Assigned" : item.role
          }
        </td>
        <td></td>
       
      </tr>
          )
          
        })
      }
     
      {/* row 2 */}
     
    </tbody>
  </table>
</div>
      
    </div>
  );
};

export default Index;