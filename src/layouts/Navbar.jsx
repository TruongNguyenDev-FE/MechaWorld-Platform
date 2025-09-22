import { useState, useCallback } from "react";
import { AutoComplete, Avatar } from "antd";
import { useSelector } from "react-redux"
import { NavLink, useNavigate } from "react-router-dom";
import { SearchOutlined, ShoppingOutlined } from "@ant-design/icons";
import { debounce } from "lodash";

import UserNavbar from "./UserNavbar";
import GuestNavbar from "./GuestNavbar";
import { GetGundamsName } from "../apis/Gundams/APIGundam";

const Menu = [
  {
    id: 1,
    name: "Trang chủ",
    link: "/#",
  },
  {
    id: 2,
    name: "Đấu giá",
    link: "/auction",
  },
  {
    id: 3,
    name: "Sản phẩm Gundam",
    link: "/product",
  },
  {
    id: 4,
    name: "Trao đổi",
    link: "/exchange/list",
  },
  {
    id: 5,
    name: "Bộ Sưu Tập",
    link: "/collection/list",
  },
];

const Navbar = () => {
  const { isLoggedIn, user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  
  // Search states
  const [searchOptions, setSearchOptions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchText) => {
      if (!searchText || searchText.trim().length < 2) {
        setSearchOptions([]);
        setSearchLoading(false);
        return;
      }

      try {
        setSearchLoading(true);
        const encodedSearchText = encodeURIComponent(searchText.trim());
        const response = await GetGundamsName(encodedSearchText);
        
        if (response?.data && Array.isArray(response.data)) {
          const options = response.data.map((gundam) => ({
            value: gundam.name,
            label: (
              <div 
                className="flex items-center py-2 px-1 hover:bg-blue-50 rounded cursor-pointer"
                onClick={() => handleGundamSelect(gundam)}
              >
                <Avatar
                  src={gundam.primary_image_url || gundam.image_url}
                  size={40}
                  shape="square"
                  className="mr-3 flex-shrink-0"
                  icon={<ShoppingOutlined />}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {gundam.name}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {gundam.grade} • {gundam.scale}
                  </div>
                  {gundam.price && (
                    <div className="text-sm font-semibold text-red-600">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(gundam.price)}
                    </div>
                  )}
                </div>
              </div>
            ),
            gundam: gundam
          }));
          
          setSearchOptions(options);
        } else {
          setSearchOptions([]);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchOptions([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300),
    []
  );

  // Handle search input change
  const handleSearch = (value) => {
    setSearchValue(value);
    if (value.trim().length >= 2) {
      setSearchLoading(true);
      debouncedSearch(value);
    } else {
      setSearchOptions([]);
      setSearchLoading(false);
    }
  };

  // Handle gundam selection
  const handleGundamSelect = (gundam) => {
    navigate(`/product/${gundam.slug}`);
    setSearchValue("");
    setSearchOptions([]);
  };

  // Handle direct search (when user presses Enter)
  const handleDirectSearch = (value) => {
    if (value.trim()) {
      navigate(`/product?search=${encodeURIComponent(value.trim())}`);
      setSearchValue("");
      setSearchOptions([]);
    }
  };

  const handleCollectionClick = (e, link) => {
    if (link === "/collection/list" && !isLoggedIn) {
      e.preventDefault();
      navigate("/member/login");
    }
  };

  return (
    <div className="main-navbar fixed w-full bg-white dark:text-white shadow-md z-40 top-0 transition-all duration-300">
      {/* upper Navbar */}
      <div className="p-4 bg-blue-300">
        <div className="container flex justify-between items-center gap-10">
          <div className="flex items-center">
            <a href="#" className="font-bold hover:text-blue-700 text-2xl sm:text-3xl flex gap-2">
              MechaWorld
            </a>
          </div>

          {/* Search bar */}
          <div className="hidden md:block flex-1">
            <AutoComplete
              value={searchValue}
              options={searchOptions}
              onSearch={handleSearch}
              onSelect={(value, option) => {
                if (option.gundam) {
                  handleGundamSelect(option.gundam);
                }
              }}
              placeholder="Thử tìm kiếm một sản phẩm Gundam..."
              size="large"
              className="w-full"
              allowClear
              notFoundContent={
                searchLoading ? (
                  <div className="p-3 text-center text-gray-500">
                    <span className="animate-pulse">Đang tìm kiếm...</span>
                  </div>
                ) : searchValue.length >= 2 ? (
                  <div className="p-3 text-center text-gray-500">
                    Không tìm thấy sản phẩm nào
                    <div className="mt-2">
                      <button
                        onClick={() => handleDirectSearch(searchValue)}
                        className="text-blue-500 hover:text-blue-700 text-sm underline"
                      >
                        Tìm kiếm "{searchValue}" trong tất cả sản phẩm
                      </button>
                    </div>
                  </div>
                ) : null
              }
              dropdownStyle={{
                maxHeight: '400px',
                overflow: 'auto',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchValue.trim() && searchOptions.length === 0) {
                  handleDirectSearch(searchValue);
                }
              }}
            >

            </AutoComplete>
          </div>

          <div>
            {/* Order and Dropdown */}
            {isLoggedIn ? <UserNavbar user={user} /> : <GuestNavbar />}
          </div>
        </div>
      </div>

      {/* lower Navbar */}
      <div className="flex justify-center p-1 bg-gray-50">
        <ul className="sm:flex hidden items-center gap-4">
          {Menu.map((data) => (
            <li key={data.id}>
              <NavLink
                to={data.link}
                onClick={(e) => handleCollectionClick(e, data.link)}
                className={({ isActive }) =>
                  `inline-block text-lg px-4 py-2 uppercase 
                transition-all duration-300 ease-in-out 
                ${isActive
                    ? 'text-blue-500 font-medium'
                    : 'hover:text-blue-500 text-gray-700'
                  }`
                }
              >
                {data.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;