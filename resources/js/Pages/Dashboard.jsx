import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Form from './Sales/Form';
import TextInput from "@/Components/TextInput";
import { HiOutlineSearch, HiOutlineShoppingCart, HiOutlineTrash, HiOutlinePlus, HiOutlineMinus } from 'react-icons/hi';

export default function Dashboard({ auth }) {
    const { products, categories } = usePage().props;
    const [searchProduct, setSearchProduct] = useState('');
    const [searchCategory, setSearchCategory] = useState(0);
    const [productsForSale, setProductsForSale] = useState([]);

    const filteredProduct = products.filter(
        Number(searchCategory) === 0 ?
            product => product.name.toLocaleLowerCase().includes(searchProduct.toLocaleLowerCase())
            :
            product => {
                const auxFilterCategory = Number(product.category_id) === Number(searchCategory);
                const auxFilterProduct = product.name.toLocaleLowerCase().includes(searchProduct.toLocaleLowerCase())
                return auxFilterCategory && auxFilterProduct
            }
    );

    const addProductForSale = (product) => {
        console.log(product);
        setProductsForSale((addProduct) => {
            const existingProduct = addProduct.find((item) => item.id === product.id);
            if (existingProduct) {
                return addProduct.map((item) => (
                    item.id === product.id ? { id: product.id, name: product.name, sale_price: product.sale_price, quantity: item.quantity + 1 }
                        : item
                ));
            }
            else {
                return [...addProduct, { id: product.id, name: product.name, sale_price: product.sale_price, quantity: 1 }];
            }
        });
    }

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeProduct(productId);
            return;
        }
        setProductsForSale((items) =>
            items.map((item) =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const removeProduct = (productId) => {
        setProductsForSale((items) => items.filter((item) => item.id !== productId));
    };

    const calculateTotal = () => {
        return productsForSale.reduce((total, product) => total + (product.sale_price * product.quantity), 0).toFixed(2);
    }

    return (
        <AuthenticatedLayout user={auth.user} header="Punto de Venta">
            <Head title="Dashboard" />

            <div className="py-4">
                <div className="max-w-7xl mx-auto sm:px-2 lg:px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        {/* Panel de productos */}
                        <div className="lg:col-span-3 bg-white shadow-lg rounded-xl overflow-hidden">
                            {/* Barra de búsqueda */}
                            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative flex-1">
                                        <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <TextInput
                                            isFocused={true}
                                            type="text"
                                            name="search"
                                            placeholder="Buscar producto..."
                                            className="pl-10 w-full"
                                            onChange={(event) => setSearchProduct(event.target.value)}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <select
                                            onChange={(e) => setSearchCategory(e.target.value)}
                                            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value={0}>Todas las categorías</option>
                                            {categories.map(category => (
                                                <option key={category.id} value={category.id}>{category.name}</option>
                                            ))}
                                        </select>
                                        <TextInput
                                            type="text"
                                            name="bar_code"
                                            placeholder="Escanear código"
                                            className="w-40"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Grid de productos */}
                            <div className="p-4">
                                {filteredProduct.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        No se encontraron productos
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {filteredProduct.map(product => (
                                            <div
                                                key={product.id}
                                                className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                                                onClick={() => addProductForSale(product)}
                                            >
                                                <div className="relative h-32 bg-gray-100">
                                                    <img
                                                        src={product.image ? 'storage/images/' + product.image.url : '/img/imagen-por-defecto.png'}
                                                        className="w-full h-full object-cover"
                                                        alt={product.name}
                                                    />
                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all"></div>
                                                </div>
                                                <div className="p-3">
                                                    <h3 className="text-sm font-semibold text-gray-800 truncate">{product.name}</h3>
                                                    <p className="text-lg font-bold text-blue-600 mt-1">${product.sale_price}</p>
                                                    <button
                                                        className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white py-1.5 rounded-lg text-sm font-medium transition-colors"
                                                    >
                                                        Agregar
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Panel del carrito */}
                        <div className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col h-full">
                            <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                                <div className="flex items-center gap-2">
                                    <HiOutlineShoppingCart className="h-6 w-6" />
                                    <h2 className="text-lg font-semibold">Carrito de Ventas</h2>
                                </div>
                                <p className="text-sm text-blue-100 mt-1">
                                    {productsForSale.length} {productsForSale.length === 1 ? 'producto' : 'productos'}
                                </p>
                            </div>

                            <div className="flex-1 p-4 max-h-96 overflow-y-auto">
                                {productsForSale.length === 0 ? (
                                    <div className="text-center py-8 text-gray-400">
                                        <HiOutlineShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                        <p>Carrito vacío</p>
                                        <p className="text-sm">Agrega productos</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {productsForSale.map(product => (
                                            <div key={product.id} className="bg-gray-50 rounded-lg p-3">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-800 text-sm">{product.name}</h4>
                                                        <p className="text-blue-600 font-semibold">${product.sale_price}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => removeProduct(product.id)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <HiOutlineTrash className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <div className="flex justify-between items-center mt-2">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => updateQuantity(product.id, product.quantity - 1)}
                                                            className="bg-gray-200 hover:bg-gray-300 rounded-full w-6 h-6 flex items-center justify-center transition"
                                                        >
                                                            <HiOutlineMinus className="h-3 w-3" />
                                                        </button>
                                                        <span className="w-8 text-center font-medium">{product.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(product.id, product.quantity + 1)}
                                                            className="bg-gray-200 hover:bg-gray-300 rounded-full w-6 h-6 flex items-center justify-center transition"
                                                        >
                                                            <HiOutlinePlus className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                    <span className="font-semibold text-gray-800">
                                                        ${(product.sale_price * product.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Total y botón de venta */}
                            <div className="p-4 border-t border-gray-200 bg-gray-50">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-600">Total:</span>
                                    <span className="text-2xl font-bold text-blue-600">${calculateTotal()}</span>
                                </div>
                                <Form products={productsForSale} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
