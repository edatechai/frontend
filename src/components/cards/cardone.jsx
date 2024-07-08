import React from "react";
import { TbCurrencyNaira } from "react-icons/tb";


const Cardone =  async()=>{
    return(
        <div className="card w-[100%]  lg:min-w-[100%] bg-white text-primary-content shadow-md shadow-slate200 rounded-lg border  border-solid mt-2 mb-2 mr-4">
  <div className="py-5 px-5 ">

    <div className="flex flex-row justify-between">
        <div className="text-[14px] text-slate900">Daily rate</div>
        <div><TbCurrencyNaira/></div>
    </div>

    <div>
        <div className="  mt-3 flex flex-row items-center">
       
        <div className="text-slate900 text-[30px]">
        <TbCurrencyNaira/>
        </div>
        <h2 className='text-slate900  text-[23px] font-bold'>3000000</h2>
        </div>
    
    </div>
    
  </div>
</div>
    )

}

export default Cardone