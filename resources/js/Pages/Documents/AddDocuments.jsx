import React from 'react'
import { Head, useForm } from '@inertiajs/react'
import Authenticated from '@/Layouts/AuthenticatedLayout'

export default function AddDocuments({ auth, sites ,setShowAddForm}) {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        site_id: "",
        uploaded_by: auth.user.id,
        description: "",
        file_path: null,
        role: auth.user.role,
        user_id: auth.user.id,
        action: 'add',
        type: 'document',
        elem_id: null
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('documents.create'), {
            onSuccess: (response) => {
                const documentId = response.data.id;
                setData("elem_id", documentId);
            }
        });
    };

    return (
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
