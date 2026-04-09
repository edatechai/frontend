import React from 'react'
import Quiz from '../../components/Quiz/Index'
import { useLocation } from 'react-router-dom';

const Index = () => {
    let { state } = useLocation();
  return (
    <Quiz data={state} />
  )
}

export default Index