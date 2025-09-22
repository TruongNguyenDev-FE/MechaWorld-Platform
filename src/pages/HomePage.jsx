import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import Hero from "../components/Home/Hero/Hero";
import CategoryList from "../components/Home/Category/Category";
import ProductSection from "../components/Home/ProductSection";
import ExchangeSection from "../components/Home/ExchangeSection";
import AuctionSection from "../components/Home/AuctionSection";

import { GetListAuction } from "../apis/Auction/APIAuction";
import { getAllExchangePost } from "../apis/Exchange/APIExchange";
import { GetGundams } from "../apis/Gundams/APIGundam";

const HomePage = () => {
    const [orderPopup, setOrderPopup] = useState(false);
    const [products, setProducts] = useState([]);
    const [exchanges, setExchanges] = useState([]);
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState({
        products: true,
        exchanges: true,
        auctions: true
    });
    const [error, setError] = useState({
        products: null,
        exchanges: null,
        auctions: null
    });

    const handleOrderPopup = () => {
        setOrderPopup(!orderPopup);
    };

    useEffect(() => {
        AOS.init({
            offset: 100,
            duration: 800,
            easing: "ease-in-sine",
            delay: 100,
        });
        AOS.refresh();

        // Fetch products
        const fetchProducts = async () => {
            try {
                const response = await GetGundams();
                setProducts(response.data);
                setLoading(prev => ({...prev, products: false}));
            } catch (err) {
                setError(prev => ({...prev, products: err.message}));
                setLoading(prev => ({...prev, products: false}));
            }
        };

        // Fetch exchanges
        const fetchExchanges = async () => {
            try {
                const response = await getAllExchangePost();
                setExchanges(response.data);
                setLoading(prev => ({...prev, exchanges: false}));
            } catch (err) {
                setError(prev => ({...prev, exchanges: err.message}));
                setLoading(prev => ({...prev, exchanges: false}));
            }
        };

        // Fetch auctions
        const fetchAuctions = async () => {
            try {
                const response = await GetListAuction();
                setAuctions(response.data);
                setLoading(prev => ({...prev, auctions: false}));
            } catch (err) {
                setError(prev => ({...prev, auctions: err.message}));
                setLoading(prev => ({...prev, auctions: false}));
            }
        };

        fetchProducts();
        fetchExchanges();
        fetchAuctions();
    }, []);

    return (
        <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
            <Hero handleOrderPopup={handleOrderPopup} />
            
            
            {/* Products Section */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <h2 data-aos="fade-down" data-duration="1000" data-aos-once="true" className="text-3xl font-bold mb-8 text-center">Sản phẩm GunDam</h2>
                    {loading.products ? (
                        <div className="text-center">Loading products...</div>
                    ) : error.products ? (
                        <div className="text-center text-red-500">Error: {error.products}</div>
                    ) : (
                        <ProductSection products={products} />
                    )}
                </div>
            </section>

            {/* Exchange Section */}
            <section className="py-12 bg-gray-100 dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <h2 data-aos="fade-down" data-duration="1000" data-aos-once="true" className="text-3xl font-bold mb-8 text-center">Trao đổi Gundam</h2>
                    {loading.exchanges ? (
                        <div className="text-center">Loading exchanges...</div>
                    ) : error.exchanges ? (
                        <div className="text-center text-red-500">Error: {error.exchanges}</div>
                    ) : (
                        <ExchangeSection exchanges={exchanges} />
                    )}
                </div>
            </section>

            {/* Auction Section */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <h2 data-aos="fade-down" data-duration="1000" data-aos-once="true" className="text-3xl font-bold mb-8 text-center">Đấu giá Gundam</h2>
                    {loading.auctions ? (
                        <div className="text-center">Loading auctions...</div>
                    ) : error.auctions ? (
                        <div className="text-center text-red-500">Error: {error.auctions}</div>
                    ) : (
                        <AuctionSection auctions={auctions} />
                    )}
                </div>
            </section>
        </div>
    );
};

export default HomePage;