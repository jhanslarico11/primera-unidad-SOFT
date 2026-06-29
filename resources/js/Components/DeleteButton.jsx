import DangerButton from "@/Components/DangerButton";
import { useForm } from "@inertiajs/react";
import { HiOutlineTrash } from "react-icons/hi2";
import { toast } from "react-toastify";

export default function DeleteButton({ url, label = "registro", className = "" }) {
    const { delete: destroy, processing } = useForm();

    const submitDelete = () => {
        if (!window.confirm(`¿Seguro que deseas eliminar ${label}?`)) {
            return;
        }

        destroy(url, {
            preserveScroll: true,
            onSuccess: (res) => {
                if (res.props.flash?.status === false) {
                    toast.error(res.props.flash.message || "No se pudo eliminar.");
                    return;
                }

                toast.success(res.props.flash?.message || "Registro eliminado correctamente.");
            },
            onError: () => {
                toast.error("No se pudo eliminar el registro.");
            },
        });
    };

    return (
        <DangerButton
            type="button"
            onClick={submitDelete}
            disabled={processing}
            className={`p-2 ${className}`}
            title="Eliminar"
        >
            <HiOutlineTrash className="h-5 w-5" />
        </DangerButton>
    );
}
