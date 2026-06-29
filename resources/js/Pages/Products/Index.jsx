import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import DeleteButton from "@/Components/DeleteButton";
import Form from "./Form";
import Import from "./Import";
import Load from "./Load";
import Show from "./Show";

export default function Index({ auth }) {
    const { products, categories } = usePage().props;
    const [searchProduct, setSearchProduct] = useState("");
    const canDelete = auth.user?.permissions?.includes("Eliminar productos");

    const filteredProduct = products.filter((product) =>
        product.name.toLocaleLowerCase().includes(searchProduct.toLocaleLowerCase()) ||
        (product.category?.name || "").toLocaleLowerCase().includes(searchProduct.toLocaleLowerCase())
    );

    return (
        <AuthenticatedLayout user={auth.user} header="Productos">
            <Head title="Productos" />
            <div className="page-wrap">
                <div className="page-container">
                    <div className="panel">
                        <div className="panel-toolbar">
                            <div className="relative w-full sm:w-96">
                                <HiOutlineSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar producto o categoria..."
                                    className="w-full rounded-md border-slate-300 py-2 pl-10 pr-4 text-sm shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                    value={searchProduct}
                                    onChange={(event) => setSearchProduct(event.target.value)}
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Form categories={categories} />
                                <Import />
                                <Load />
                            </div>
                        </div>

                        <div className="table-wrap">
                            {filteredProduct.length === 0 ? (
                                <div className="py-16 text-center text-slate-400">
                                    <HiOutlineSearch className="mx-auto mb-3 h-16 w-16 opacity-50" />
                                    <p className="text-lg font-medium">No se encontraron productos</p>
                                    <p className="mt-1 text-sm">Intenta con otros terminos de busqueda</p>
                                </div>
                            ) : (
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Producto</th>
                                            <th>Precio</th>
                                            <th>Stock</th>
                                            <th>Estado</th>
                                            <th>Categoria</th>
                                            <th className="text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProduct.map((product) => (
                                            <tr key={product.id}>
                                                <td>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100">
                                                            {product.image ? (
                                                                <img
                                                                    src={"storage/images/" + product.image.url}
                                                                    className="h-8 w-8 rounded object-cover"
                                                                    alt={product.name}
                                                                />
                                                            ) : (
                                                                <span className="text-sm font-bold text-slate-600">
                                                                    {product.name.charAt(0).toUpperCase()}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="font-medium text-slate-900">{product.name}</span>
                                                    </div>
                                                </td>
                                                <td className="font-semibold text-slate-800">${product.sale_price}</td>
                                                <td>
                                                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                        product.quantity < 10
                                                            ? "bg-rose-100 text-rose-700"
                                                            : product.quantity < 20
                                                                ? "bg-amber-100 text-amber-700"
                                                                : "bg-emerald-100 text-emerald-700"
                                                    }`}>
                                                        {product.quantity} unidades
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                        product.status === "Activo"
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-rose-100 text-rose-700"
                                                    }`}>
                                                        {product.status}
                                                    </span>
                                                </td>
                                                <td>{product.category?.name || "Sin categoria"}</td>
                                                <td>
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Form id={product.id} product={product} categories={categories} />
                                                        <Show product={product} />
                                                        {canDelete && (
                                                            <DeleteButton
                                                                url={route("products.destroy", product.id)}
                                                                label={`el producto ${product.name}`}
                                                            />
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        <div className="border-t border-slate-200 bg-slate-50 px-5 py-4">
                            <div className="flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                                <span>Mostrando {filteredProduct.length} de {products.length} productos</span>
                                <span className="flex items-center gap-2">
                                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
                                    Stock total: {products.reduce((sum, product) => sum + product.quantity, 0)} unidades
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
