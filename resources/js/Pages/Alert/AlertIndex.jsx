import React, { useEffect, useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";

export default function AlertIndex({ auth, alerts, users, documents, filters }) {
    const { data, setData, get } = useForm({
        role: 'all',
        action: 'all',
        type: 'all',
        date: 'all',
        start_date: '',
        end_date: ''
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);

        get(route('alerts'), {
            preserveState: true,
            preserveScroll: true
        });
    };

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
                                <label htmlFor="roleFilter" className="form-label">Filtrer par rôle :</label>
                                <select
                                    className="form-select w-full border border-gray-300 rounded p-1 transition duration-300 ease-in-out"
                                    id="roleFilter"
                                    name="role"
                                    value={data.role}
                                    onChange={handleFilterChange}
                                >
                                    <option value="all">Tous les rôles</option>
                                    <option value="admin">Admin</option>
                                    <option value="manager">Manager</option>
                                    <option value="user">Utilisateur</option>
                                </select>
                            </div>

                            <div className="flex flex-col w-full">
                                <label htmlFor="actionFilter" className="form-label">Filtrer par action :</label>
                                <select
                                    className="form-select w-full border border-gray-300 rounded p-1 transition duration-300 ease-in-out"
                                    id="actionFilter"
                                    name="action"
                                    value={data.action}
                                    onChange={handleFilterChange}
                                >
                                    <option value="all">Toutes les actions</option>
                                    <option value="add">Ajouter</option>
                                    <option value="edit">Éditer</option>
                                    <option value="delete">Supprimer</option>
                                </select>
                            </div>

                            <div className="flex flex-col w-full">
                                <label htmlFor="typeFilter" className="form-label">Filtrer par type :</label>
                                <select
                                    className="form-select w-full border border-gray-300 rounded p-1 transition duration-300 ease-in-out"
                                    id="typeFilter"
                                    name="type"
                                    value={data.type}
                                    onChange={handleFilterChange}
                                >
                                    <option value="all">Tous les types</option>
                                    <option value="document">Document</option>
                                    <option value="site">Site</option>
                                    <option value="user">Utilisateur</option>
                                </select>
                            </div>

                            <div className="flex flex-col w-full">
                                <label htmlFor="dateFilter" className="form-label">Filtrer par date :</label>
                                <select
                                    className="form-select w-full border border-gray-300 rounded p-1 transition duration-300 ease-in-out"
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
                                <label htmlFor="start_date" className="form-label">Date de début :</label>
                                <input
                                    type="date"
                                    className="form-input w-full border border-gray-300 rounded p-1 transition duration-300 ease-in-out"
                                    id="start_date"
                                    name="start_date"
                                    value={data.start_date}
                                    onChange={handleFilterChange}
                                />
                            </div>

                            <div className="flex flex-col w-full">
                                <label htmlFor="end_date" className="form-label">Date de fin :</label>
                                <input
                                    type="date"
                                    className="form-input w-full border border-gray-300 rounded p-1 transition duration-300 ease-in-out"
                                    id="end_date"
                                    name="end_date"
                                    value={data.end_date}
                                    onChange={handleFilterChange}
                                />
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
                                {alerts && alerts.length > 0 ? (
                                    alerts.map((alert) => {
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
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
