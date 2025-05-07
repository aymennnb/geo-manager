import React, { useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import toast from "react-hot-toast";

export default function DocumentAcces({ auth, users,documentId,usersWithAccess, documentAccesses,setShowAccesModel }) {
    const { data, setData, post, processing, errors } = useForm({
        document_id: documentId,
        users: usersWithAccess
    });

    useEffect(() => {
        if (documentAccesses) {
            setData("users", documentAccesses.map((u) => u.id));
        }
    }, [documentAccesses]);

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
                                        <p className="text-gray-500">Aucun utilisateur sélectionné</p>
                                    )}
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="border rounded p-4 mb-4">
                                    {users.map((user) => (
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
                                    ))}
                                </div>

                                {errors.users && (
                                    <div className="text-red-500 mb-4">{errors.users}</div>
                                )}

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
                            </form>

                             Affichage des données pour débogage
                            {import.meta.env.DEV && (
                                <div className="mt-4 p-2 bg-gray-100 rounded">
                                    <p>Données du formulaire:</p>
                                    <pre>{JSON.stringify(data, null, 2)}</pre>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
    );
}
