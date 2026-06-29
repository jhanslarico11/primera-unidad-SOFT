import { useEffect } from "react";
import Checkbox from "@/Components/Checkbox";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import { HiOutlineLockClosed, HiOutlineMail } from "react-icons/hi";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (event) => {
        event.preventDefault();
        post(route("login"));
    };

    return (
        <GuestLayout>
            <Head title="Iniciar sesion" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Iniciar sesion</h1>
                <p className="mt-1 text-sm text-slate-500">Ingresa tus credenciales para continuar.</p>
            </div>

            {status && (
                <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {status}
                </div>
            )}

            <form className="space-y-5" onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Correo electronico" />
                    <div className="relative mt-1">
                        <HiOutlineMail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="block w-full pl-10"
                            placeholder="correo@ejemplo.com"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(event) => setData("email", event.target.value)}
                        />
                    </div>
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Contrasena" />
                    <div className="relative mt-1">
                        <HiOutlineLockClosed className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="block w-full pl-10"
                            placeholder="********"
                            autoComplete="current-password"
                            onChange={(event) => setData("password", event.target.value)}
                        />
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex cursor-pointer items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(event) => setData("remember", event.target.checked)}
                        />
                        <span className="ms-2 text-sm text-slate-600">Recordarme</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="text-sm font-medium text-slate-700 underline-offset-4 hover:underline"
                        >
                            Olvidaste tu contrasena?
                        </Link>
                    )}
                </div>

                <PrimaryButton className="w-full py-3" disabled={processing}>
                    Iniciar sesion
                </PrimaryButton>
            </form>
        </GuestLayout>
    );
}
