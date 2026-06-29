import { Link } from "@inertiajs/react";
import { HiOutlineShoppingBag } from "react-icons/hi2";

export default function Guest({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4 py-8">
            <Link href="/" className="mb-6 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900 text-white shadow-sm">
                    <HiOutlineShoppingBag className="h-6 w-6" />
                </span>
                <span className="text-lg font-bold text-slate-900">Ventas Web</span>
            </Link>

            <div className="w-full max-w-md overflow-hidden rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                {children}
            </div>
        </div>
    );
}
