import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import React from "react";

function EditSite({ auth, siteToEdit, setShowEditModal }) {
    const { data, setData, processing, post, errors } = useForm({
        id: siteToEdit.id,
        name: siteToEdit.name,
        web: siteToEdit.web,
        email: siteToEdit.email,
        phone: siteToEdit.phone,
        address: siteToEdit.address,
        latitude: siteToEdit.latitude,
        longitude: siteToEdit.longitude,
        image: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("sites.update"), {
            onSuccess: () => setShowEditModal(false),
        });
    };

    return (
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white shadow-md rounded-lg p-6">
                <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">

                    {/* Aperçu image */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Aperçu de l'image</label>
                        <img src={`/storage/${siteToEdit.image}`} alt={data.name} className="w-48 rounded shadow-md" />
                    </div>

                    {/* Image */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Changer la photo</label>
                        <input
                            type="file"
                            onChange={e => setData('image', e.target.files[0])}
                            className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.image && <p className="mt-2 text-sm text-red-600">{errors.image}</p>}
                    </div>

                    {/* Nom */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Nom du site</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    {/* Web */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Site Web</label>
                        <input
                            type="url"
                            value={data.web}
                            onChange={(e) => setData("web", e.target.value)}
                            className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.web && <p className="mt-2 text-sm text-red-600">{errors.web}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                    </div>

                    {/* Téléphone */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Téléphone</label>
                        <input
                            type="tel"
                            value={data.phone}
                            onChange={(e) => setData("phone", e.target.value)}
                            className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
                    </div>

                    {/* Adresse */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Adresse</label>
                        <input
                            type="text"
                            value={data.address}
                            onChange={(e) => setData("address", e.target.value)}
                            className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.address && <p className="mt-2 text-sm text-red-600">{errors.address}</p>}
                    </div>

                    {/* Latitude */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Latitude</label>
                        <input
                            type="number"
                            step="any"
                            value={data.latitude}
                            onChange={(e) => setData("latitude", e.target.value)}
                            className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.latitude && <p className="mt-2 text-sm text-red-600">{errors.latitude}</p>}
                    </div>

                    {/* Longitude */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Longitude</label>
                        <input
                            type="number"
                            step="any"
                            value={data.longitude}
                            onChange={(e) => setData("longitude", e.target.value)}
                            className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.longitude && <p className="mt-2 text-sm text-red-600">{errors.longitude}</p>}
                    </div>

                    {/* Boutons */}
                    <div className="flex items-center justify-end space-x-2">
                        <button
                            onClick={() => setShowEditModal(false)}
                            type="button"
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className={`px-4 py-2 bg-yellow-100 text-yellow-600 rounded-md hover:text-yellow-900 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                                processing ? "opacity-75 cursor-not-allowed" : ""
                            }`}
                        >
                            {processing ? "Enregistrement..." : "Mettre à jour le site"}
                        </button>
                    </div>
                </form>
                {import.meta.env.DEV && (
                    <div className="mt-4 p-2 bg-gray-100 rounded">
                        <p>Données du formulaire :</p>
                        <pre>{JSON.stringify(data, null, 2)}</pre>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EditSite;
