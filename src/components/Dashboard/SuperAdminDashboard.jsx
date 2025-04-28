import React from 'react'
import { TbCurrencyNaira } from "react-icons/tb";
//import Cardone from '../components/cards/cardone';
import { useGetTestQuery } from '../../features/api/apiSlice';
import { latexToHTML } from "@/lib/utils";

const SuperAdminDashboard = () => {
    const { data, isLoading, isError } = useGetTestQuery();
    console.log(data);
    return (
        <div className='min-w-screen lg:max-w-[100%] px-8 py-5'>
          <div>
            <h2 className='text-slate900  text-[23px] font-[900] mb-5'>Super Admin Dashboard</h2>
          </div>

          <div>
            <h4 className='text-slate900  text-[18px] font-[900] mb-5'>Latex to text format integrity</h4>
          </div>
          <div>
            {
              data?.map((question, index) => (
                <div key={index} className='mb-5'>
                    <h4 className='text-slate900  text-[18px] font-[900] mb-1'>{question.code}</h4>
                  <h4>{index + 1}. <span dangerouslySetInnerHTML={{ __html: latexToHTML(question.response) }}></span></h4>
                
                </div>
              ))
            }
          </div>
          
    
          <div className='lg:flex lg:flex-row'>
              
          </div>
          
        </div>
    )
}

export default SuperAdminDashboard



