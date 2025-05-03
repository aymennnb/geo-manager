import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";

export default function DocumentsAccesGroup({ documentIds, users, setShowAccessGroup, existingAccesses = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        document_ids: documentIds,
        user_ids: [],
    });

    useEffect(() => {
        // Précharger les accès existants si disponibles
        if (existingAccesses.length > 0) {
            setData("user_ids", existingAccesses.map(user => user.id));
        }
    }, [existingAccesses]);

    const handleSelect = (e) => {
        const userId = parseInt(e.target.value, 10);
        const isChecked = e.target.checked;

        if (isChecked) {
            setData("user_ids", [...data.user_ids, userId]);
        } else {
            setData("user_ids", data.user_ids.filter(id => id !== userId));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('documents.DocsAccess'), {
            preserveScroll: true,
            onSuccess: () => {
                setShowAccessGroup(false);
            }
        });
    };

    return (
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6">
                    <h3 className="text-lg font-medium mb-4">Attribuer l'accès à plusieurs documents</h3>

                    <div className="mb-4">
                        <label className="block mb-2">
                            Utilisateurs sélectionnés pour <b>{data.document_ids.length}</b> document(s) sélectionnés :
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {data.user_ids.length > 0 ? (
                                data.user_ids.map((userId) => {
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
                        <div className="border rounded p-4 mb-4 max-h-72 overflow-y-auto">
                            {users
                                .map((user) => (
                                <div key={user.id} className="checkbox-container mb-2">
                                    <input
                                        type="checkbox"
                                        name="user_ids"
                                        id={`user-${user.id}`}
                                        value={user.id}
                                        checked={data.user_ids.includes(user.id)}
                                        onChange={handleSelect}
                                        className="mr-2"
                                    />
                                    <label htmlFor={`user-${user.id}`}>{user.name}</label>
                                </div>
                            ))}
                        </div>

                        {errors.user_ids && (
                            <div className="text-red-500 mb-4">{errors.user_ids}</div>
                        )}

                        <div className="flex justify-end space-x-2 mb-3">
                            <button
                                type="button"
                                onClick={() => setData("user_ids", [])}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                            >
                                Réinitialiser la sélection
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowAccessGroup(false)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                {processing ? "Enregistrement..." : "Enregistrer les modifications"}
                            </button>
                        </div>
                    </form>

                    {/* Debug en mode développement */}
                    {import.meta.env.DEV && (
                        <div className="mt-4 p-2 bg-gray-100 rounded">
                            <p>Données du formulaire :</p>
                            <pre>{JSON.stringify(data, null, 2)}</pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
