import React from "react";
import { Head, useForm } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";

export default function EditUser({ auth, user }) {
    const { data, setData, post, processing, errors } = useForm({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("utilisateurs.update"));
    };

    return (
        <Authenticated user={auth.user} header={<h2 className="mb-4">Modifier un utilisateur</h2>}>
            <Head title="Modifier un utilisateur" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-gray-900">Modifier les informations de l'utilisateur</h3>
                            </div>

                            <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow-sm space-y-4">
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Nom</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                    />
                                    {errors.name && <div className="text-red-500 mt-1">{errors.name}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={data.email}
                                        onChange={(e) => setData("email", e.target.value)}
                                    />
                                    {errors.email && <div className="text-red-500 mt-1">{errors.email}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Rôle</label>
                                    <select
                                        className="form-control"
                                        value={data.role}
                                        onChange={(e) => setData("role", e.target.value)}
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="manager">Manager</option>
                                        <option value="user">Utilisateur</option>
                                    </select>
                                    {errors.role && <div className="text-red-500 mt-1">{errors.role}</div>}
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                        disabled={processing}
                                    >
                                        {processing ? "Enregistrement..." : "Mettre à jour"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => window.history.back()}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
