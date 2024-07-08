import React from 'react'
import { TbCurrencyNaira } from "react-icons/tb";
import JoinClassRoom from '../../components/classroom/JoinClassRoom'
import JoinClassByTeacher from '../../components/classroom/JoinClassByTeacher'

//import Cardone from '../components/cards/cardone';

const TeachersDashboard = () => {
    return (
        <div className='min-w-screen lg:max-w-[100%] px-8 py-5'>
          <div>
            <h2 className='text-slate900  text-[23px] font-[900] mb-5'>Teacher's Dashboard</h2>
          </div>
          <JoinClassByTeacher/>
        </div>
    )
}

export default TeachersDashboard