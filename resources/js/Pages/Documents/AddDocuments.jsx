import React from 'react'
import { Head, useForm } from '@inertiajs/react'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { useWindowWidth } from "@/hooks/useWindowWidth.js";

export default function AddDocuments({ auth, sites ,setShowAddForm}) {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        site_id: "",
        uploaded_by: auth.user.id,
        description: "",
        file_path: null,
        expiration_date: "",
        role: auth.user.role,
        user_id: auth.user.id,
        action: 'add',
        type: 'document',
        elem_id: null
    });

    const Width = useWindowWidth();

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('documents.create'), {
            onSuccess: () => {
                setShowAddForm(false);
                toast.success("Document ajouté avec succès !");
            },
        });
    };

    return (
        <>
            {Width > 930 ? (
                <div>
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 bg-white border-b border-gray-200">
                                <form onSubmit={handleSubmit} encType="multipart/form-data">
                                    <div className="mb-6">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file_path">
                                            Document
                                        </label>
                                        <div className="mt-1 flex items-center">
                                            <input
                                                id="file_path"
                                                type="file"
                                                className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                onChange={(e) => setData('file_path', e.target.files[0])}
                                            />
                                        </div>
                                        {errors.file_path &&
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.file_path}
                                            </p>
                                        }
                                    </div>

                                    <div className="mb-6 flex space-x-4">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="site_id">
                                                Affecter un site
                                            </label>
                                            <select
                                                id="site_id"
                                                className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={data.site_id}
                                                onChange={(e) => setData("site_id", e.target.value)}
                                            >
                                                <option value="">Sélectionner un site</option>
                                                {sites && sites.length > 0 ? sites.map((site) => (
                                                    <option key={site.id} value={site.id}>{site.name}</option>
                                                )) : (
                                                    <option disabled>Aucun site disponible</option>
                                                )}
                                            </select>
                                            {errors.site_id &&
                                                <p className="mt-2 text-sm text-red-600">
                                                    {errors.site_id}
                                                </p>
                                            }
                                        </div>

                                        <div className="w-1/2">
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                                                Titre
                                            </label>
                                            <input
                                                id="title"
                                                type="text"
                                                className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={data.title}
                                                onChange={(e) => setData("title", e.target.value)}
                                                placeholder="Entrez le titre du document"
                                            />
                                            {errors.title &&
                                                <p className="mt-2 text-sm text-red-600">
                                                    {errors.title}
                                                </p>
                                            }
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            rows="4"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={data.description}
                                            onChange={(e) => setData("description", e.target.value)}
                                            placeholder="Décrivez ce document"
                                        />
                                        {errors.description &&
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.description}
                                            </p>
                                        }
                                    </div>

                                    <div className="mb-6">
                                        <label htmlFor="expiration_date" className="block text-gray-700 text-sm font-medium mb-2">
                                            Date d'expiration
                                        </label>
                                        <input
                                            id="expiration_date"
                                            name="expiration_date"
                                            type="date"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={data.expiration_date}
                                            onChange={(e) => setData("expiration_date", e.target.value)}
                                        />
                                        {errors.expiration_date &&
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.expiration_date}
                                            </p>
                                        }
                                    </div>

                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            onClick={() => setShowAddForm(false)}
                                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors ${
                                                processing ? "opacity-75 cursor-not-allowed" : ""
                                            }`}
                                        >
                                            {processing ? "Enregistrement..." : "Ajouter le document"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            ):
                (
                    <div className="w-full px-2 py-1">
                        <div className="bg-white shadow-sm rounded-md">
                            <div className="p-3">
                                <form onSubmit={handleSubmit} encType="multipart/form-data">
                                    {/* Document File Input */}
                                    <div className="mb-2">
                                        <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="file_path">
                                            Document
                                        </label>
                                        <input
                                            id="file_path"
                                            type="file"
                                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                            onChange={(e) => setData('file_path', e.target.files[0])}
                                        />
                                        {errors.file_path && (
                                            <p className="mt-1 text-[10px] text-red-600">
                                                {errors.file_path}
                                            </p>
                                        )}
                                    </div>

                                    {/* Site Selection */}
                                    <div className="mb-2">
                                        <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="site_id">
                                            Affecter un site
                                        </label>
                                        <select
                                            id="site_id"
                                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                            value={data.site_id}
                                            onChange={(e) => setData("site_id", e.target.value)}
                                        >
                                            <option value="">Sélectionner un site</option>
                                            {sites && sites.length > 0 ? sites.map((site) => (
                                                <option key={site.id} value={site.id}>{site.name}</option>
                                            )) : (
                                                <option disabled>Aucun site disponible</option>
                                            )}
                                        </select>
                                        {errors.site_id && (
                                            <p className="mt-1 text-[10px] text-red-600">
                                                {errors.site_id}
                                            </p>
                                        )}
                                    </div>

                                    {/* Title Input */}
                                    <div className="mb-2">
                                        <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="title">
                                            Titre
                                        </label>
                                        <input
                                            id="title"
                                            type="text"
                                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                            value={data.title}
                                            onChange={(e) => setData("title", e.target.value)}
                                            placeholder="Titre du document"
                                        />
                                        {errors.title && (
                                            <p className="mt-1 text-[10px] text-red-600">
                                                {errors.title}
                                            </p>
                                        )}
                                    </div>

                                    {/* Description Textarea */}
                                    <div className="mb-2">
                                        <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="description">
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            rows="2"
                                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                            value={data.description}
                                            onChange={(e) => setData("description", e.target.value)}
                                            placeholder="Description"
                                        />
                                        {errors.description && (
                                            <p className="mt-1 text-[10px] text-red-600">
                                                {errors.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Expiration Date */}
                                    <div className="mb-2">
                                        <label htmlFor="expiration_date" className="block text-gray-700 text-xs font-medium mb-1">
                                            Date d'expiration
                                        </label>
                                        <input
                                            id="expiration_date"
                                            name="expiration_date"
                                            type="date"
                                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                            value={data.expiration_date}
                                            onChange={(e) => setData("expiration_date", e.target.value)}
                                        />
                                        {errors.expiration_date && (
                                            <p className="mt-1 text-[10px] text-red-600">
                                                {errors.expiration_date}
                                            </p>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex space-x-2 mt-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowAddForm(false)}
                                            className="flex-1 px-2 py-1 text-xs bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className={`flex-1 px-2 py-1 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 transition ${
                                                processing ? "opacity-50 cursor-not-allowed" : ""
                                            }`}
                                        >
                                            {processing ? "Enregistrement..." : "Ajouter le document"}
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
