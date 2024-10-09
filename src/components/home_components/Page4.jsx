import productimg from "../../assets/img/productImg.jpg"; // Update to the refrigerator image
import "../../assets/csss/Page4.css";
import { Link } from "react-router-dom";

const Page4 = () => {
  return (
    <div className="page4">
      <div className="page4-left">
        <img src={productimg} alt="Refrigerator" />
      </div>
      <div className="page4-right">
        <h1>Modern Refrigerator with Smart Features</h1>
        <p>
          Experience the perfect blend of style and functionality with our
          latest refrigerator model. It offers energy efficiency, spacious
          storage, and advanced cooling technology for all your food
          preservation needs.
        </p>
        <div className="page4-right-group">
          <div className="page4-right-group-contain">
            <span>Materials</span>
            <p>Stainless Steel, Tempered Glass Shelves, BPA-Free Plastics</p>
          </div>
          <div className="page4-right-group-contain">
            <span>Product Size</span>
            <p>70 cm x 180 cm x 70 cm</p>
          </div>
          <div className="page4-right-group-contain">
            <span>Available In</span>
            <p>Silver, Black, White, and Custom Colors</p>
          </div>
        </div>
        <Link to={`/product/6706454bfdad55b1d313a1dc`}>
          <button>Shop Now</button>
        </Link>
      </div>
    </div>
  );
};

export default Page4;
