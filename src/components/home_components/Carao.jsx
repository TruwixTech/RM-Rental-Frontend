import "../../assets/csss/Carao.css";
import "bootstrap/dist/css/bootstrap.min.css";
import guy1 from "../../assets/img/guy1.png";
import guy2 from "../../assets/img/guy2.png";
import guy3 from "../../assets/img/guy3.png";
import guy4 from "../../assets/img/guy4.png";
import guy5 from "../../assets/img/guy5.png";

const data = [
  {
    name: "Pawan Kandpal",
    review: "Services are good and flexible with the monthly rents, as i experienced. Thanks RM Furniture to help me during emergency. 🙏",
    rating: 5,
    title: "", // if needed
    image: guy1, // add image path if needed
  },
  {
    name: "Divyanshi Tyagi",
    review: "Awesome service Have rented a fridge from them for few months, the rent was reasonable and condition of fridge was good",
    rating: 5,
    title: "", // if needed
    image: guy2, // add image path if needed
  },
  {
    name: "Risabh Agarwal",
    review: "Good furniture and very good services post delivery. Very kind and polite behaviour",
    rating: 5,
    title: "", // if needed
    image: guy3, // add image path if needed
  },
  {
    name: "Ishika Sisodia",
    review: "Great products, Hassle-free service. Amazing experience with RM furniture",
    rating: 5,
    title: "", // if needed
    image: guy4, // add image path if needed
  },
  {
    name: "Ravneet punia",
    review: "Best place to rent your furniture. I rented my furniture with just 1 call, but best part was when i returned. On just 1 call I gave them time to pack up the furniture, they themselves brought their teams and vans to pack up. Within 2 hrs ",
    rating: 5,
    title: "", // if needed
    image: guy5, // add image path if needed
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
                       <img src={item.image} alt={item.name} />
                    </div>

                    <div className="card-cont-review-cont  min-h-[150px]">
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
