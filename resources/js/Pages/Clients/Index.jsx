import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import DeleteButton from "@/Components/DeleteButton";
import TextInput from "@/Components/TextInput";
import Form from "./Form";

export default function Index({ auth }) {
    const { clients } = usePage().props;
    const [searchClient, setSearchClient] = useState("");
    const canDelete = auth.user?.permissions?.includes("Eliminar clientes");

    const filteredClient = clients.data.filter((client) =>
        client.full_name.toLowerCase().includes(searchClient.toLowerCase()) ||
        (client.dni || "").includes(searchClient)
    );

    return (
        <AuthenticatedLayout user={auth.user} header="Clientes">
            <Head title="Clientes" />
            <div className="page-wrap">
                <div className="page-container">
                    <div className="panel">
                        <div className="panel-toolbar">
                            <TextInput
                                isFocused={true}
                                type="text"
                                name="search"
                                placeholder="Buscar cliente..."
                                className="w-full sm:w-80"
                                onChange={(event) => setSearchClient(event.target.value)}
                            />
                            <Form />
                        </div>
                        <div className="table-wrap">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>DNI</th>
                                        <th>Nombre</th>
                                        <th>Celular</th>
                                        <th>Direccion</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredClient.map((client) => (
                                        <tr key={client.id}>
                                            <td className="font-medium text-slate-900">{client.dni}</td>
                                            <td>{client.full_name}</td>
                                            <td>{client.cell_phone}</td>
                                            <td>{client.address}</td>
                                            <td>
                                                <div className="action-row">
                                                    <Form id={client.id} client={client} />
                                                    {canDelete && (
                                                        <DeleteButton
                                                            url={route("clients.destroy", client.id)}
                                                            label={`el cliente ${client.full_name}`}
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex flex-wrap gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4">
                            {clients.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`rounded-md px-3 py-1.5 text-sm transition ${
                                        link.active
                                            ? "bg-slate-900 text-white"
                                            : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
                                    } ${!link.url ? "pointer-events-none opacity-40" : ""}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
