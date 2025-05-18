import React, { useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import toast from "react-hot-toast";
import { useWindowWidth } from "@/hooks/useWindowWidth.js";

export default function DocumentAcces({ auth, users, documentId, usersWithAccess, documentAccesses, setShowAccesModel }) {
    const { data, setData, post, processing, errors } = useForm({
        document_id: documentId,
        users: usersWithAccess,
        searchTerm: ""
    });

    const Width = useWindowWidth();


    // État pour stocker les utilisateurs filtrés
    const [filteredUsers, setFilteredUsers] = useState(users || []);

    useEffect(() => {
        if (documentAccesses) {
            setData("users", documentAccesses.map((u) => u.id));
        }
    }, [documentAccesses]);

    // Filtrer les utilisateurs en fonction du terme de recherche
    useEffect(() => {
        if (!users) return;

        let filtered = users.filter(user =>
            user.name && user.name.toLowerCase().includes(data.searchTerm.toLowerCase())
        );

        setFilteredUsers(filtered);
    }, [data.searchTerm, users]);

    // Initialiser filteredUsers avec users au chargement
    useEffect(() => {
        if (users) {
            setFilteredUsers(users);
        }
    }, [users]);

    // Gestionnaire pour le champ de recherche
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleSelect = (e) => {
        const userId = parseInt(e.target.value, 10);
        const isChecked = e.target.checked;

        if (isChecked) {
            setData("users", [...data.users, userId]);
        } else {
            setData("users", data.users.filter(id => id !== userId));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("access.update"), {
            onSuccess: () => {
                setShowAccesModel(false);
            },
        });
    };

    return (
        <div>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6">
                        <h3 className="text-lg font-medium mb-4">Sélectionner les utilisateurs</h3>
                        {/* Affichage des utilisateurs sélectionnés */}
                        <div className="mb-4">
                            <label className="block mb-2">Utilisateurs sélectionnés pour le document avec l'id <b>{data.document_id}</b> ({data.users.length}) :</label>
                            <div className="flex flex-wrap gap-2">
                                {data.users.length > 0 ? (
                                    data.users.map((userId) => {
                                        const user = users.find(u => u.id === userId);
                                        return user ? (
                                            <div key={userId} className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
                                                {user.name}
                                            </div>
                                        ) : null;
                                    })
                                ) : (
                                    <p className="text-gray-500"><span className="italic text-gray-400">Aucun utilisateur sélectionné</span></p>
                                )}
                            </div>
                        </div>

                        {/* Champ de recherche */}
                        <div className="mb-4">
                            <div className="relative flex-1">
                                {/* Icône de recherche */}
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>

                                {/* Champ de recherche */}
                                <input
                                    style={{ height: '33px' }}
                                    type="text"
                                    name="searchTerm"
                                    value={data.searchTerm}
                                    onChange={handleFilterChange}
                                    className="block w-full pl-10 pr-8 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Rechercher par nom..."
                                />

                                {/* Bouton de réinitialisation */}
                                {data.searchTerm && (
                                    <div
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                        onClick={() => handleFilterChange({ target: { name: 'searchTerm', value: '' } })}
                                    >
                                        <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="border rounded p-4 mb-4">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <div key={user.id} className="checkbox-container mb-2">
                                            <input
                                                type="checkbox"
                                                name="users"
                                                id={`user-${user.id}`}
                                                value={user.id}
                                                checked={data.users.includes(user.id)}
                                                onChange={handleSelect}
                                                className="mr-2"
                                            />
                                            <label htmlFor={`user-${user.id}`}>{user.name}</label>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500"><span className="italic text-gray-400">Aucun utilisateur trouvé.</span></p>
                                )}
                            </div>

                            {errors.users && (
                                <div className="text-red-500 mb-4">{errors.users}</div>
                            )}

                            {
                                Width > 550 ? (
                                    <div className="flex justify-end space-x-2 mb-3">
                                        <button
                                            type="button"
                                            onClick={() => setData("users", [])}
                                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                                        >
                                            Révoquer l'access
                                        </button>
                                        <button
                                            onClick={() => setShowAccesModel(false)}
                                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                            disabled={processing}
                                        >
                                            {processing ? "Enregistrement..." : "Enregistrer les modifications"}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex justify-end space-x-2 mb-3">
                                        <button
                                            type="button"
                                            onClick={() => setData("users", [])}
                                            className="px-2 py-1 text-xs bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                                        >
                                            Révoquer l'access
                                        </button>
                                        <button
                                            onClick={() => setShowAccesModel(false)}
                                            className="px-1 py-1 text-xs bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-1 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                                            disabled={processing}
                                        >
                                            {processing ? "Enregistrement..." : "Enregistrer les modifications"}
                                        </button>
                                    </div>
                                )
                            }
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
