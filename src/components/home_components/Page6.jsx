import React from 'react'
import '../../assets/csss/Page6.css'
import subtract from '../../assets/img/Subtract.png'
import subtract2 from '../../assets/img/Subtract2.png'
import {Link} from "react-router-dom"

const Page6 = () => {
  return (
    <div className='page6'>
        <div className='page6-up mb-4'>
            <div className='page6-up-left'>
            Discover the extensive <p>services we provide for you.</p> 
            </div>
            <div className='page6-up-right'>
{/* 
            <div className='page6-up-right-date'>
                <div>/01</div>
                <div>/02</div>
                <div>/03</div>
            </div> */}
            <p>Explore Our Comprehensive Offerings</p>
            </div>
        </div>


        
        
        
        <div className='page6-down'>
            <div className='page6-down-imgcontainer-left' style={{position: "relative"}}>
                <img src={subtract} alt="" />
                <div className='int-ext-sec' style={{position: 'absolute', top: '77%', right: "10%",}}>
                 <button style={{padding: "3px 20px", borderRadius: "50px", backgroundColor: "white",border: "1px solid black"}}>• Interior</button>
                 <button style={{padding: "3px 20px", borderRadius: "50px", marginLeft: "10px", backgroundColor: "white", border: "1px solid black"}}>• Exterior</button>
                 </div>
                <div id='det-sec' style={{position: 'absolute', top: '10%', right: "15%", backgroundColor: "#fff", display: "flex", flexDirection: "column", gap: '4px', fontSize: '15px', borderRadius: "20px", padding: "8px 15px"}}>
                 <p style={{marginBottom: "0", color: "grey"}}>CHAIRS & TOOLS</p>
                 <Link style={{color: "#000"}}>Field Armchair</Link>
                 <p style={{margin: 0, color: "grey", textDecoration: "line-through"}}>£80</p>
                 <p style={{margin: "0", width: 'fit-content', borderBottom: "3px solid yellow"}}>£56</p>
                 </div>
                <div className='page6-p'>Transform. Style. Inspire.</div>
            </div>
            <div className='page6-down-imgcontainer-right' style={{position: "relative"}}>
                <img src={subtract2} alt="" />
                <div className='int-ext-sec' style={{position: 'absolute', top: '77%', left: "55%",}}>
                 <button style={{padding: "3px 20px", borderRadius: "50px", backgroundColor: "white", border: "1px solid black"}}>• Interior</button>
                 <button style={{padding: "3px 20px", borderRadius: "50px", marginLeft: "10px",backgroundColor: "white", border: "1px solid black"}}>• Exterior</button>
                 </div>
                <p className='page6-p'>Transform. Style. Inspire.</p>
            </div>
        </div>
    
    
    
    
    
    
    </div>
  )
}

export default Page6