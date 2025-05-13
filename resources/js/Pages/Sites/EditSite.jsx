import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import React from "react";
import {useWindowWidth} from "@/hooks/useWindowWidth.js";

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

    const Width = useWindowWidth();

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("sites.update"), {
            onSuccess: () => setShowEditModal(false),
        });
    };

    return (
        <>
            {Width > 930 ? (
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
                            <div className="mb-6 flex gap-4">
                                <div className="w-1/2">
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
                                <div className="w-1/2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Site Web</label>
                                    <input
                                        type="url"
                                        value={data.web}
                                        onChange={(e) => setData("web", e.target.value)}
                                        className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.web && <p className="mt-2 text-sm text-red-600">{errors.web}</p>}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="mb-6 flex gap-4">
                                <div className="w-1/2">
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
                                <div className="w-1/2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Téléphone</label>
                                    <input
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData("phone", e.target.value)}
                                        className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
                                </div>
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
                            <div className="mb-6 flex gap-4">
                                <div className="w-1/2">
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
                                <div className="w-1/2">
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
                    </div>
                </div> ) : (
                <div className="w-full px-2 py-1">
                    <div className="bg-white shadow-sm rounded-md">
                        <div className="p-3">
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                {/* Image Preview */}
                                <div className="mb-2">
                                    <label className="block text-gray-700 text-xs font-bold mb-1">
                                        Aperçu de l'image
                                    </label>
                                    <img
                                        src={`/storage/${siteToEdit.image}`}
                                        alt={data.name}
                                        className="w-48 rounded shadow-md mb-2"
                                    />
                                </div>

                                {/* Image Upload */}
                                <div className="mb-2">
                                    <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="image">
                                        Changer la photo
                                    </label>
                                    <input
                                        id="image"
                                        type="file"
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                        onChange={(e) => setData('image', e.target.files[0])}
                                    />
                                    {errors.image && (
                                        <p className="mt-1 text-[10px] text-red-600">
                                            {errors.image}
                                        </p>
                                    )}
                                </div>

                                {/* Site Name */}
                                <div className="mb-2">
                                    <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="name">
                                        Nom du site
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-[10px] text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Website */}
                                <div className="mb-2">
                                    <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="web">
                                        Site Web
                                    </label>
                                    <input
                                        id="web"
                                        type="url"
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                        value={data.web}
                                        onChange={(e) => setData("web", e.target.value)}
                                    />
                                    {errors.web && (
                                        <p className="mt-1 text-[10px] text-red-600">
                                            {errors.web}
                                        </p>
                                    )}
                                </div>

                                {/* Email and Phone */}
                                <div className="mb-2">
                                        <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="email">
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                            value={data.email}
                                            onChange={(e) => setData("email", e.target.value)}
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-[10px] text-red-600">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                <div className="mb-2">
                                        <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="phone">
                                            Téléphone
                                        </label>
                                        <input
                                            id="phone"
                                            type="tel"
                                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                            value={data.phone}
                                            onChange={(e) => setData("phone", e.target.value)}
                                        />
                                        {errors.phone && (
                                            <p className="mt-1 text-[10px] text-red-600">
                                                {errors.phone}
                                            </p>
                                        )}
                                </div>

                                {/* Address */}
                                <div className="mb-2">
                                    <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="address">
                                        Adresse
                                    </label>
                                    <input
                                        id="address"
                                        type="text"
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                        value={data.address}
                                        onChange={(e) => setData("address", e.target.value)}
                                    />
                                    {errors.address && (
                                        <p className="mt-1 text-[10px] text-red-600">
                                            {errors.address}
                                        </p>
                                    )}
                                </div>

                                {/* Latitude and Longitude */}
                                <div className="flex space-x-2 mb-2">
                                    <div className="w-1/2">
                                        <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="latitude">
                                            Latitude
                                        </label>
                                        <input
                                            id="latitude"
                                            type="number"
                                            step="any"
                                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                            value={data.latitude}
                                            onChange={(e) => setData("latitude", e.target.value)}
                                        />
                                        {errors.latitude && (
                                            <p className="mt-1 text-[10px] text-red-600">
                                                {errors.latitude}
                                            </p>
                                        )}
                                    </div>

                                    <div className="w-1/2">
                                        <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="longitude">
                                            Longitude
                                        </label>
                                        <input
                                            id="longitude"
                                            type="number"
                                            step="any"
                                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                            value={data.longitude}
                                            onChange={(e) => setData("longitude", e.target.value)}
                                        />
                                        {errors.longitude && (
                                            <p className="mt-1 text-[10px] text-red-600">
                                                {errors.longitude}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex space-x-2 mt-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="flex-1 px-1 py-1 text-xs bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className={`flex-1 px-1 py-1 text-xs bg-yellow-100 text-yellow-600 rounded-md hover:text-yellow-900 transition ${
                                            processing ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                    >
                                        {processing ? "Enregistrement..." : "Mettre à jour le site"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default EditSite;
