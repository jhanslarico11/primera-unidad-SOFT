import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputLabel from "@/Components/InputLabel";
import ResetButton from "@/Components/ResetButton";
import SearchButton from "@/Components/SearchButton";
import TextInput from "@/Components/TextInput";
import { Head, useForm, usePage } from "@inertiajs/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";

export default function List({ auth }) {
    const { sales } = usePage().props;
    const { data, setData, post, processing, reset } = useForm({
        init_date: "",
        end_date: "",
        client: "",
        user: "",
    });
    const [initDate, setInitDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const calculateTotal = (products) => {
        return products
            .reduce((total, product) => total + product.pivot.sale_price * product.pivot.quantity, 0)
            .toFixed(2);
    };

    const search = (type, event) => {
        event.preventDefault();

        if (type === 2) {
            setInitDate(new Date());
            setEndDate(new Date());
            reset();
            data.init_date = new Date();
            data.end_date = new Date();
            data.client = "";
            data.user = "";
        } else {
            data.init_date = initDate || new Date();
            data.end_date = endDate || new Date();
        }

        post(route("reports.sales.search"), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header="Reporte de ventas">
            <Head title="Ventas" />
            <div className="page-wrap">
                <div className="page-container">
                    <div className="panel">
                        <form className="border-b border-slate-200 bg-white p-5">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <InputLabel htmlFor="init_date" value="Fecha inicio" />
                                    <DatePicker
                                        selected={initDate}
                                        className="mt-1 block w-full rounded-md border-slate-300 text-sm shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                        wrapperClassName="block w-full"
                                        dateFormat="yyyy-MM-dd"
                                        onChange={(value) => setInitDate(value)}
                                    />
                                </div>
                                <div>
                                    <InputLabel htmlFor="end_date" value="Fecha fin" />
                                    <DatePicker
                                        selected={endDate}
                                        className="mt-1 block w-full rounded-md border-slate-300 text-sm shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                        wrapperClassName="block w-full"
                                        dateFormat="yyyy-MM-dd"
                                        onChange={(value) => setEndDate(value)}
                                    />
                                </div>
                                <div>
                                    <InputLabel htmlFor="client" value="Cliente" />
                                    <TextInput
                                        id="client"
                                        type="text"
                                        name="client"
                                        value={data.client}
                                        onChange={(event) => setData("client", event.target.value)}
                                        className="mt-1 block w-full"
                                        maxLength={35}
                                        placeholder="Cliente"
                                    />
                                </div>
                                <div>
                                    <InputLabel htmlFor="user" value="Usuario" />
                                    <TextInput
                                        id="user"
                                        type="text"
                                        name="user"
                                        value={data.user}
                                        onChange={(event) => setData("user", event.target.value)}
                                        className="mt-1 block w-full"
                                        maxLength={35}
                                        placeholder="Usuario"
                                    />
                                </div>
                            </div>

                            <div className="mt-5 flex flex-wrap justify-end gap-2">
                                <a href={route("reports.stock.products.pdf")} target="_blank" className="rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500">
                                    Imprimir PDF
                                </a>
                                <a href={route("reports.stock.products.excel")} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500">
                                    Imprimir Excel
                                </a>
                                <SearchButton onClick={(event) => search(1, event)} disabled={processing}>
                                    Buscar
                                </SearchButton>
                                <ResetButton onClick={(event) => search(2, event)} disabled={processing}>
                                    Restablecer
                                </ResetButton>
                            </div>
                        </form>

                        <div className="table-wrap">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Cliente</th>
                                        <th>Usuario</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sales.map((sale) => (
                                        <tr key={sale.id}>
                                            <td>{sale.sale_date}</td>
                                            <td className="font-medium text-slate-900">{sale.client.full_name}</td>
                                            <td>{sale.user.name}</td>
                                            <td className="font-semibold text-slate-900">${calculateTotal(sale.products)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
