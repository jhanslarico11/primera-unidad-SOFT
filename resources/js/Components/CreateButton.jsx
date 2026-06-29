import PropTypes from 'prop-types';

export default function CreateButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-md border border-transparent bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition ease-in-out duration-150 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}

CreateButton.propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    children: PropTypes.node,
    // Para ...props puedes agregar más validaciones si es necesario
};

CreateButton.defaultProps = {
    className: '',
    disabled: false,
};
