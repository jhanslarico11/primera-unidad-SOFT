import { Link } from '@inertiajs/react';

export default function NavLink({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={
                'inline-flex h-10 items-center rounded-md px-3 text-sm font-medium transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'bg-slate-900 text-white shadow-sm '
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 ') +
                className
            }
        >
            {children}
        </Link>
    );
}
