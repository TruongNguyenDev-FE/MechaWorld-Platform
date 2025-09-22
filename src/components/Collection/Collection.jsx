import { useState } from "react";
import CollectionContainer from "./CollectionContainer";
import AddCollection from "./AddNewGundam/AddCollection";
import ShopProductUpdate from "../Gundam/Update/ShopProductUpdate";

const GundamCollectionApp = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [gundamData, setGundamData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  return (
    <div>
      {isCreating || isUpdating ? (
        // Hiển thị form tạo hoặc cập nhật sản phẩm
        isCreating ? (
          <AddCollection setIsCreating={setIsCreating} />
        ) : (
          <ShopProductUpdate
            setIsUpdating={setIsUpdating}
            gundamData={gundamData}
          />
        )
      ) : (
        <CollectionContainer
          setIsCreating={setIsCreating}
          isUpdating={isUpdating}
          gundamData={gundamData}
          setGundamData={setGundamData}
          setIsUpdating={setIsUpdating}
        />
      )}
    </div>
  );
};

export default GundamCollectionApp;
