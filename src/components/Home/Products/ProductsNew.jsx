import { FaStar } from "react-icons/fa6";

import Img1 from "../../../assets/image/gun1.jpg";
import Img2 from "../../../assets/image/gun2.jpg";
import Img3 from "../../../assets/image/gun3.jpg";
import Img4 from "../../../assets/image/gun4.jpg";

const ProductsData = [
  {
    id: 1,
    img: Img1,
    title: "Women Ethnic",
    rating: 5.0,
    price: "125.000vnd",
    aosDelay: "0",
  },
  {
    id: 2,
    img: Img2,
    title: "Women western",
    rating: 4.5,
    price: "125.000vnd",
    aosDelay: "200",
  },
  {
    id: 3,
    img: Img3,
    title: "Goggles",
    rating: 4.7,
    price: "125.000vnd",
    aosDelay: "400",
  },
  {
    id: 4,
    img: Img4,
    title: "Printed T-Shirt",
    rating: 4.4,
    price: "125.000vnd",
    aosDelay: "600",
  },
  {
    id: 5,
    img: Img2,
    title: "Fashin T-Shirt",
    rating: 4.5,
    price: "125.000vnd",
    aosDelay: "800",
  },
];

const ProductsNew = () => {
  return (
    <div className="my-14">
      <div className="container">
        {/* Header section */}
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <h1 className="text-2xl font-bold mb-6 uppercase text-center">
            Sản phẩm mới
          </h1>
          {/* <p data-aos="fade-up" data-aos-once="true" className="text-xs text-gray-400">
            Những sản phẩm Gundam mới nhất
          </p> */}
        </div>
        {/* Body section */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-5">
            {/* card section */}
            {ProductsData.map((data) => (
              <div
                data-aos="fade-up"
                data-aos-once="true"
                data-aos-delay={data.aosDelay}
                key={data.id}
                className="space-y-3 overflow-hidden rounded-sm"
              >
                <img
                  src={data.img}
                  alt=""
                  className="h-[220px] w-[200px] object-cover rounded-md cursor-pointer transform transition-transform duration-500 hover:scale-110"
                />
                <div>
                  <h3 className="font-semibold">{data.title}</h3>
                  <p className="text-sm font-semibold text-red-600">{data.price}</p>
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    <span>{data.rating}</span>
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

export default ProductsNew;
