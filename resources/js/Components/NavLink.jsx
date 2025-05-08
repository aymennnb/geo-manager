import { Link } from "@inertiajs/react";

export default function NavLink({ href, method = 'get', as = 'a', active, children, ...props }) {
    const baseClasses = "block px-4 py-2 rounded transition";
    const activeClasses = active
        ? "bg-orange-600 text-white font-medium"
        : "text-gray-300 hover:bg-[#702c3c] hover:text-white";

    return (
        <Link
            href={href}
            method={method}
            as={as}
            {...props}
            className={`${baseClasses} ${activeClasses}`}
        >
            {children}
        </Link>
    );
}
