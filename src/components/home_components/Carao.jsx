import "../../assets/csss/Carao.css";
import "bootstrap/dist/css/bootstrap.min.css";
import guy1 from "../../assets/img/guy1.png";
import guy2 from "../../assets/img/guy2.png";
import guy3 from "../../assets/img/guy3.png";
import guy4 from "../../assets/img/guy4.png";
import guy5 from "../../assets/img/guy5.png";
import Slide from "../../assets/img/threeslide1.png";
import { FaStar } from "react-icons/fa6";
import { useState } from "react";

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
    <div className="w-full h-auto flex flex-col bg-[#FAFAFA] gap-6 py-6 lg:gap-10">
      <div className="w-full h-auto flex flex-col">
        <h1 className="text-center text-3xl font-bold lg:text-4xl text-[#3E3E3E] font-satoshi">Our Customer Says</h1>
      </div>
      <div className="w-full h-auto flex px-4 gap-4 overflow-x-scroll pb-10 xl:pb-14" style={{
        scrollbarWidth: "none",
      }}>
        {
          data.map((item, index) => (
            <div key={index}
              className='min-w-full h-96 flex rounded-xl relative justify-center sm:min-w-[50vw] md:hover:min-w-[60vw] lg:hover:min-w-[50vw] 2xl:hover:min-w-[40vw] md:min-w-[40vw] lg:min-w-[30vw] xl:min-w-[25vw] 2xl:min-w-[20vw] lg:px-10 duration-1000 ease-in-out cursor-pointer shadow-xl md:hover:shadow-2xl'
              style={{
                backgroundImage: `url(${Slide})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}>
              <div className="w-[95%] absolute overflow-visible h-[280px] flex p-4 rounded-xl flex-col bg-white top-16 font-satoshi 2xl:h-[300px]">
                <div className="w-20 h-20 rounded-full bg-white absolute flex items-center justify-center -top-7 z-40">
                  <img src={item.image} alt="image" className="w-16 h-16 shadow-md shadow-yellow-200  rounded-full" />
                </div>
                <p className="text-lg mt-7">{item.name}</p>
                <div className="flex gap-1 my-3">
                  {[...Array(item.rating)].map((_, i) => (
                    <FaStar className="text-yellow-400" key={i} />
                  ))}
                </div>
                <p className="text-sm text-gray-400">{item.review}</p>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default Carao;
