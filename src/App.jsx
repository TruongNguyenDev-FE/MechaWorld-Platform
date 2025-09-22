import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";



// import router
import {
  HomePage,
  ProductPage,
  SignIn,
  ProfilePage,
  UserProfile,
  OrderHistory,
  UserLayout,
  ProductDetailPage,
  ShopDashboard, ShopPage,
  ShopProductManagement,
  ShopTransaction, ExchangePage,
  CartPage1,
  Checkout,
  WalletPage,
  SettingAddress,
  ShopOrderManagement,
  ShopAuctionManagement,
  ShopReportManagement,
  Subscription,
  ShopRegister,
  RegisterShopLayout,
  AuctionList,
  ModeratorLayout,
  SignUp,
  ModAuctions,
  ModOrders,
  ModTransactions,
  ModUsers,
  ModExchanges,
  ExchangeDetailInformation,
  ExchangeGundamManagement,
  AddCollection,
  ShopAddress,
  PageNotFound,
  ExchangeList,
  ExchangeManage,
  ExchangeMyPost,
  CollectionContainer,
  GundamCollectionApp,
  NotificationPage,
  ModDashboard,
  OrderExchange,
  AuctionDetail,
  AdminLayout,
  AdminDashboard,
  AuctionParticipation,
} from "./routes/router";

import { verifyToken } from "./apis/Authentication/APIAuth";
import { logout, updateUser } from "./features/auth/authSlice";

import Spinner from "./components/Spinner";
import PageLoading from "./components/PageLoading";

import { restoreDeliveryFees } from "./features/exchange/middleware/deliveryFeePersistence";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const accessToken = Cookies.get("access_token");
    if (accessToken) {
      verifyToken(accessToken).then((userData) => {
        if (userData) {
          dispatch(updateUser(userData.data));
          dispatch(restoreDeliveryFees());
        } else {
          dispatch(logout());
        }
      });
    } else {
      dispatch(logout());
    }
  }, [dispatch]);

  // Role-based route protection
  const ProtectedRoute = ({ children }) => {
    if (user?.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    if (user?.role === "moderator") {
      return <Navigate to="/moderator" replace />;
    }
    return children;
  };

  return (
    <>
      <PageLoading />
      <Suspense fallback={<Spinner />}>
        <Routes>
          {/* Main User Routes */}
          <Route path="/" element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
            <Route index element={<HomePage />} />

            {/* Product Routes */}
            <Route path="product" element={<ProductPage />} />
            <Route path="product/:slug" element={<ProductDetailPage />} />

            {/* Notification */}
            <Route path="notifications" element={<NotificationPage />} />

            {/* Auction Routes */}
            <Route path="auction" element={<AuctionList />} />
            <Route path="auction/:auctionID" element={<AuctionDetail />} />

            {/* Exchange Routes */}
            <Route path="/exchange" element={<ExchangePage />}>
              <Route path="list" element={<ExchangeList />} />
              <Route path="manage-gundam" element={<ExchangeGundamManagement />} />
              <Route index element={<ExchangeList />} />
            </Route>
            <Route path="/exchange/manage" element={<ExchangeManage />} />
            <Route path="/exchange/my-post" element={<ExchangeMyPost />} />
            <Route path="/exchange/detail/:id" element={<ExchangeDetailInformation />} />

            {/* Collection Routes */}
            <Route path="collection" element={<GundamCollectionApp />} >
              <Route path="list" element={<CollectionContainer />} />
              <Route path="add" element={<AddCollection />} />
            </Route>

            {/* Cart & Checkout */}
            <Route path="cart" element={<CartPage1 />} />
            <Route path="checkout" element={<Checkout />} />

            {/* Member Profile Routes */}
            <Route path="member/profile" element={<ProfilePage />}>
              <Route path="account" element={<UserProfile />} />
              <Route path="address-setting" element={<SettingAddress />} />
              <Route path="auction-participation" element={<AuctionParticipation />} />
              <Route path="wallet" element={<WalletPage />} />
              <Route path="orders/regular-auction" index element={<OrderHistory />} />
              <Route path="orders/exchange" element={<OrderExchange />} />
            </Route>

            {/* Shop Routes */}
            <Route path="shop" element={<ShopPage />}>
              <Route path="dashboard" element={<ShopDashboard />} />
              <Route path="address" element={<ShopAddress />} />
              <Route path="management" element={<ShopProductManagement />} />
              <Route path="transition" element={<ShopTransaction />} />
              <Route path="order-management" element={<ShopOrderManagement />} />
              <Route path="auction-management" element={<ShopAuctionManagement />} />
              <Route path="report-management" element={<ShopReportManagement />} />
              <Route path="Subscription" element={<Subscription />} />
            </Route>

            {/* Error Routes */}
            <Route path="error" element={<PageNotFound />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>

          {/* Authentication Routes */}
          <Route path="member">
            <Route path="login" index element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
          </Route>

          {/* Shop Registration */}
          <Route path="register-shop" element={<RegisterShopLayout />}>
            <Route index element={<ShopRegister />} />
          </Route>

          {/* Moderator Routes */}
          <Route path="moderator" element={<ModeratorLayout />} >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ModDashboard />} />
            <Route path="user-management" element={<ModUsers />} />
            <Route path="order-management" element={<ModOrders />} />
            <Route path="exchange-management" element={<ModExchanges />} />
            <Route path="auction-management" element={<ModAuctions />} />
            <Route path="transaction-management" element={<ModTransactions />} />
          </Route>

          {/* Admin Routes */}
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;