import React from 'react'
import { TbCurrencyNaira } from "react-icons/tb";
//import Cardone from '../components/cards/cardone';

const OrgDashboard = () => {
    return (
        <div className=''>
          <div className="justify-between, flex-row flex justify-items-center">
            <div>one</div>
            <div>two</div>

          </div>


          <div>
            <h2 className='text-slate900  text-[23px] font-[900] mb-5'>Org Admin Dashboard</h2>
          </div>
          
    
          <div className='lg:flex lg:flex-row'>
               {/* <Cardone/> */}
    
               {/* <Cardone
               title="Daily rate"
               amount="45,231.89"
               icon={<TbCurrencyNaira/>}
               /> */}
    
    
    
              
    
          </div>
          
        </div>
    )
}

export default OrgDashboard