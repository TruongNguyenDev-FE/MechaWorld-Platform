import { Button } from "antd";

const suggestedProducts = [
    {
        id: 1,
        name: 'Gundam Barbatos Lupus',
        price: '125.000vnd',
        image: 'https://i.ebayimg.com/images/g/GG4AAOSw3SpmO9qK/s-l1200.jpg',
    },
    {
        id: 2,
        name: 'Gundam Unicorn Banshee',
        price: '125.000vnd',
        image: 'https://images-na.ssl-images-amazon.com/images/I/51qL8XPsDbS.jpg',
    },
    {
        id: 3,
        name: 'Gundam Astray Red Frame',
        price: '125.000vnd',
        image: 'https://i.ebayimg.com/images/g/GG4AAOSw3SpmO9qK/s-l1200.jpg',
    },
    {
        id: 4,
        name: 'Gundam Astray Red Frame',
        price: '125.000vnd',
        image: 'https://i.ebayimg.com/images/g/GG4AAOSw3SpmO9qK/s-l1200.jpg',
    },
    {
        id: 5,
        name: 'Gundam Astray Red Frame',
        price: '125.000vnd',
        image: 'https://i.ebayimg.com/images/g/GG4AAOSw3SpmO9qK/s-l1200.jpg',
    },
];

export default function SuggestProduct() {
    return (
        <>
            <div className="suggest-section bg-white ">
                <div className="mt-12 p-6 border rounded-lg shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900">Gợi ý sản phẩm tương tự</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                        {suggestedProducts.map((product) => (
                            <div
                                key={product.id}
                                className="border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
                            >
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-60 object-cover rounded-lg mb-4"
                                />
                                <div className="info-product p-4">
                                    <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                                    <p className="text-sm font-bold text-red-500">{product.price}</p>
                                    <Button className="mt-4 w-full text-black py-2 rounded-lg" type='primary'>
                                        Xem chi tiết
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}