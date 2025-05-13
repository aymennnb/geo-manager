import React, { useState, useEffect, useRef } from "react";
import NavLink from "@/Components/NavLink";
import { Toaster } from "react-hot-toast";
import { router } from '@inertiajs/react';
import LoadingSpinner from "@/Components/Loader";


export default function Authenticated({ user, header, children }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        const stored = localStorage.getItem("sidebarOpen");
        return stored !== null ? stored === "true" : true;
    });
    const dropdownRef = useRef();
    const [loading, setLoading] = useState(false);


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

    useEffect(() => {
        const start = () => setLoading(true);
        const finish = () => {
            setTimeout(() => {
                setLoading(false);
            }, 50);
        };

        // Gestionnaire des événements d'Inertia.js
        document.addEventListener('inertia:start', start);
        document.addEventListener('inertia:finish', finish);
        document.addEventListener('inertia:error', finish);
        document.addEventListener('inertia:cancel', finish);

        return () => {
            document.removeEventListener('inertia:start', start);
            document.removeEventListener('inertia:finish', finish);
            document.removeEventListener('inertia:error', finish);
            document.removeEventListener('inertia:cancel', finish);
        };
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    const isExemptPage = window.location.pathname === '/dashboard';


    return (
        <div className="flex h-screen bg-gray-100 font-sans text-sm text-gray-800">
            {!isExemptPage && <LoadingSpinner isLoading={loading} size="sm" />}
            <aside className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-[#381454] text-white flex flex-col overflow-hidden`}>
                <div className="text-center text-2xl font-bold text-[#ff6c04] py-6 border-b border-[#ff6c04] whitespace-nowrap">
                    M-AUTOMOTIV
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2 whitespace-nowrap">
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
                    autoClose: 7000,
                    pauseOnHover: true,
                    draggable: true,
                    pauseOnFocusLoss: true,
                }}
                />
                <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded hover:bg-gray-100 transition-colors focus:outline-none"
                            aria-label={isSidebarOpen ? "Masquer la barre latérale" : "Afficher la barre latérale"}
                        >
                            {isSidebarOpen ? "☰" : "☲"}
                        </button>
                        <h2 className="text-lg font-semibold text-gray-700">{header}</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Tu peux ajouter des boutons, notifications, etc. ici */}
                    </div>
                </header>


                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-6 bg-gray-50">{children}</main>
            </div>
        </div>
    );
}
