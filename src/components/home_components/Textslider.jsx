

import { useRef, useEffect } from 'react';
import '../../assets/csss/Textslider.css';

const Textslider = () => {
  const textSlideRef = useRef(null);

  useEffect(() => {
    const textSlide = textSlideRef.current;
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollWidth = textSlide.scrollWidth *8
      
      textSlide.style.transform = `translateX(${-scrollPosition}px)`;

      if (scrollPosition >= scrollWidth) {
        window.scrollTo({ top: 0 });
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="">
      <div id="textslide" ref={textSlideRef}>
        <div className="elem">
          <h3>
            FAST <span>SERVICE</span> FAST<span>DELIVERY</span>
          </h3>
        </div>
        <div className="elem">
          <h3>
            FAST <span>RETURN</span> FAST <span>SERVICE</span>
          </h3>
        </div>
        
        <div className="elem">
          <h3>
            FAST <span>SERVICE</span> FAST<span>DELIVERY</span>
          </h3>
        </div>
        <div className="elem">
          <h3>
            FAST <span>SERVICE</span> FAST<span>DELIVERY</span>
          </h3>
        </div>
        <div className="elem">
          <h3>
            FAST <span>RETURN</span> FAST <span>SERVICE</span>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Textslider;
