import { useNavigate } from "react-router-dom"; // Use useNavigate in place of useHistory
import ceiling from "../../assets/img/ceiling.png";
import sofa from "../../assets/img/sofa.png";
import nightstand from "../../assets/img/nightstand.png";
import bed from "../../assets/img/bed.png";
import { FaArrowRight } from "react-icons/fa";
import "../../assets/csss/category.css";
import { MdOutlineTableBar } from "react-icons/md";
import { MdTableRestaurant } from "react-icons/md";

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
          onClick={() => handleCategoryClick("livingroom")}
        >
          <div className="ceilinglight">
            <img src={sofa} alt="" />
          </div>
          <div className="appliancegroup">
            <div className="appliancegroup-title">Living Room</div>
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
          onClick={() => handleCategoryClick("studyroom")}
        >
          <div className="ceilinglight">
            <MdTableRestaurant size={30}/>
          </div>
          <div className="appliancegroup">
            <div className="appliancegroup-title">Study Room</div>
            <div>
              <FaArrowRight className="custom-arrow" />
            </div>
          </div>
        </div>

        <div
          className="appliance  cursor-pointer"
          onClick={() => handleCategoryClick("bedroom")}
        >
          <div className="ceilinglight">
            <img className="kitchen" src={bed} alt="" />
          </div>
          <div className="appliancegroup">
            <div className="appliancegroup-title">Bed Room</div>
            <div>
              <FaArrowRight className="custom-arrow" />
            </div>
          </div>
        </div>

        <div
          className="appliance  cursor-pointer"
          onClick={() => handleCategoryClick("table")}
        >
          <div className="ceilinglight">
          <MdOutlineTableBar size={30}/>
          </div>
          <div className="appliancegroup">
            <div className="appliancegroup-title">Table</div>
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
