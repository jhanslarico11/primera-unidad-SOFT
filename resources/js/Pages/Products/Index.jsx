import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage, Head } from "@inertiajs/react";
import { useState } from "react";
import Form from "./Form";
import Show from "./Show";
import Import from "./Import";
import Load from "./Load";
import { HiOutlineSearch, HiOutlinePlus, HiOutlinePencil, HiOutlineEye, HiOutlineDocumentDownload, HiOutlineUpload } from "react-icons/hi";

export default function Index({ auth }) {

    const { products, categories } = usePage().props;
    const [searchProduct, setSearchProduct] = useState('');

    const filteredProduct = products.filter(
        product => product.name.toLocaleLowerCase().includes(searchProduct.toLocaleLowerCase()) ||
                  (product.category?.name || '').toLocaleLowerCase().includes(searchProduct.toLocaleLowerCase())
    );

    return (
        <AuthenticatedLayout user={auth.user} header="Productos">
            <Head title="Productos" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Tarjeta principal */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

                        {/* Cabecera con búsqueda y botones */}
                        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="relative w-full sm:w-96">
                                    <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="text"
                                        placeholder="Buscar producto por nombre o categoría..."
                                        className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={searchProduct}
                                        onChange={(event) => setSearchProduct(event.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Form categories={categories} />
                                    <Import />
                                    <Load />
                                </div>
                            </div>
                        </div>

                        {/* Tabla de productos */}
                        <div className="overflow-x-auto">
                            {filteredProduct.length === 0 ? (
                                <div className="text-center py-16 text-gray-400">
                                    <HiOutlineSearch className="h-16 w-16 mx-auto mb-3 opacity-50" />
                                    <p className="text-lg font-medium">No se encontraron productos</p>
                                    <p className="text-sm mt-1">Intenta con otros términos de búsqueda</p>
                                </div>
                            ) : (
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-200">
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Producto</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Precio</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Categoría</th>
                                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredProduct.map((product, index) => (
                                            <tr key={product.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                                                            {product.image ? (
                                                                <img src={'storage/images/' + product.image.url} className="h-8 w-8 rounded object-cover" alt={product.name} />
                                                            ) : (
                                                                <span className="text-blue-500 font-bold text-sm">{product.name.charAt(0).toUpperCase()}</span>
                                                            )}
                                                        </div>
                                                        <span className="font-medium text-gray-800">{product.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-gray-800 font-semibold">${product.sale_price}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        product.quantity < 10
                                                            ? 'bg-red-100 text-red-800'
                                                            : product.quantity < 20
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-green-100 text-green-800'
                                                    }`}>
                                                        {product.quantity} unidades
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        product.status === 'Activo'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {product.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-gray-600 text-sm">
                                                        {product.category?.name || 'Sin categoría'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Form id={product.id} product={product} categories={categories} />
                                                        <Show product={product} />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Footer con contador */}
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                            <div className="flex justify-between items-center text-sm text-gray-500">
                                <span>Mostrando {filteredProduct.length} de {products.length} productos</span>
                                <span className="flex items-center gap-1">
                                    <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                                    Stock total: {products.reduce((sum, p) => sum + p.quantity, 0)} unidades
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
