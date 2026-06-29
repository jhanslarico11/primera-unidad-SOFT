import Modal from "@/Components/Modal";
import { useState } from "react";
import { useForm } from "@inertiajs/react";
import CreateButton from "@/Components/CreateButton";
import { HiMiniPencilSquare, HiXMark, HiXCircle } from "react-icons/hi2";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import InputError from "@/Components/InputError";
import { useDniAutocomplete } from "@/dni-autocomplete";

const IGV_RATE = 0.18;

export default function Form({ id = 0, products = [] }) {
    const [showModal, setShowModal] = useState(false);
    const { data, setData, post, errors, reset, clearErrors } = useForm({
        dni: '',
        client_name: '',
        nombres: '',
        apellido_paterno: '',
        apellido_materno: '',
        products: [],
    });
    const { dniStatus, dniLoading, handleDniChange } = useDniAutocomplete({
        data,
        setData,
        targetField: "client_name",
    });

    function openModal() {
        setShowModal(true);
    }

    const closeModal = (e) => {
        setShowModal(false);
        clearErrors();
        reset();
    }

    const calculateSubtotal = () => {
        return products.reduce((total, product) => total + (product.sale_price * product.quantity), 0);
    }

    const calculateIgv = () => {
        return calculateSubtotal() * IGV_RATE;
    }

    const calculateTotal = () => {
        return calculateSubtotal() + calculateIgv();
    }

    const submitsale = (e) => {
        e.preventDefault();
        data.products = products;
        post(route('sales.store'), {
            onSuccess: (res) => {
                closeModal();
            },
        })
    }

    return (
        <div>
            <div>
                <CreateButton type='button' onClick={openModal}>Generar venta</CreateButton>
            </div>
            <Modal show={showModal} closeable={true} onClose={closeModal}>
                <div className="p-4">
                    <div className="flex justify-between pb-4">
                        <h2 className="font-semibold">GENERAR VENTA</h2>
                        <button type="button" onClick={closeModal} className="bg-gray-300 hover:bg-gray-400 px-2"><HiXMark /></button>
                    </div>
                    <form>
                        <div>
                            <InputLabel value="Codigo cliente" />
                            <TextInput className="dni-autocomplete block w-full mb-2" type="text" name="dni" maxLength={8} value={data.dni} onChange={handleDniChange} />
                            {(dniLoading || dniStatus) && (
                                <p className="mb-2 text-sm text-slate-500">
                                    {dniLoading ? "Buscando..." : dniStatus}
                                </p>
                            )}
                            {errors.dni && <InputError message={errors.dni} />}
                            <input type="hidden" name="nombres" value={data.nombres} />
                            <input type="hidden" name="apellido_paterno" value={data.apellido_paterno} />
                            <input type="hidden" name="apellido_materno" value={data.apellido_materno} />
                        </div>
                        <div>
                            <InputLabel value="Nombre cliente" />
                            <TextInput className="block w-full mb-2" type="text" name="client_name" maxLength={35} value={data.client_name} onChange={(e) => setData('client_name', e.target.value)} />
                            {errors.client_name && <InputError message={errors.client_name} />}
                        </div>

                        <table className="mb-4 min-w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="py-2 text-left">Producto</th>
                                    <th className="py-2 text-left">Cantidad</th>
                                    <th className="py-2 text-left">Precio Unitario</th>
                                    <th className="py-2 text-left">Sub Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product, index) => (
                                    <tr key={product.id || index} className="border-b border-slate-100">
                                        <td className="py-2">{product.name}</td>
                                        <td className="py-2">{product.quantity}</td>
                                        <td className="py-2">${Number(product.sale_price).toFixed(2)}</td>
                                        <td className="py-2">${(product.quantity * product.sale_price).toFixed(2)}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan="3" className="pt-3 text-right font-semibold text-slate-600">Subtotal:</td>
                                    <td className="pt-3 font-semibold">${calculateSubtotal().toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td colSpan="3" className="text-right font-semibold text-slate-600">IGV (18%):</td>
                                    <td className="font-semibold">${calculateIgv().toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td colSpan="3" className="text-right text-base font-bold text-slate-900">Total:</td>
                                    <td className="text-base font-bold text-slate-900">${calculateTotal().toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="space-x-2 flex justify-end">
                            <SecondaryButton type="button" onClick={closeModal}>Cancelar</SecondaryButton>
                            <PrimaryButton onClick={submitsale}>Guardar</PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    )
}
