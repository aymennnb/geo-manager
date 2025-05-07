import React, { useState, useEffect, useRef } from "react";
import NavLink from "@/Components/NavLink";
import { Toaster } from "react-hot-toast";


export default function Authenticated({ user, header, children }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const dropdownRef = useRef();


    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex h-screen bg-gray-100 font-sans text-sm text-gray-800">
            {/* Sidebar */}
            <aside className="w-64 bg-[#301454] text-white flex flex-col">
                <div className="text-center text-2xl font-bold text-orange-500 py-6 border-b border-orange-500">
                    M-AUTOMOTIV
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <NavLink href={route("dashboard")} active={route().current("dashboard")}>
                        Maps
                    </NavLink>

                    {(user.role === "admin" || user.role === "manager") && (
                        <>
                            <NavLink href={route("sites")} active={route().current("sites")}>
                                Sites
                            </NavLink>
                            <NavLink href={route("documents")} active={route().current("documents")}>
                                Documents
                            </NavLink>
                        </>
                    )}

                    {user.role === "admin" && (
                        <>
                            <NavLink href={route("utilisateurs")} active={route().current("utilisateurs")}>
                                Utilisateurs
                            </NavLink>
                            <NavLink href={route("alerts")} active={route().current("alerts")}>
                                Journaux
                            </NavLink>
                        </>
                    )}
                </nav>

                {/* Profil + Déconnexion avec dropdown */}
                <div ref={dropdownRef} className="p-4 border-t border-gray-700 relative">
                    <span className="text-xs text-gray-400">Connecté en tant que</span>
                    <div
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="text-sm font-semibold cursor-pointer hover:text-orange-400 transition flex items-center justify-between"
                    >
                        {user.name}
                        <svg
                            className={`w-4 h-4 ml-2 transition-transform ${showDropdown ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                    {showDropdown && (
                        <div className="p-2.5 absolute bottom-16 left-4 w-48 bg-white text-gray-950 rounded shadow-lg z-50">
                            <NavLink
                                href={route("profile.edit")}
                                className="block px-4 py-2 hover:bg-gray-100"
                            >
                                <span style={{color:'orange'}}>Profil</span>
                            </NavLink>
                            <NavLink
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="block px-4 py-2 hover:bg-gray-100"
                            >
                                <span style={{color:'orange'}}>Déconnexion</span>
                            </NavLink>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <Toaster position="top-right" reverseOrder={false} toastOptions={{
                    autoClose: 7000, // 5000 ms = 5 secondes
                    pauseOnHover: true, // Mettre en pause lorsque l'utilisateur survole
                    draggable: true, // Permettre le glissement du toast
                    pauseOnFocusLoss: true, // Mettre en pause si l'application perd le focus
                }}
                />
                <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-700">{header}</h2>
                    <div className="flex items-center gap-3">
                        {/*<NavLink*/}
                        {/*    className="text-sm text-gray-600 hover:text-blue-600"*/}
                        {/*    href={route("profile.edit")}*/}
                        {/*>*/}
                        {/*    Profil*/}
                        {/*</NavLink>*/}
                        {/*<NavLink*/}
                        {/*    className="text-sm text-red-500 border border-red-500 px-3 py-1 rounded hover:bg-red-50"*/}
                        {/*    href={route('logout')} method="post" as="button"*/}
                        {/*>*/}
                        {/*    Déconnexion*/}
                        {/*</NavLink>*/}
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-6 bg-gray-50">{children}</main>
            </div>
        </div>
    );
}
