export default function DangerButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-md border border-transparent bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition ease-in-out duration-150 hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
