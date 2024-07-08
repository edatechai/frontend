import React from 'react'
import Quiz from '../../components/Quiz/Index'
import { useLocation } from 'react-router-dom';

const Index = () => {
    let { state } = useLocation();
    console.log("this is state",state?.data)
  return (
    <Quiz data={state} />
  )
}

export default Index