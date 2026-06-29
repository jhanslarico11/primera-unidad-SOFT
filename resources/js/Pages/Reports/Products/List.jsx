import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";

export default function List({ auth }) {
    const { products } = usePage().props;

    return (
        <AuthenticatedLayout user={auth.user} header="Reporte de stock">
            <Head title="Productos" />
            <div className="page-wrap">
                <div className="page-container">
                    <div className="panel">
                        <div className="panel-toolbar justify-end">
                            <a href={route("reports.stock.products.pdf")} target="_blank" className="rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500">
                                Imprimir PDF
                            </a>
                            <a href={route("reports.stock.products.excel")} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500">
                                Imprimir Excel
                            </a>
                        </div>
                        <div className="table-wrap">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Stock</th>
                                        <th>Categoria</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => {
                                        const lowStock = Number(product.quantity) < 50;

                                        return (
                                            <tr key={product.id}>
                                                <td className={lowStock ? "font-medium text-rose-600" : "font-medium text-slate-900"}>{product.name}</td>
                                                <td className={lowStock ? "text-rose-600" : ""}>{product.quantity}</td>
                                                <td className={lowStock ? "text-rose-600" : ""}>{product.category.name}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
