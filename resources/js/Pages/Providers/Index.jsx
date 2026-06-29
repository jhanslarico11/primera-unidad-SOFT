import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { useState } from "react";
import DeleteButton from "@/Components/DeleteButton";
import TextInput from "@/Components/TextInput";
import Form from "./Form";

export default function Index({ auth }) {
    const { providers } = usePage().props;
    const [searchProvider, setSearchProvider] = useState("");
    const canDelete = auth.user?.permissions?.includes("Eliminar proveedores");

    const filteredProvider = providers.filter((provider) =>
        provider.contact.toLocaleLowerCase().includes(searchProvider.toLocaleLowerCase()) ||
        provider.company.toLocaleLowerCase().includes(searchProvider.toLocaleLowerCase())
    );

    return (
        <AuthenticatedLayout user={auth.user} header="Proveedores">
            <Head title="Proveedores" />
            <div className="page-wrap">
                <div className="page-container">
                    <div className="panel">
                        <div className="panel-toolbar">
                            <TextInput
                                placeholder="Buscar proveedor..."
                                className="w-full sm:w-80"
                                onChange={(event) => setSearchProvider(event.target.value)}
                            />
                            <Form />
                        </div>
                        <div className="table-wrap">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Empresa</th>
                                        <th>Contacto</th>
                                        <th>Celular</th>
                                        <th>Correo electronico</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProvider.map((provider) => (
                                        <tr key={provider.id}>
                                            <td className="font-medium text-slate-900">{provider.company}</td>
                                            <td>{provider.contact}</td>
                                            <td>{provider.cell_phone}</td>
                                            <td>{provider.email}</td>
                                            <td>
                                                <div className="action-row">
                                                    <Form id={provider.id} provider={provider} />
                                                    {canDelete && (
                                                        <DeleteButton
                                                            url={route("providers.destroy", provider.id)}
                                                            label={`el proveedor ${provider.company}`}
                                                        />
                                                    )}
                                                </div>
                                            </td>
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
