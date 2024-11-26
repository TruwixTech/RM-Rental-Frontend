import { Link } from "react-router-dom";

const SearchProductItem = ({ product }) => {
  return (
    <Link
      to={`/product/${product?.id}`}
      className="flex items-center bg-gray-100 py-2 px-4 cursor-pointer"
    >
      <div className="flex space-x-3 items-center">
        <div className="flex flex-col items-start">
          <span className=" text-sm font-semibold">{product?.title}</span>
        </div>
      </div>
    </Link>
  );
};

export default SearchProductItem;
