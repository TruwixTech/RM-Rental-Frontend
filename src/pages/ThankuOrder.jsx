import React from 'react'
import { IoCheckmarkCircleOutline } from "react-icons/io5";

const ThankuOrder = () => {
  return (
    <div className='thanku-order w-full bg-[#f1f1f1]'>
        <div className='flex flex-col items-center justify-center gap-4 w-full h-[50vh] bg-[#FEC500] shadow-md shadow-[#656565]'>
            <h1 className='font-semibold text-5xl'>Thank You For Your Order!</h1>
            <IoCheckmarkCircleOutline className='text-black text-8xl' />
        </div>
        <div className='flex flex-col p-8 gap-4 w-full bg-[#fff] shadow-md shadow-[#656565]'>
            <div className='rounded-md border-[1px] border-[#dadada] bg-red-200'>
                <div className='p-6 bg-[#f1f1f1]'>
                    <h1 className='font-medium text-lg'>Thank you, Your Order has been received.</h1>
                </div>
             
            </div>
        </div>
    </div>
  )
}

export default ThankuOrder