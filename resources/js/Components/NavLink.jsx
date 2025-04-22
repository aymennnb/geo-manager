import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:ring-offset-2 focus:ring-indigo-500 ` +
                (active
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800') +
                ' ' + className
            }
        >
            {children}
        </Link>
    );
}
