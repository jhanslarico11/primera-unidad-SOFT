import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { useState } from "react";
import DeleteButton from "@/Components/DeleteButton";
import TextInput from "@/Components/TextInput";
import Form from "./Form";

export default function Index({ auth }) {
    const { users, roles } = usePage().props;
    const [searchUser, setSearchUser] = useState("");
    const canDelete = auth.user?.permissions?.includes("Eliminar usuarios");

    const filteredUser = users.filter((user) =>
        user.name.toLocaleLowerCase().includes(searchUser.toLocaleLowerCase()) ||
        (user.dni || "").includes(searchUser)
    );

    return (
        <AuthenticatedLayout user={auth.user} header="Usuarios">
            <Head title="Usuarios" />
            <div className="page-wrap">
                <div className="page-container">
                    <div className="panel">
                        <div className="panel-toolbar">
                            <TextInput
                                isFocused={true}
                                type="text"
                                name="search"
                                placeholder="Buscar usuario..."
                                className="w-full sm:w-80"
                                onChange={(event) => setSearchUser(event.target.value)}
                            />
                            <Form roles={roles} />
                        </div>
                        <div className="table-wrap">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Usuario</th>
                                        <th>DNI</th>
                                        <th>Correo electronico</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUser.map((user) => (
                                        <tr key={user.id}>
                                            <td className="font-medium text-slate-900">{user.name}</td>
                                            <td>{user.dni || "-"}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <div className="action-row">
                                                    <Form id={user.id} user={user} roles={roles} />
                                                    {canDelete && user.id !== auth.user?.id && (
                                                        <DeleteButton
                                                            url={route("users.destroy", user.id)}
                                                            label={`el usuario ${user.name}`}
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
