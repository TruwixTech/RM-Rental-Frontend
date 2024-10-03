import React from 'react'
import productimg from '../../assets/img/Productimg.png'
import '../../assets/csss/Page4.css'

const Page4 = () => {
  return (
    <div className='page4'>
    <div className='page4-left'>
        <img src={productimg} alt="" />
    </div>
    <div className='page4-right'>
        <h1>Crafted With Excelent Wood</h1>
        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque  laudantium, totam rem aperiam</p>
        <div className='page4-right-group'>
            <div className='page4-right-group-contain'>
            <span>Materials</span>
            <p>Naturals wood, 100% Cotton, Poluyutherine Fabric</p>
            </div>
            <div className='page4-right-group-contain'>
                <span>Products size</span>
                <p>60 cm x 168 cm x 22 cm</p>
            </div>
            <div className='page4-right-group-contain'>
                <span>Available in</span>
                <p>BlueGrey, Yellow, Red,  and Custom</p>
            </div>
        </div>
        <button>Shop Now</button>
    </div>
        
    </div>
  )
}

export default Page4