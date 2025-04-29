import React from "react";
import { Head, useForm } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";

export default function AddSite({ auth, setShowAddForm }) {
    const { data, setData, processing, post, errors } = useForm({
        name: "",
        web: "",
        email: "",
        phone: "",
        address: "",
        latitude: "",
        longitude: "",
        image: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("sites.create"));
    };

    return (
       <div>
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h3 className="text-lg font-medium mb-4">Fournir les informations du site</h3>
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="mb-4">
                                    <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">
                                        Photo pour ce site
                                    </label>
                                    <input
                                        id="image"
                                        type="file"
                                        className="w-full px-3 py-1 border border-gray-300 rounded-md"
                                        onChange={e => setData("image", e.target.files[0])}
                                    />
                                    {errors.image && <p className="text-sm text-red-600 mt-1">{errors.image}</p>}
                                </div>

                                <div className="mb-6 flex gap-4">
                                    <div className="w-1/2">
                                        <label htmlFor="name" className="block text-sm font-bold mb-2">Nom du site</label>
                                        <input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData("name", e.target.value)}
                                            className="w-full border rounded px-3 py-1"
                                        />
                                        {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                                    </div>

                                    <div className="w-1/2">
                                        <label htmlFor="web" className="block text-sm font-bold mb-2">Site web</label>
                                        <input
                                            id="web"
                                            type="url"
                                            value={data.web}
                                            onChange={(e) => setData("web", e.target.value)}
                                            className="w-full border rounded px-3 py-1"
                                        />
                                        {errors.web && <p className="text-sm text-red-600 mt-1">{errors.web}</p>}
                                    </div>
                                </div>

                                <div className="mb-6 flex gap-4">
                                    <div className="w-1/2">
                                        <label htmlFor="email" className="block text-sm font-bold mb-2">Email</label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData("email", e.target.value)}
                                            className="w-full border rounded px-3 py-1"
                                        />
                                        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                                    </div>

                                    <div className="w-1/2">
                                        <label htmlFor="phone" className="block text-sm font-bold mb-2">Téléphone</label>
                                        <input
                                            id="phone"
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData("phone", e.target.value)}
                                            className="w-full border rounded px-3 py-1"
                                        />
                                        {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="address" className="block text-sm font-bold mb-2">Adresse</label>
                                    <input
                                        id="address"
                                        type="text"
                                        value={data.address}
                                        onChange={(e) => setData("address", e.target.value)}
                                        className="w-full border rounded px-3 py-1"
                                    />
                                    {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>}
                                </div>

                                <div className="mb-6 flex gap-4">
                                    <div className="w-1/2">
                                        <label htmlFor="latitude" className="block text-sm font-bold mb-2">Latitude</label>
                                        <input
                                            id="latitude"
                                            type="number"
                                            step="any"
                                            value={data.latitude}
                                            onChange={(e) => setData("latitude", e.target.value)}
                                            className="w-full border rounded px-3 py-1"
                                        />
                                        {errors.latitude && <p className="text-sm text-red-600 mt-1">{errors.latitude}</p>}
                                    </div>

                                    <div className="w-1/2">
                                        <label htmlFor="longitude" className="block text-sm font-bold mb-2">Longitude</label>
                                        <input
                                            id="longitude"
                                            type="number"
                                            step="any"
                                            value={data.longitude}
                                            onChange={(e) => setData("longitude", e.target.value)}
                                            className="w-full border rounded px-3 py-1"
                                        />
                                        {errors.longitude && <p className="text-sm text-red-600 mt-1">{errors.longitude}</p>}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddForm(false)}
                                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                        {processing ? "Enregistrement..." : "Ajouter le site"}
                                    </button>
                                </div>
                            </form>

                            {/* Affichage debug si en mode développement */}
                            {import.meta.env.DEV && (
                                <div className="mt-6 p-4 bg-gray-100 rounded">
                                    <p className="text-sm font-bold mb-2">Données du formulaire :</p>
                                    <pre className="text-sm text-gray-700">{JSON.stringify(data, null, 2)}</pre>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
    );
}
