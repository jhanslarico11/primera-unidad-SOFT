import { useState } from "react";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link } from "@inertiajs/react";
import { ToastContainer } from "react-toastify";
import {
    HiOutlineBars3,
    HiOutlineChartBar,
    HiOutlineChevronDown,
    HiOutlineShoppingBag,
    HiOutlineSquares2X2,
    HiOutlineTag,
    HiOutlineTruck,
    HiOutlineUserGroup,
    HiOutlineUsers,
    HiOutlineXMark,
} from "react-icons/hi2";

export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const hasPermission = (permission) => {
        if (!user) return false;

        if (user.permissions && Array.isArray(user.permissions)) {
            return user.permissions.includes(permission);
        }

        try {
            if (user.roles && user.roles[0] && user.roles[0].permissions) {
                return user.roles[0].permissions.some((item) => item.name === permission);
            }
        } catch (e) {
            console.error("Error checking permission:", e);
        }

        return false;
    };

    const pageTitle = typeof header === "string" ? header : null;

    const navItems = [
        {
            label: "Punto de venta",
            href: route("dashboard"),
            active: route().current("dashboard"),
            icon: HiOutlineSquares2X2,
            show: true,
        },
        {
            label: "Categorias",
            href: route("categories.index"),
            active: route().current("categories.index"),
            icon: HiOutlineTag,
            show: hasPermission("Lectura categorias"),
        },
        {
            label: "Proveedores",
            href: route("providers.index"),
            active: route().current("providers.index"),
            icon: HiOutlineTruck,
            show: hasPermission("Lectura proveedores"),
        },
        {
            label: "Clientes",
            href: route("clients.index"),
            active: route().current("clients.index"),
            icon: HiOutlineUsers,
            show: hasPermission("Lectura clientes"),
        },
        {
            label: "Productos",
            href: route("products.index"),
            active: route().current("products.index"),
            icon: HiOutlineShoppingBag,
            show: hasPermission("Lectura productos"),
        },
        {
            label: "Roles",
            href: route("roles.index"),
            active: route().current("roles.index"),
            icon: HiOutlineUserGroup,
            show: hasPermission("Lectura roles"),
        },
        {
            label: "Usuarios",
            href: route("users.index"),
            active: route().current("users.index"),
            icon: HiOutlineUserGroup,
            show: hasPermission("Lectura usuarios"),
        },
    ];

    return (
        <div className="min-h-screen bg-slate-100">
            <ToastContainer />
            <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-6">
                            <Link href="/" className="flex shrink-0 items-center gap-2">
                                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
                                    <HiOutlineShoppingBag className="h-6 w-6" />
                                </span>
                                <span className="hidden text-base font-bold text-slate-900 lg:block">Ventas Web</span>
                            </Link>

                            <div className="hidden items-center gap-1 sm:flex">
                                {navItems.filter((item) => item.show).map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <NavLink key={item.label} href={item.href} active={item.active}>
                                            <Icon className="mr-2 h-4 w-4" />
                                            {item.label}
                                        </NavLink>
                                    );
                                })}

                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex h-10 items-center rounded-md px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
                                            >
                                                <HiOutlineChartBar className="mr-2 h-4 w-4" />
                                                Reportes
                                                <HiOutlineChevronDown className="ms-2 h-4 w-4" />
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content align="left">
                                        <Dropdown.Link href={route("reports.stock.products")}>
                                            Reporte stock de productos
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route("reports.sales")}>
                                            Reporte de ventas
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none"
                                        >
                                            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-700">
                                                {(user?.name || "U").charAt(0).toUpperCase()}
                                            </span>
                                            {user?.name || "Usuario"}
                                            <HiOutlineChevronDown className="h-4 w-4 text-slate-400" />
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href={route("profile.edit")}>
                                        Perfil
                                    </Dropdown.Link>
                                    <Dropdown.Link href={route("logout")} method="post" as="button">
                                        Cerrar sesion
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                            className="inline-flex items-center justify-center rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none sm:hidden"
                        >
                            {showingNavigationDropdown ? (
                                <HiOutlineXMark className="h-6 w-6" />
                            ) : (
                                <HiOutlineBars3 className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                <div className={`${showingNavigationDropdown ? "block" : "hidden"} sm:hidden`}>
                    <div className="space-y-1 border-t border-slate-200 bg-white py-3">
                        {navItems.filter((item) => item.show).map((item) => (
                            <ResponsiveNavLink key={item.label} href={item.href} active={item.active}>
                                {item.label}
                            </ResponsiveNavLink>
                        ))}
                    </div>

                    <div className="border-t border-slate-200 bg-white py-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-slate-800">{user?.name || "Usuario"}</div>
                            <div className="text-sm font-medium text-slate-500">{user?.email || ""}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route("profile.edit")}>Perfil</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route("logout")} as="button">
                                Cerrar sesion
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="border-b border-slate-200 bg-white">
                    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
                        {pageTitle ? (
                            <h1 className="text-2xl font-bold text-slate-900">{pageTitle}</h1>
                        ) : (
                            header
                        )}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
