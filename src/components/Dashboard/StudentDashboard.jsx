import React from 'react'
import { TbCurrencyNaira } from "react-icons/tb";
//import Cardone from '../components/cards/cardone';
import JoinClassRoom from '../../components/classroom/JoinClassRoom'

const StudentDashboard = () => {
    return (
        <div className='min-w-screen lg:max-w-[100%] lg:px-8 lg:py-5 px-2 py-2'>
          <div>
            <h2 className='text-slate900  text-[20px] font-[600] '>Student Dashboard</h2>
          </div>

          <JoinClassRoom/>

          
        </div>
    )
}

export default StudentDashboard