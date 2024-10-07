import "../../assets/csss/Carao.css";
import "bootstrap/dist/css/bootstrap.min.css";

const data = [
  {
    name: "Priya Kumar",
    review: "Needed last-minute furniture, and RM Rental delivered fast! Super convenient and friendly service. Highly recommend!",
    rating: 5,
    title: "", // if needed
    image: "", // add image path if needed
  },
  {
    name: "Vikram Aggarwal",
    review: "RM Rental offered flexible options for my office. Great quality furniture and professional service. Will use again!",
    rating: 5,
    title: "", // if needed
    image: "", // add image path if needed
  },
  {
    name: "Sneha Punia",
    review: "Affordable and stylish furniture with flexible rental options. RM Rental made furnishing my home simple and stress-free!",
    rating: 5,
    title: "", // if needed
    image: "", // add image path if needed
  },
  {
    name: "Megha Singh",
    review: "RM Rental’s customer service was amazing. They answered all my questions quickly and helped me choose the right furniture. Great experience!",
    rating: 5,
    title: "", // if needed
    image: "", // add image path if needed
  },
  {
    name: "Aditi Bhat",
    review: "I’ve used RM Rental for both my home and office. Every time, they delivered on time with top-notch furniture. Will keep coming back!",
    rating: 5,
    title: "", // if needed
    image: "", // add image path if needed
  },
  
];

const Carao = () => {
  return (
    <div>
      <div className="container testimonialCarousel carao-main-con ">
        <h1 className="text-center acme-regular p-5 carao-h1-title">
          Our Testimonials
        </h1>
        <div id="testimonialCarousel" className="carousel">
          <div className="carousel-inner overflow-x-auto custom-scrollbar">
            {data.map((item, index) => (
              <div
                className={`carousel-item ${index === 0 ? "active" : ""}`}
                key={index}
              >
                <div className="card-cont">
                  <div className="Testimonial-Content-Container ">
                    <div className="Reviewer-Image-Container">
                      {item.image && <img src={item.image} alt={item.name} />}
                    </div>

                    <div className="card-cont-review-cont  min-h-[120px]">
                      <div className="Reviewer-Info-Container">
                        <div className="text-sm">{item.name}</div>
                        {item.title && (
                          <div className="Reviewer-Title">{item.title}</div>
                        )}
                        <div className="text-sm text-yellow-400">
                          {"★".repeat(item.rating)}
                        </div>
                      </div>
                      <div className="text-sm text-justify ">{item.review}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carao;
