import React, { useEffect, useRef } from 'react'
import '../../assets/csss/Carao.css'
import { Carousel } from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


const Carao = () => {

    

  const carouselRef = useRef(null);
  const carouselInnerRef = useRef(null);
  const carouselControlNextRef = useRef(null);
  const carouselControlPrevRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(min-width:576px)").matches) {
      const carousel = new Carousel(carouselRef.current, {
        interval: false,
      });

      const carouselInner = carouselInnerRef.current;
      const carouselItems = carouselRef.current.querySelectorAll(".carousel-item");
      const carouselControlNext = carouselControlNextRef.current;
      const carouselControlPrev = carouselControlPrevRef.current;

      let carouselWidth = carouselInner.scrollWidth;
      let cardWidth = carouselItems[0].offsetWidth;
      let scrollPosition = 0;

      carouselControlNext.addEventListener("click", function() {
        if (scrollPosition < carouselWidth - cardWidth * 3) {
          console.log("next");
          scrollPosition += cardWidth;
          carouselInner.scrollTo({ left: scrollPosition, behavior: "smooth" });
        }
      });

      carouselControlPrev.addEventListener("click", function() {
        if (scrollPosition > 0) {
          scrollPosition -= cardWidth;
          carouselInner.scrollTo({ left: scrollPosition, behavior: "smooth" });
        }
      });
    } else {
      carouselRef.current.classList.add("slide");
    }
  }, []);


  return (
    <div>
        
    <div className="container testimonialCarousel carao-main-con">
        <h1 className="text-center acme-regular p-5 carao-h1-title">Our Testimonials</h1>
        <div ref={carouselRef} id="testimonialCarousel" className="carousel">
            <div ref={carouselInnerRef} className="carousel-inner">
                <div className="carousel-item active">

                    <div className='card-cont' >
                    <div className='Testimonial-Content-Container'>
                    
                    <div className='Reviewer-Image-Container'>
                        {/* <img src={person1} alt="" /> */}
                    </div>

                    <div className='card-cont-review-cont'>
                    <div className='Reviewer-Info-Container'>
                        <div className='Reviewer-Name'>Shruti jain</div>
                        <div className='Reviewer-Title'>CEO Mark Furniture</div>
                        <div className='Stars-Rating-Container'>★★★★★</div>
                    </div>
                    <div className='Review-Text'>"I recently rented a sofa set and dining table from RM Furniture, and I couldn't be happier with the service! The furniture was in excellent condition, and the delivery was prompt and hassle-free.</div>

                    </div>

                    </div>
                    </div>


                </div>
                <div className="carousel-item">
                <div className='card-cont' >
                    <div className='Testimonial-Content-Container'>
                    
                    <div className='Reviewer-Image-Container'>
                        {/* <img src={person1} alt="" /> */}
                    </div>

                    <div className='card-cont-review-cont'>
                    <div className='Reviewer-Info-Container'>
                        <div className='Reviewer-Name'>Shruti jain</div>
                        <div className='Reviewer-Title'>CEO Mark Furniture</div>
                        <div className='Stars-Rating-Container'>★★★★★</div>
                    </div>
                    <div className='Review-Text'>"I recently rented a sofa set and dining table from RM Furniture, and I couldn't be happier with the service! The furniture was in excellent condition, and the delivery was prompt and hassle-free.</div>

                    </div>

                    </div>
                    </div>
                </div>
                <div className="carousel-item">
                <div className='card-cont' >
                    <div className='Testimonial-Content-Container'>
                    
                    <div className='Reviewer-Image-Container'>
                        {/* <img src={person1} alt="" /> */}
                    </div>

                    <div className='card-cont-review-cont'>
                    <div className='Reviewer-Info-Container'>
                        <div className='Reviewer-Name'>Shruti jain</div>
                        <div className='Reviewer-Title'>CEO Mark Furniture</div>
                        <div className='Stars-Rating-Container'>★★★★★</div>
                    </div>
                    <div className='Review-Text'>"I recently rented a sofa set and dining table from RM Furniture, and I couldn't be happier with the service! The furniture was in excellent condition, and the delivery was prompt and hassle-free.</div>

                    </div>

                    </div>
                    </div>
                </div>
                <div className="carousel-item">
                <div className='card-cont' >
                    <div className='Testimonial-Content-Container'>
                    
                    <div className='Reviewer-Image-Container'>
                        {/* <img src={person1} alt="" /> */}
                    </div>

                    <div className='card-cont-review-cont'>
                    <div className='Reviewer-Info-Container'>
                        <div className='Reviewer-Name'>Shruti jain</div>
                        <div className='Reviewer-Title'>CEO Mark Furniture</div>
                        <div className='Stars-Rating-Container'>★★★★★</div>
                    </div>
                    <div className='Review-Text'>"I recently rented a sofa set and dining table from RM Furniture, and I couldn't be happier with the service! The furniture was in excellent condition, and the delivery was prompt and hassle-free.</div>

                    </div>

                    </div>
                    </div>
                </div>
                <div className="carousel-item">
                <div className='card-cont' >
                    <div className='Testimonial-Content-Container'>
                    
                    <div className='Reviewer-Image-Container'>
                        {/* <img src={person1} alt="" /> */}
                    </div>

                    <div className='card-cont-review-cont'>
                    <div className='Reviewer-Info-Container'>
                        <div className='Reviewer-Name'>Shruti jain</div>
                        <div className='Reviewer-Title'>CEO Mark Furniture</div>
                        <div className='Stars-Rating-Container'>★★★★★</div>
                    </div>
                    <div className='Review-Text'>"I recently rented a sofa set and dining table from RM Furniture, and I couldn't be happier with the service! The furniture was in excellent condition, and the delivery was prompt and hassle-free.</div>

                    </div>

                    </div>
                    </div>
                </div>
                <div className="carousel-item">
                <div className='card-cont' >
                    <div className='Testimonial-Content-Container'>
                    
                    <div className='Reviewer-Image-Container'>
                        {/* <img src={person1} alt="" /> */}
                    </div>

                    <div className='card-cont-review-cont'>
                    <div className='Reviewer-Info-Container'>
                        <div className='Reviewer-Name'>Shruti jain</div>
                        <div className='Reviewer-Title'>CEO Mark Furniture</div>
                        <div className='Stars-Rating-Container'>★★★★★</div>
                    </div>
                    <div className='Review-Text'>"I recently rented a sofa set and dining table from RM Furniture, and I couldn't be happier with the service! The furniture was in excellent condition, and the delivery was prompt and hassle-free.</div>

                    </div>

                    </div>
                    </div>
                </div>
            </div>
            <button ref={carouselControlPrevRef} className="carousel-control-prev" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button ref={carouselControlNextRef} className="carousel-control-next" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    </div>

    
    </div>
  )
}

export default Carao