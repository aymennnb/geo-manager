import React, { useEffect, useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { FaBackward } from "react-icons/fa6";

export default function AlertIndex({ auth, alerts, users, documents, filters }) {
    const { data, setData } = useForm({
        role: 'all',
        action: 'all',
        type: 'all',
        date: 'all',
        start_date: '',
        end_date: '',
        nomserch: ''
    });

    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredAlerts, setFilteredAlerts] = useState([]);

    // Fonction pour filtrer les alertes selon les critères
    useEffect(() => {
        if (!alerts) return;

        let filtered = [...alerts];

        // Filtre par rôle
        if (data.role !== 'all') {
            filtered = filtered.filter(alert => {
                const user = users.find(u => u.id === alert.user_id);
                return user && user.role === data.role;
            });
        }

        // Filtre par type
        if (data.type !== 'all') {
            filtered = filtered.filter(alert => alert.type === data.type);
        }

        // Filtre par action
        if (data.action !== 'all') {
            filtered = filtered.filter(alert => alert.action === data.action);
        }

        // Filtre par date
        if (data.date === 'recent') {
            filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (data.date === 'ancien') {
            filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        }

        // Filtre par plage de dates
        if (data.start_date) {
            const startDate = new Date(data.start_date);
            filtered = filtered.filter(alert => new Date(alert.created_at) >= startDate);
        }

        if (data.end_date) {
            const endDate = new Date(data.end_date);
            // Ajuster la fin de la journée pour inclure toute la journée
            endDate.setHours(23, 59, 59, 999);
            filtered = filtered.filter(alert => new Date(alert.created_at) <= endDate);
        }

        // Filtre par recherche de nom
        if (data.nomserch) {
            filtered = filtered.filter(alert => {
                const user = users.find(u => u.id === alert.user_id);
                return user && user.name.toLowerCase().includes(data.nomserch.toLowerCase());
            });
        }

        setFilteredAlerts(filtered);
        setCurrentPage(1); // Réinitialiser à la première page lors d'un nouveau filtrage
    }, [data, alerts, users]);

    // Fonction pour obtenir les éléments de la page courante
    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredAlerts.slice(startIndex, endIndex);
    };

    // Fonction pour gérer le changement de page
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= Math.ceil(filteredAlerts.length / itemsPerPage)) {
            setCurrentPage(pageNumber);
        }
    };

    const typeOptionsByRole = {
        admin: ["connecte", "document", "site", "user"],
        manager: ["connecte", "document", "site"],
        user: [],
    };

    const actionOptionsByType = {
        document: ["add", "edit", "delete", "updateAccessRetire", "updateAccessLimit"],
        site: ["add", "edit", "delete"],
        user: ["reset", "updaterole"],
    };

    const actionOptionsByRole = {
        admin: ["add", "edit", "delete", "reset", "updaterole", "updateAccessRetire", "updateAccessLimit"],
        manager: ["add", "edit", "delete", "updateAccessRetire", "updateAccessLimit"],
        user: ["connecte"],
    };

    const translateLabel = (value) => {
        const labels = {
            all: "Tous",
            document: "Document",
            site: "Site",
            user: "Utilisateur",
            add: "Ajout",
            edit: "Modification",
            delete: "Suppression",
            reset: "Réinitialisation",
            updaterole: "Changement de rôle",
            connecte: "Connexion",
            updateAccessRetire: "Retirer accès",
            updateAccessLimit: "Limiter accès",
        };
        return labels[value] || value;
    };

    const alertsPerPageOptions = [5, 10, 20, 25, 50, 100, 150,200,300,400,600,1000];
    const totalAlerts = filteredAlerts.length;
    const availableOptions = alertsPerPageOptions.filter(option => option <= totalAlerts || option === alertsPerPageOptions[0]);

    const showTypeFilter = data.role !== "user";
    const showActionFilter = data.type !== "connecte";

    const availableTypeOptions = typeOptionsByRole[data.role] || [];
    const availableActionOptions =
        data.role === "user"
            ? actionOptionsByRole["user"]
            : (actionOptionsByType[data.type] || []).filter(action =>
                actionOptionsByRole[data.role]?.includes(action)
            );

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    // Initialiser filteredAlerts avec alerts au chargement initial
    useEffect(() => {
        if (alerts) {
            setFilteredAlerts(alerts);
        }
    }, []);

    return (
        <Authenticated user={auth.user} header={<h2>Liste des Alertes</h2>}>
            <Head title="Alerts" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-medium text-gray-900">Liste des alertes</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-6 gap-6 mb-6">
                            <div className="flex flex-col w-full">
                                <label htmlFor="roleFilter" className="text-xs font-medium text-gray-700 mb-1">Filtrer par rôle :</label>
                                <select
                                    className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    id="roleFilter"
                                    name="role"
                                    value={data.role}
                                    onChange={handleFilterChange}
                                >
                                    <option value="all">Toutes</option>
                                    <option value="admin">Admin</option>
                                    <option value="manager">Manager</option>
                                    <option value="user">Utilisateur</option>
                                </select>
                            </div>

                            {showTypeFilter && (
                                <div className="flex flex-col w-full">
                                    <label htmlFor="typeFilter" className="text-xs font-medium text-gray-700 mb-1">Filtrer par type :</label>
                                    <select
                                        className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        id="typeFilter"
                                        name="type"
                                        value={data.type}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="all">Toutes</option>
                                        {availableTypeOptions.map((type) => (
                                            <option key={type} value={type}>{translateLabel(type)}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {showActionFilter && (
                                <div className="flex flex-col w-full">
                                    <label htmlFor="actionFilter" className="text-xs font-medium text-gray-700 mb-1">Filtrer par action :</label>
                                    <select
                                        className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        id="actionFilter"
                                        name="action"
                                        value={data.action}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="all">Toutes</option>
                                        {availableActionOptions.map((action) => (
                                            <option key={action} value={action}>
                                                {translateLabel(action)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="flex flex-col w-full">
                                <label htmlFor="dateFilter" className="text-xs font-medium text-gray-700 mb-1">Filtrer par date :</label>
                                <select
                                    className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    id="dateFilter"
                                    name="date"
                                    value={data.date}
                                    onChange={handleFilterChange}
                                >
                                    <option value="all">Toutes</option>
                                    <option value="recent">Plus Récent</option>
                                    <option value="ancien">Plus Ancien</option>
                                </select>
                            </div>

                            <div className="flex flex-col w-full">
                                <label htmlFor="start_date" className="text-xs font-medium text-gray-700 mb-1">Date de début :</label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    id="start_date"
                                    name="start_date"
                                    value={data.start_date}
                                    onChange={handleFilterChange}
                                />
                            </div>

                            <div className="flex flex-col w-full">
                                <label htmlFor="end_date" className="text-xs font-medium text-gray-700 mb-1">Date de fin :</label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    id="end_date"
                                    name="end_date"
                                    value={data.end_date}
                                    onChange={handleFilterChange}
                                />
                            </div>
                        </div>
                        <div className="flex items-end gap-4 mb-7">
                            <div className="relative flex-1">
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    style={{height:'33px'}}
                                    type="text"
                                    name="nomserch"
                                    value={data.nomserch}
                                    onChange={handleFilterChange}
                                    className="block w-full pl-10 pr-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Rechercher par nom..."
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs font-medium text-gray-700 mb-1">Par page:</label>
                                <select
                                    id="itemsPerPage"
                                    className="w-24 px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        setItemsPerPage(Number(e.target.value));
                                        setCurrentPage(1); // Réinitialiser à la première page lors du changement d'items par page
                                    }}
                                >
                                    {availableOptions.map(option => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto">
                            <table className="table-auto w-full text-sm text-left text-gray-500">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Corps de l'alerte</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Date et Heure</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {filteredAlerts && filteredAlerts.length > 0 ? (
                                    getCurrentPageItems().map((alert) => {
                                        const actor = users.find(user => user.id === alert.user_id);
                                        const actorName = actor?.name || "Inconnu";
                                        const actorRole = actor?.role || "inconnu";

                                        return (
                                            <tr key={alert.id} className="hover:bg-gray-50 text-center">
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                                                    {actorRole === "admin"
                                                        ? `L'admin ${actorName} ${alert.message}`
                                                        : actorRole === "manager"
                                                            ? `Le manager ${actorName} ${alert.message}`
                                                            : `${actorName} ${alert.message}`}
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                                                    {new Date(alert.created_at).toLocaleString("fr-FR", {
                                                        day: "2-digit",
                                                        month: "2-digit",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="px-6 py-4 text-center text-sm text-gray-500">
                                            Aucune alerte trouvée.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {filteredAlerts && filteredAlerts.length > 0 && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex justify-end text-sm text-gray-500">
                                    {filteredAlerts.length} alerte(s) trouvée(s)
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-1 rounded-md ${
                                            currentPage === 1
                                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                    >
                                        <FaBackward/>{/* Précédent*/}
                                    </button>
                                    <span className="px-3 py-1 bg-gray-100 rounded-md">
                                        Page {currentPage} sur {Math.ceil(filteredAlerts.length / itemsPerPage)}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage >= Math.ceil(filteredAlerts.length / itemsPerPage)}
                                        className={`px-3 py-1 rounded-md ${
                                            currentPage >= Math.ceil(filteredAlerts.length / itemsPerPage)
                                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                    >
                                        <TbPlayerTrackNextFilled/> {/*Suivant*/}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/*{import.meta.env.DEV && (*/}
            {/*    <div className="mt-10 p-2 bg-gray-100 rounded">*/}
            {/*        <p>Données du formulaire :</p>*/}
            {/*        <pre>{JSON.stringify(data, null, 2)}</pre>*/}
            {/*    </div>*/}
            {/*)}*/}
        </Authenticated>
    );
}
