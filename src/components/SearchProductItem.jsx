import { Link } from "react-router-dom";

const SearchProductItem = ({ product }) => {
  return (
    <Link
      to={`/product/${product?.id}`}
      className="flex items-center bg-gray-100 py-2 px-4 cursor-pointer"
    >
      <div className="flex space-x-3 items-center">
        {/* {product?.image ? (
          <img
            src={product?.image}
            alt="product"
            className="w-11 h-11 rounded-full object-cover"
          />
        ) : (
          <img src={default_profile} alt="product" className="h-10" />
        )} */}
        <div className="flex flex-col items-start">
          <span className=" text-sm font-semibold">{product?.title}</span>
        </div>
      </div>
    </Link>
  );
};

export default SearchProductItem;
