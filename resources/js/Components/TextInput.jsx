import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextInput({ type = 'text', className = '', isFocused = false, ...props }, ref) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <input
            {...props}
            type={type}
            className={
                'rounded-md border-slate-300 bg-white text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-slate-500 focus:ring-slate-500 ' +
                className
            }
            ref={input}
        />
    );
});
