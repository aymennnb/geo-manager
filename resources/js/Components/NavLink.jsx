import { Link } from "@inertiajs/react";

export default function NavLink({ href, active, children }) {
    return (
        <Link
            href={href}
            className={`block px-4 py-2 rounded transition ${
                active
                    ? "bg-orange-600 text-white font-medium"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
        >
            {children}
        </Link>
    );
}
