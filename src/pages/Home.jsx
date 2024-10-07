import ImageMask from "../components/home_components/ImageMask";
import Textslider from "../components/home_components/Textslider";
import Category from "../components/home_components/Category";
import Rent from "../components/home_components/Rent";
import Page4 from "../components/home_components/Page4";
import Chairs from "../components/home_components/Chairs";
import Page6 from "../components/home_components/Page6";
import Carao from "../components/home_components/Carao";

import "../assets/csss/Home.css";

const Home = () => {
  return (
    <div>
      <div className="home1">
        <ImageMask />
        <Category />
      </div>
      <Textslider />
      <div className="fullrent">
        <Rent />
      </div>
      <Page4 />
      <div className="fullchair">
        <Chairs />
      </div>
      <Page6 />

      <div className="fullcarao">
        <Carao />
      </div>
    </div>
  );
};

export default Home;
