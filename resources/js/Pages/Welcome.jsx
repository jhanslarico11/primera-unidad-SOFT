import { Link, Head } from '@inertiajs/react';
import { HiOutlineShoppingBag, HiOutlineChartBar, HiOutlineUsers, HiOutlineTruck, HiOutlineShieldCheck, HiOutlineSparkles } from 'react-icons/hi';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Sistema de Ventas" />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700">
                    <div className="absolute inset-0 bg-black opacity-10"></div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                        <div className="text-center">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                                Sistema de Ventas
                            </h1>
                            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                                La solución completa para gestionar tus ventas, inventario y clientes en un solo lugar
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg"
                                    >
                                        Ir al Dashboard
                                        <HiOutlineShoppingBag className="ml-2 h-5 w-5" />
                                    </Link>
                                ) : (
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg"
                                    >
                                        Iniciar Sesión
                                        <HiOutlineShoppingBag className="ml-2 h-5 w-5" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Ola decorativa */}
                    <div className="absolute bottom-0 left-0 right-0">
                        <svg viewBox="0 0 1440 120" className="w-full h-20 text-gray-50 fill-current">
                            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
                        </svg>
                    </div>
                </div>

                {/* Características */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Características Principales</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Todo lo que necesitas para gestionar tu negocio de manera eficiente
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                <HiOutlineShoppingBag className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Gestión de Ventas</h3>
                            <p className="text-gray-600">
                                Sistema de punto de venta intuitivo y rápido. Genera facturas, controla el flujo de caja y obtén reportes detallados.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                <HiOutlineChartBar className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Control de Inventario</h3>
                            <p className="text-gray-600">
                                Administra tu stock, recibe alertas de productos con poca existencia y gestiona múltiples categorías.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                <HiOutlineUsers className="h-6 w-6 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Gestión de Clientes</h3>
                            <p className="text-gray-600">
                                Base de datos de clientes, historial de compras y gestión de créditos para fidelizar a tus compradores.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                                <HiOutlineTruck className="h-6 w-6 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Proveedores</h3>
                            <p className="text-gray-600">
                                Gestiona tus proveedores, controla compras y mantén un registro de tus productos por proveedor.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                                <HiOutlineShieldCheck className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Reportes y Estadísticas</h3>
                            <p className="text-gray-600">
                                Genera reportes en PDF y Excel de ventas, stock y productos más vendidos. Toma decisiones basadas en datos.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                                <HiOutlineSparkles className="h-6 w-6 text-yellow-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Múltiples Usuarios</h3>
                            <p className="text-gray-600">
                                Sistema de roles y permisos. Controla qué usuarios pueden ver, crear, editar o eliminar información.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Estadísticas */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-700 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div>
                                <div className="text-4xl font-bold text-white mb-2">100%</div>
                                <div className="text-blue-100">Satisfacción Garantizada</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-white mb-2">24/7</div>
                                <div className="text-blue-100">Soporte Técnico</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-white mb-2">Actualizaciones</div>
                                <div className="text-blue-100">Constantes y Gratuitas</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">¿Listo para empezar?</h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        Únete a cientos de negocios que ya confían en nuestro sistema para gestionar sus ventas
                    </p>
                    {!auth.user && (
                        <Link
                            href={route('login')}
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg"
                        >
                            Comenzar ahora
                            <HiOutlineSparkles className="ml-2 h-5 w-5" />
                        </Link>
                    )}
                </div>

                {/* Footer */}
                <footer className="bg-gray-800 text-white py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <p className="text-gray-400">
                            Sistema de Ventas v1.0 - Desarrollado con Laravel {laravelVersion} (PHP v{phpVersion})
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                            © {new Date().getFullYear()} - Todos los derechos reservados
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
