

import React, { useRef, useEffect } from 'react';
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
    <div>
      <div id="textslide" ref={textSlideRef}>
        <div className="elem">
          <h3>
            STYLE <span>INTERIOR</span> IN <span>STYLE</span>
          </h3>
        </div>
        <div className="elem">
          <h3>
            STYLE <span>INTERIOR</span> IN <span>STYLE</span>
          </h3>
        </div>
       
        <div className="elem">
          <h3>
            STYLE <span>INTERIOR</span> IN <span>STYLE</span>
          </h3>
        </div>
        <div className="elem">
          <h3>
            STYLE <span>INTERIOR</span> IN <span>STYLE</span>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Textslider;
