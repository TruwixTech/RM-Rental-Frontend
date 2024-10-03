import React from 'react'
import { Link } from 'react-router-dom'

const Cart = () => {
  return (
    <div className='cart w-full flex flex-col gap-3 py-3 items-center bg-[#f6f6f6]'>
        <div className="cart-top flex items-center justify-around w-1/2 px-10 py-3 rounded-full bg-white shadow-md shadow-[#838383]">
        <div className='flex items-center gap-3 px-4'>
            <div className='flex items-center justify-center text-xs font-semibold w-8 h-8 rounded-full bg-[#FFD74D]'>1</div>
        <Link className='font-semibold'>Cart</Link>
        </div>
        <div className='flex items-center gap-3 px-4'>
            <div className='flex items-center justify-center text-xs font-semibold w-8 h-8 rounded-full bg-[#ebeef6]'>2</div>
        <Link className='font-semibold' >Address</Link>
        </div>
        <div className='flex items-center gap-3 px-4'>
            <div className='flex items-center justify-center text-xs font-semibold w-8 h-8 rounded-full bg-[#ebeef6]'>3</div>
        <Link className='font-semibold text-gray-400' >Payment</Link>
        </div>
       
      
        </div>
         <div className="cart-btm flex justify-between w-full py-10 bg-red-300 px-10">
<div className="cart-btm-left flex flex-col gap-3 py-4 px-4 items-center w-[48%] min-h-[100vh] bg-[#dadada]">
    <div className='flex justify-between items-center w-full py-3 px-4 bg-white shadow-md shadow-[#838383] rounded-xl'>
        <div className=''>
            <h1 className='overflow-hidden font-medium text-gray-400'>Deliver to : <span className='font-semibold text-black'>Shubham, 110063</span></h1>
            <p className='text-xs text-gray-400'>246 Punjabi Bagh, Club road, New Delhi</p>
        </div>
        <Link className='px-8 py-2 bg-[#FFD74D] text-black font-semibold rounded-lg'>CHANGE ADDRESS</Link>
    </div>
    <div className="current-order w-full">
      <div className=''>
        <h1 className='text-lg font-semibold'>Current Order</h1>
        <p className='text-xs text-gray-400'>The sum of all total payments for goods there</p>
        </div>   
        <div className="my-orders p-2 w-full bg-red-400">
            <div>
                <div className='w-28 h-28 bg-gray-600'></div>
                <div>
                    <h1>NeveStrix Pro L123 (2021) - <br />TP399K 1TB</h1>
                    p
                </div>
            </div>
            </div>  
    </div>
</div>
<div className="cart-btm-right w-[48%] min-h-[100vh] bg-yellow-400"></div>
         </div>
    </div>
  )
}

export default Cart