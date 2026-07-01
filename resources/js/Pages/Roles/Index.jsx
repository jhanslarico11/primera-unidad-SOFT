import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { useState } from "react";
import DeleteButton from "@/Components/DeleteButton";
import TextInput from "@/Components/TextInput";
import Form from "./Form";

export default function Index({ auth }) {
    const { roles, permissions } = usePage().props;
    const [searchRole, setSearchRole] = useState("");
    const canDelete = auth.user?.permissions?.includes("Eliminar roles");

    const filteredRole = roles.filter((role) =>
        role.name.toLocaleLowerCase().includes(searchRole.toLocaleLowerCase())
    );

    return (
        <AuthenticatedLayout user={auth.user} header="Roles">
            <Head title="Roles" />
            <div className="page-wrap">
                <div className="page-container">
                    <div className="panel">
                        <div className="panel-toolbar">
                            <TextInput
                                isFocused={true}
                                type="text"
                                name="search"
                                placeholder="Buscar rol..."
                                className="w-full sm:w-80"
                                onChange={(event) => setSearchRole(event.target.value)}
                            />
                            <Form permissions={permissions} />
                        </div>
                        <div className="table-wrap">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Rol</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRole.map((role) => (
                                        <tr key={role.id}>
                                            <td className="font-medium text-slate-900">{role.name}</td>
                                            <td>
                                                <div className="action-row">
                                                    <Form id={role.id} role={role} permissions={permissions} />
                                                    {canDelete && (
                                                        <DeleteButton
                                                            url={route("roles.destroy", role.id)}
                                                            label={`el rol ${role.name}`}
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
