import { FaStar } from "react-icons/fa6";

import Img1 from "../../../assets/image/gun1.jpg";
import Img2 from "../../../assets/image/gun2.jpg";
import Img3 from "../../../assets/image/gun3.jpg";
import Img4 from "../../../assets/image/gun4.jpg";
import Img5 from "../../../assets/image/gun5.jpg";
import Img6 from "../../../assets/image/gun6.jpg";
import Img7 from "../../../assets/image/gun7.jpg";
import Img8 from "../../../assets/image/gun8.jpg";
import Img9 from "../../../assets/image/gun9.jpg";
import Img10 from "../../../assets/image/gun10.jpg";

const ProductsData = [
  {
    id: 1,
    img: Img1,
    title: "Unicorn",
    rating: 5.0,
    price: "200.000vnd",
    aosDelay: "0",
  },
  {
    id: 2,
    img: Img2,
    title: "Gundam Exia",
    rating: 4.5,
    price: "200.000vnd",
    aosDelay: "200",
  },
  {
    id: 3,
    img: Img3,
    title: "Gundam RX-78-2",
    rating: 4.7,
    price: "200.000vnd",
    aosDelay: "400",
  },
  {
    id: 4,
    img: Img4,
    title: "Gundam Aerial",
    rating: 4.4,
    price: "200.000vnd",
    aosDelay: "600",
  },
  {
    id: 5,
    img: Img5,
    title: "Gundam Pharact HG",
    rating: 4.5,
    price: "200.000vnd",
    aosDelay: "800",
  },
  {
    id: 6,
    img: Img6,
    title: "Gundam Michaelis HG",
    rating: 5.0,
    price: "200.000vnd",
    aosDelay: "0",
  },
  {
    id: 7,
    img: Img7,
    title: "Gundam Schwarzette",
    rating: 4.5,
    price: "200.000vnd",
    aosDelay: "200",
  },
  {
    id: 8,
    img: Img8,
    title: "Gundam Calibarn HG",
    rating: 4.7,
    price: "200.000vnd",
    aosDelay: "400",
  },
  {
    id: 9,
    img: Img9,
    title: "Gundam Lfrith HG",
    rating: 4.4,
    price: "200.000vnd",
    aosDelay: "600",
  },
  {
    id: 10,
    img: Img10,
    title: "Bandai HGUC RGM-79",
    rating: 4.5,
    price: "200.000vnd",
    aosDelay: "800",
  },
];

const Products = () => {
  return (
    <div className="my-14">
      <div className="container">
        {/* Header section */}
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <h1 className="text-2xl font-bold mb-6 uppercase text-center">
            Sản phẩm bán chạy
          </h1>
          <p className="text-xs text-gray-400">
           Top Gundam được ưa thích nhất
          </p>
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

export default Products;
