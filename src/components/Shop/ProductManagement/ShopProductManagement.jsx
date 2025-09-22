import { useState } from "react";

import ShopProduct from "./ShopProduct";  // Bảng hiển thị dữ liệu
import ShopProductCreate from "./ShopProductCreate"; // Form tạo sản phẩm
import ShopProductUpdate from "../../Gundam/Update/ShopProductUpdate";

export default function ShopProductManagement() {
  const [isCreating, setIsCreating] = useState(false);
  const [gundamData, setGundamData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  return (
    <div className="container mx-auto px-4">
      {/* Nếu đang ở chế độ tạo hoặc cập nhật sản phẩm */}
      {(isCreating || isUpdating) ? (
        // Hiển thị form tạo hoặc cập nhật sản phẩm
        isCreating ? (
          <ShopProductCreate setIsCreating={setIsCreating} gundamData={gundamData} />
        ) : (
          <ShopProductUpdate setIsUpdating={setIsUpdating} gundamData={gundamData} />
        )
      ) : (
        // Hiển thị bảng sản phẩm
        <ShopProduct
          setIsCreating={setIsCreating}
          isCreating={isCreating}
          isUpdating={isUpdating}
          gundamData={gundamData}
          setGundamData={setGundamData}
          setIsUpdating={setIsUpdating}
        />
      )}
    </div>
  );
}
