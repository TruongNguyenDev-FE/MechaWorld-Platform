import React from "react";

// Lazy load các pages

// Layout
export const UserLayout = React.lazy(() => import('../pages/UserLayout'));
export const ModeratorLayout = React.lazy(() => import('../pages/ModeratorLayout'));
export const AdminLayout = React.lazy(() => import("../pages/AdminLayout"));

// Navigation Bar route
export const HomePage = React.lazy(() => import('../pages/HomePage'));
export const ProductPage = React.lazy(() => import('../components/Product/Product'));
export const ExchangePage = React.lazy(() => import('../components/Exchange/Exchange'));


// SignIn & SignUp - Authentication route
export const SignIn = React.lazy(() => import("../components/Login/SignIn"));
export const SignUp = React.lazy(() => import("../components/Login/SignUp"));

// Notification
export const NotificationPage = React.lazy(() => import("../components/Notification/index"));

// Product Detail Page route
export const ProductDetailPage = React.lazy(() => import('../components/ProductDetail/ProductDetail'));


// Cart route
export const CartPage1 = React.lazy(() => import('../components/Cart/Carts'));


// Checkout route
export const Checkout = React.lazy(() => import('../components/Checkout/checkout'));


// wallet route
export const WalletPage = React.lazy(() => import('../components/Wallet/WalletUser'));


// Member Profile route
export const ProfilePage = React.lazy(() => import("../components/Profile/UserManagement/Profiles"));
export const UserProfile = React.lazy(() => import("../components/Profile/UserManagement/UserProfile"));
export const SettingAddress = React.lazy(() => import("../components/Profile/UserManagement/SettingAddress"));
export const AuctionParticipation = React.lazy(() => import("../components/Profile/UserManagement/AuctionParticipation"));
export const OrderHistory = React.lazy(() => import("../components/Profile/OrderManagement/OrderHistory"));
export const OrderExchange = React.lazy(() => import("../components/Profile/OrderManagement/OrderExchange"));

// Register Shop route
export const ShopRegister = React.lazy(() => import("../components/RegisterShop/RegisterShop"));
export const RegisterShopLayout = React.lazy(() => import("../components/RegisterShop/RegisterShopLayout"));

// Shop route
export const ShopDashboard = React.lazy(() => import("../components/Shop/Dashboard/ShopDashboard"));
export const ShopAddress = React.lazy(() => import("../components/Shop/ShopAddress"));
export const ShopProductManagement = React.lazy(() => import("../components/Shop/ProductManagement/ShopProductManagement"));
export const ShopPage = React.lazy(() => import("../components/Shop/ShopPage"));
export const ShopTransaction = React.lazy(() => import("../components/Shop/ShopTransaction"));
export const ShopAuctionManagement = React.lazy(() => import("../components/Shop/AuctionManagement/ShopAuctionManagement"));
export const ShopOrderManagement = React.lazy(() => import("../components/Shop/OrderManagement/ShopOrderManagement"));
export const ShopReportManagement = React.lazy(() => import("../components/Shop/ShopReportManagement"));
export const Subscription = React.lazy(() => import("../components/Shop/Subscription"));



// Exchange Route
export const ExchangeList = React.lazy(() => import("../components/Exchange/ExchangeHome/ExchangeList"));
export const ExchangeManage = React.lazy(() => import("../components/Exchange/ExchangeManage/ExchangeManage"));
export const ExchangeMyPost = React.lazy(() => import("../components/Exchange/ExchangeManageMyPost/ExchangeMyPost"));

export const ExchangeDetailInformation = React.lazy(() => import("../components/Exchange/ExchangeDetailInformation"));
export const ExchangeGundamManagement = React.lazy(() => import("../components/Exchange/ExchangeGundamManagement"));

// Auction route
export const AuctionList = React.lazy(() => import("../components/Aution/User/AutionList"));
export const AuctionDetail = React.lazy(() => import("../components/Aution/User/AutionDetail"));

// Collection route
export const GundamCollectionApp = React.lazy(() => import("../components/Collection/Collection"));
export const CollectionContainer = React.lazy(() => import("../components/Collection/CollectionContainer"));
export const AddCollection = React.lazy(() => import("../components/Collection/AddNewGundam/AddCollection"));


// Moderator route
export const ModDashboard = React.lazy(() => import("../components/Moderator/Dashboard/Dashboard"));
export const ModUsers = React.lazy(() => import("../components/Moderator/UserManagement/ModUsers"));
export const ModOrders = React.lazy(() => import("../components/Moderator/OrderManagement/ModOrders"));
export const ModAuctions = React.lazy(() => import("../components/Moderator/AuctionManagement/ModAuctions"));
export const ModExchanges = React.lazy(() => import("../components/Moderator/ExchangeManagement/ModExchanges"));
export const ModTransactions = React.lazy(() => import("../components/Moderator/TransactionManagement/ModTransactions"));


// Admin route
export const AdminDashboard = React.lazy(() => import("../components/Admin/AdminDashboard"));


// 404 page route
export const PageNotFound = React.lazy(() => import("../components/Errors/PageNotFound"));


