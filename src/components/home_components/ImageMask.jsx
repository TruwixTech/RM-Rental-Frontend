import React from 'react';
import '../../assets/csss/ImageMask.css'; 
import sofaimage from '../../assets/img/banner.png';
import fullbanner from '../../assets/img/bannerfull.jpeg'
import 'remixicon/fonts/remixicon.css';

const ImageMask = () => {
    return (
        <div>

        <div className="container1">
         
            <div className='banner-img'>

            <img
                className="clip-mask"
                src={sofaimage}
                alt="Decorative"
            />
            </div>
            
            {/* Content Overlay */}
            <div className="content">
                <div className='content-up'>
                    <div className='btn'>
                        <button>
                            <div className='dot'></div>
                            <div className='dot1'>Rent</div>
                        </button>
                        <button><div className='dot'></div><div className='dot1'>Purchase</div></button>
                        <button><div className='dot'></div><div className='dot1'>Interior</div></button>
                    </div>
                    <div className="upper">
                    <h2>Elevating your home with <span>uniquely fascinating <span style={{color : "#FFD74D"}}>furniture.</span></span></h2>                        <div className='upper-sep'></div>
                        <div className='Subtitle'>Discover, Explore, Inspire: Fascinate Your World</div>
                    </div>
                </div>
                <div className="lower">
                <h2>Rent the perfect furniture for your home to elevate your living space.</h2>
                                    <div className='lower-circle'>
                        <i className="ri-arrow-right-down-line"></i>
                    </div>
                </div>
            </div>
        </div>

        <div className='fullbanner'>
            <div className='fullbanner-upper'>
           
            <h2>Elevating your home with <span>uniquely fascinating <span style={{color : "#FFD74D"}}>furniture.</span></span></h2>            <div className='fullbanner-subtitle'>Discover, Explore, Inspire: Fascinate Your World</div>
            <div className='fullbanner-btn'>
                        <button>
                            <div className='dot'></div>
                            <div className='dot1'>Rent</div>
                        </button>
                        <button><div className='dot'></div><div className='dot1'>Purchase</div></button>
                        <button><div className='dot'></div><div className='dot1'>Interior</div></button>
                    </div>
            </div>
            <div className='fullbanner-img'><img src={fullbanner} alt="" /></div>
            <div className="fullbanner-lower">
            <h2>Rent the perfect furniture for your home to elevate your living space.</h2>
                </div>
        </div>
        </div>
    );
};

export default ImageMask;