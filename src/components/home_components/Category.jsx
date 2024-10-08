import { useNavigate } from "react-router-dom"; // Use useNavigate in place of useHistory
import ceiling from "../../assets/img/ceiling.png";
import sofa from "../../assets/img/sofa.png";
import kitchen from "../../assets/img/kitchen.png";
import nightstand from "../../assets/img/nightstand.png";
import toilet from "../../assets/img/toilet.png";
import bed from "../../assets/img/bed.png";
import { FaArrowRight } from "react-icons/fa";
import "../../assets/csss/category.css";

const Categories = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleCategoryClick = (category) => {
    navigate("/products", {
      state: { selectedCategory: category }, // Pass category as state
    });
  };

  return (
    <div className="cat-container">
      <div className="categories">
        <div
          className="appliance cursor-pointer"
          onClick={() => handleCategoryClick("appliance")}
        >
          <div className="ceilinglight">
            <img src={ceiling} alt="" />
          </div>
          <div className="appliancegroup">
            <div className="appliancegroup-title">Appliance</div>
            <div>
              <FaArrowRight className="custom-arrow" />
            </div>
          </div>
        </div>

        <div
          className="appliance  cursor-pointer"
          onClick={() => handleCategoryClick("sofa")}
        >
          <div className="ceilinglight">
            <img src={sofa} alt="" />
          </div>
          <div className="appliancegroup">
            <div className="appliancegroup-title">Sofa</div>
            <div>
              <FaArrowRight className="custom-arrow" />
            </div>
          </div>
        </div>

        <div
          className="appliance  cursor-pointer"
          onClick={() => handleCategoryClick("kitchen")}
        >
          <div className="ceilinglight">
            <img className="kitchen" src={kitchen} alt="" />
          </div>
          <div className="appliancegroup">
            <div className="appliancegroup-title">Kitchen</div>
            <div>
              <FaArrowRight className="custom-arrow" />
            </div>
          </div>
        </div>

        <div
          className="appliance  cursor-pointer"
          onClick={() => handleCategoryClick("storage")}
        >
          <div className="ceilinglight">
            <img className="kitchen" src={nightstand} alt="" />
          </div>
          <div className="appliancegroup">
            <div className="appliancegroup-title">Storage</div>
            <div>
              <FaArrowRight className="custom-arrow" />
            </div>
          </div>
        </div>

        <div
          className="appliance  cursor-pointer"
          onClick={() => handleCategoryClick("bed")}
        >
          <div className="ceilinglight">
            <img className="kitchen" src={bed} alt="" />
          </div>
          <div className="appliancegroup">
            <div className="appliancegroup-title">Bed</div>
            <div>
              <FaArrowRight className="custom-arrow" />
            </div>
          </div>
        </div>

        <div
          className="appliance  cursor-pointer"
          onClick={() => handleCategoryClick("bath")}
        >
          <div className="ceilinglight">
            <img className="kitchen" src={toilet} alt="" />
          </div>
          <div className="appliancegroup">
            <div className="appliancegroup-title">Bath</div>
            <div>
              <FaArrowRight className="custom-arrow" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
