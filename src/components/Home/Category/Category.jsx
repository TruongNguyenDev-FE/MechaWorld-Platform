import { Link } from "react-router-dom";

const categories = [
    { name: "Tất Cả Sản Phẩm", image: "/src/assets/image/category/all-gundam.png", link: "#" },
    { name: "EG Gundam", image: "/src/assets/image/category/eg-gundam.png", link: "#" },
    { name: "HG Gundam", image: "/src/assets/image/category/hg-gundam.png", link: "#" },
    { name: "MG Gundam", image: "/src/assets/image/category/mg-gundam.png", link: "#" },
    { name: "PG Gundam", image: "/src/assets/image/category/pg-gundam.png", link: "#" },
    { name: "RG Gundam", image: "/src/assets/image/category/rg-gundam.png", link: "#" },
    { name: "SD Gundam", image: "/src/assets/image/category/sd-gundam.png", link: "#" },

];

const CategoryList = () => {
    return (
        <div className="container p-4 my-14">
            <div className="category-section">
                <h2 className="text-2xl font-bold mb-6 uppercase text-center">DANH MỤC NỔI BẬT</h2>
                <div className="flex flex-wrap justify-evenly gap-4">
                    {categories.map((category, index) => (
                        <Link key={index} to={category.link} className="flex flex-col items-center cursor-pointer transition duration-300 hover:scale-105">
                            <div className="w-20 h-20 bg-white shadow-md rounded-full overflow-hidden flex justify-center items-center border-2 border-gray-300">
                                <img alt={category.name} src={category.image} className="w-3/4 h-3/4 object-contain" />
                            </div>
                            <p className="text-center text-sm font-medium mt-2 w-24">{category.name}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryList;
