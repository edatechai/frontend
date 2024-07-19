
import React, { useState } from 'react';
import { Link } from 'react-router-dom';


const SidebarButton =(props)=>{
    const active = props.active
    const [activeItem, setActiveItem] = useState('');
  
    const handleItemClick = (active)=> {
      // setActiveItem(active);
      props.active
    };

    return(
        <li className='py-1'>
        <Link to={props.to}>
        <button 
          onClick={props.click}
          className={`w-full flex flex-row items-center  ${activeItem === `${props.active}` ? 'bg-slate900 text-slate50 rounded-[6px]  btn-sm hover:bg-slate-800 font-normal':
           ' text-white rounded-[6px]  btn-sm hover:bg-slate-700 font-normal'
        } `}>
            <div>{props.icon}</div> 
            <div className='px-2 hidden lg:block'>{props.label}</div>
            </button>
        </Link>
        </li>

    )
}

export default  SidebarButton;