import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { useState } from "react";
import {
    HiOutlineMinus,
    HiOutlinePlus,
    HiOutlineSearch,
    HiOutlineShoppingCart,
    HiOutlineTrash,
} from "react-icons/hi";
import Form from "./Sales/Form";
import TextInput from "@/Components/TextInput";

const IGV_RATE = 0.18;

export default function Dashboard({ auth }) {
    const { products, categories } = usePage().props;
    const [searchProduct, setSearchProduct] = useState("");
    const [searchCategory, setSearchCategory] = useState(0);
    const [productsForSale, setProductsForSale] = useState([]);

    const filteredProduct = products.filter(
        Number(searchCategory) === 0
            ? (product) => product.name.toLocaleLowerCase().includes(searchProduct.toLocaleLowerCase())
            : (product) => {
                const matchCategory = Number(product.category_id) === Number(searchCategory);
                const matchProduct = product.name.toLocaleLowerCase().includes(searchProduct.toLocaleLowerCase());

                return matchCategory && matchProduct;
            }
    );

    const addProductForSale = (product) => {
        setProductsForSale((items) => {
            const existingProduct = items.find((item) => item.id === product.id);

            if (existingProduct) {
                return items.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [
                ...items,
                {
                    id: product.id,
                    name: product.name,
                    sale_price: product.sale_price,
                    quantity: 1,
                },
            ];
        });
    };

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

    const calculateSubtotal = () => {
        return productsForSale
            .reduce((total, product) => total + product.sale_price * product.quantity, 0);
    };

    const calculateIgv = () => {
        return calculateSubtotal() * IGV_RATE;
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateIgv();
    };

    return (
        <AuthenticatedLayout user={auth.user} header="Punto de venta">
            <Head title="Dashboard" />

            <div className="page-wrap">
                <div className="page-container">
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
                        <section className="panel lg:col-span-3">
                            <div className="panel-toolbar">
                                <div className="relative flex-1">
                                    <HiOutlineSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                    <TextInput
                                        isFocused={true}
                                        type="text"
                                        name="search"
                                        placeholder="Buscar producto..."
                                        className="w-full pl-10"
                                        onChange={(event) => setSearchProduct(event.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <select
                                        onChange={(event) => setSearchCategory(event.target.value)}
                                        className="rounded-md border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                    >
                                        <option value={0}>Todas las categorias</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    <TextInput
                                        type="text"
                                        name="bar_code"
                                        placeholder="Escanear codigo"
                                        className="w-full sm:w-40"
                                    />
                                </div>
                            </div>

                            <div className="p-5">
                                {filteredProduct.length === 0 ? (
                                    <div className="rounded-lg border border-dashed border-slate-300 py-16 text-center text-slate-500">
                                        No se encontraron productos
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                                        {filteredProduct.map((product) => (
                                            <button
                                                key={product.id}
                                                type="button"
                                                className="group overflow-hidden rounded-lg border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                                                onClick={() => addProductForSale(product)}
                                            >
                                                <div className="relative h-32 bg-slate-100">
                                                    <img
                                                        src={product.image ? "storage/images/" + product.image.url : "/img/imagen-por-defecto.png"}
                                                        className="h-full w-full object-cover"
                                                        alt={product.name}
                                                    />
                                                </div>
                                                <div className="p-3">
                                                    <h3 className="truncate text-sm font-semibold text-slate-900">{product.name}</h3>
                                                    <div className="mt-2 flex items-center justify-between gap-2">
                                                        <p className="text-base font-bold text-slate-900">${product.sale_price}</p>
                                                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                                            {product.quantity}
                                                        </span>
                                                    </div>
                                                    <span className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white transition group-hover:bg-slate-700">
                                                        Agregar
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>

                        <aside className="panel flex min-h-[520px] flex-col">
                            <div className="border-b border-slate-200 bg-slate-900 p-4 text-white">
                                <div className="flex items-center gap-2">
                                    <HiOutlineShoppingCart className="h-6 w-6" />
                                    <h2 className="text-lg font-semibold">Carrito</h2>
                                </div>
                                <p className="mt-1 text-sm text-slate-300">
                                    {productsForSale.length} {productsForSale.length === 1 ? "producto" : "productos"}
                                </p>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4">
                                {productsForSale.length === 0 ? (
                                    <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-slate-400">
                                        <HiOutlineShoppingCart className="mb-2 h-12 w-12 opacity-60" />
                                        <p className="font-medium">Carrito vacio</p>
                                        <p className="text-sm">Agrega productos desde la lista</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {productsForSale.map((product) => (
                                            <div key={product.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                                <div className="flex justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <h4 className="truncate text-sm font-semibold text-slate-900">{product.name}</h4>
                                                        <p className="text-sm font-semibold text-slate-600">${product.sale_price}</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeProduct(product.id)}
                                                        className="text-rose-500 transition hover:text-rose-700"
                                                    >
                                                        <HiOutlineTrash className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <div className="mt-3 flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => updateQuantity(product.id, product.quantity - 1)}
                                                            className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-100"
                                                        >
                                                            <HiOutlineMinus className="h-3 w-3" />
                                                        </button>
                                                        <span className="w-8 text-center text-sm font-semibold text-slate-800">{product.quantity}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => updateQuantity(product.id, product.quantity + 1)}
                                                            className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-100"
                                                        >
                                                            <HiOutlinePlus className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-900">
                                                        ${(product.sale_price * product.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-slate-200 bg-slate-50 p-4">
                                <div className="mb-4 space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-slate-600">Subtotal</span>
                                        <span className="font-semibold text-slate-800">${calculateSubtotal().toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-slate-600">IGV (18%)</span>
                                        <span className="font-semibold text-slate-800">${calculateIgv().toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                                        <span className="text-sm font-medium text-slate-600">Total</span>
                                        <span className="text-3xl font-bold text-slate-900">${calculateTotal().toFixed(2)}</span>
                                    </div>
                                </div>
                                <Form products={productsForSale} />
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
