import React from 'react'
import { FaRegTimesCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';

const OrderReject = () => {
  return (
    <div className='order-reject order-confirm w-full flex'>
           <div className='order-confirm-left flex flex-col items-center gap-12 py-20 w-full bg-[red]'>
       <FaRegTimesCircle  className='success-icon text-[10vw] text-white' />
        <div className='order-confirm-left-top text-center text-white'>
       <p className='text-lg'>SORRY</p>
       <h1 className='text-5xl font-bold my-2'>YOUR PAYMENT IS FAILED</h1>
       <p className=''>Oops! Something went terribly wrong here</p>
       </div>
       <Link to='/mycart' className="text-[red] font-semibold shadow-md shadow-[#464646] bg-[#fff] px-4 py-2 rounded-full">Please try again</Link>
       </div>
    </div>
  )
}

export default OrderReject