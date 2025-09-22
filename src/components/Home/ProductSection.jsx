import React, { useState } from "react";
import { Link } from "react-router-dom";

const ProductSection = ({ products }) => {
    const [visibleProducts, setVisibleProducts] = useState(8); // Show first 8 products initially

    const loadMore = () => {
        setVisibleProducts(prev => prev + 4); // Load 4 more products each time
    };

    return (
        <div data-aos="fade-left" data-duration="1000" data-aos-once="true" className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.slice(0, visibleProducts).map((product) => (
                    <div key={product.gundam_id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                        <div className="relative h-48 overflow-hidden group">
                            <img 
                                src={product.primary_image_url} 
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            {/* Optional: Add a quick view button on hover */}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <Link 
                                    to={`/product/${product.slug}`}
                                    className="px-4 py-2 bg-white text-blue-600 font-medium rounded hover:bg-blue-600 hover:text-white transition-colors"
                                >
                                    Xem nhanh
                                </Link>
                            </div>
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                            <h3 className="text-lg font-semibold mb-2 line-clamp-2">{product.name}</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-2">{product.series}</p>
                            <div className="mt-auto">
                                <p className="text-gray-800 dark:text-white font-bold text-lg mb-3">{product.price} VNĐ</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {product.grade} | {product.scale}
                                    </span>
                                    <Link 
                                        to={`/product/${product.slug}`}
                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                                    >
                                        xem chi tiết
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* View More button - only shows if there are more products to show */}
            {visibleProducts < products.length && (
                <div className="text-center mt-8">
                    <button
                        onClick={loadMore}
                        className="px-6 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                        xem thêm
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductSection;