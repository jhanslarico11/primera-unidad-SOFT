
export default function TextSelect({ options, formater = 0, ...props }) {
    return (
        <select {...props} className="mb-2 block w-full rounded-md border-slate-300 bg-white text-sm text-slate-800 shadow-sm focus:border-slate-500 focus:ring-slate-500">
            {formater === 0 ? (
                <>
                    {options.map(option => (
                        <option key={option.id} value={option.id}>{option.name}</option>
                    ))}
                </>
            ) : (
                <>
                    {options.map((option, index) => (
                        <option key={index} value={option.name}>{option.name}</option>
                    ))}
                </>
            )}

        </select>

    );
}
