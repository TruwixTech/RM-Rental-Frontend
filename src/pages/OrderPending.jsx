import React from 'react'
import { IoIosTimer } from "react-icons/io";
import { Link } from 'react-router-dom';

const OrderPending = () => {
  return (
    <div className='order-pending order-confirm w-full flex'>
    <div className='order-confirm-left flex flex-col items-center justify-center gap-12 py-16 w-full bg-[#FEC500]'>
<IoIosTimer className='success-icon text-[12vw] text-white' />
 <div className='order-confirm-left-top overflow-hidden text-center text-white'>
<p className='text-xl'>WAIT</p>
<h1 className='text-6xl font-bold my-2'>YOUR ORDER IS PENDING</h1>
<p className='text-lg'>Please Wait! Your order will be confirmed after some time</p>
</div>
<Link className="text-[#FEC500] overflow-hidden font-semibold shadow-md shadow-[#464646] border-[1px] border-[#FEC500] bg-[#000] px-4 py-2 rounded-full">Please wait</Link>

</div>
</div>
  )
}

export default OrderPending