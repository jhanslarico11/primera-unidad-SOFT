import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { useState } from "react";
import DeleteButton from "@/Components/DeleteButton";
import TextInput from "@/Components/TextInput";
import Form from "./Form";

export default function Index({ auth }) {
    const { categories } = usePage().props;
    const [searchCategory, setSearchCategory] = useState("");
    const canDelete = auth.user?.permissions?.includes("Eliminar categorias");

    const filteredCategory = categories.filter((category) =>
        category.name.toLocaleLowerCase().includes(searchCategory.toLocaleLowerCase())
    );

    return (
        <AuthenticatedLayout user={auth.user} header="Categorias">
            <Head title="Categorias" />
            <div className="page-wrap">
                <div className="page-container">
                    <div className="panel">
                        <div className="panel-toolbar">
                            <TextInput
                                isFocused={true}
                                type="text"
                                name="search"
                                placeholder="Buscar categoria..."
                                className="w-full sm:w-80"
                                onChange={(event) => setSearchCategory(event.target.value)}
                            />
                            <Form />
                        </div>
                        <div className="table-wrap">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Categoria</th>
                                        <th>Descripcion</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCategory.map((category) => (
                                        <tr key={category.id}>
                                            <td className="font-medium text-slate-900">{category.name}</td>
                                            <td>{category.description}</td>
                                            <td>
                                                <div className="action-row">
                                                    <Form id={category.id} category={category} />
                                                    {canDelete && (
                                                        <DeleteButton
                                                            url={route("categories.destroy", category.id)}
                                                            label={`la categoria ${category.name}`}
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
