import React from 'react'
import { useSelector } from 'react-redux'

import TeacherRoom from '../../components/classroom/TeacherRoom';
import StudentRoom from '../../components/classroom/StudentRoom';

const Index = () => {
    const userInfo = useSelector((state) => state.user.userInfo);
    console.log("data", userInfo.role)

  return (
    <div className='px-7 py-10'>
        {userInfo?.role == "teacher" ?  <TeacherRoom /> : <StudentRoom />}
    </div>
  )
}

export default Index