import React, { useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { useWindowWidth } from "@/hooks/useWindowWidth.js";

export default function EditDocuments({ auth, document, sites, setShowEditForm }) {
    const { data, setData, post, processing, errors } = useForm({
        id: document.id,
        title: document.title,
        site_id: document.site_id,
        uploaded_by: document.uploaded_by,
        document_type: document.document_type,
        description: document.description,
        expiration_date: document.expiration_date,
        file_path: null,
        role: auth.user.role,
        user_id: auth.user.id,
        action: 'update',
        type: 'document',
        elem_id: document.id,
    });

    const Width = useWindowWidth();

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("documents.update"), {
         onSuccess: () => {
                setShowEditForm(false);
            },
            onError: () => {
                console.error('Erreur lors de la mise à jour du document');
            }
        });
    };

    return (
        <>
            {Width > 750 ?
                (<div>
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 bg-white border-b border-gray-200">
                                <form onSubmit={handleSubmit} encType="multipart/form-data">
                                    {/* Aperçu du document */}
                                    <div className="mb-6">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file_path">
                                            Aperçu du document
                                        </label>
                                        {document.file_path ? (
                                            <>
                                                {document.file_path.match(/\.(pdf)$/i) ? (
                                                    <div className="mt-2">
                                                        <iframe src={`/storage/${document.file_path}`} width="100%" height="500px" title="Aperçu PDF" className="border rounded-lg" />
                                                    </div>
                                                ) : document.file_path.match(/\.(jpg|jpeg|png)$/i) ? (
                                                    <img src={`/storage/${document.file_path}`} alt="Aperçu image" className="mt-2 max-w-full rounded-lg shadow-lg" />
                                                ) : document.file_path.match(/\.(doc|docx|xls|csv|xlsx)$/i) ? (
                                                    <a href={`/storage/${document.file_path}`} className="mt-2 text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">
                                                        Télécharger et ouvrir le document
                                                    </a>
                                                ) : (
                                                    <div className="mt-2 text-sm text-gray-500">Format non pris en charge</div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="mt-2 text-sm text-gray-500">Aucun fichier disponible</div>
                                        )}
                                    </div>

                                    {/* Sélecteur de fichier */}
                                    <div className="mb-6">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file_path">
                                            Document (nouveau fichier)
                                        </label>
                                        <input
                                            id="file_path"
                                            type="file"
                                            className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            onChange={(e) => setData('file_path', e.target.files[0])}
                                        />
                                        {errors.file_path && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.file_path}
                                            </p>
                                        )}
                                    </div>

                                    {/* Sélecteur de site */}
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
                                                    <option key={site.id} value={site.id}>
                                                        {site.name}
                                                    </option>
                                                )) : (
                                                    <option disabled>Aucun site disponible</option>
                                                )}
                                            </select>
                                            {errors.site_id && (
                                                <p className="mt-2 text-sm text-red-600">
                                                    {errors.site_id}
                                                </p>
                                            )}
                                        </div>

                                        {/* Titre */}
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
                                            {errors.title && (
                                                <p className="mt-2 text-sm text-red-600">
                                                    {errors.title}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Description */}
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
                                        {errors.description && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mb-2">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="document_type">
                                            Type de document
                                        </label>
                                        <select
                                            id="document_type"
                                            name="document_type"
                                            value={data.document_type}
                                            onChange={(e) => setData('document_type', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">-- Sélectionnez un type --</option>
                                            <option value="urbanisme">Informations Urbanistiques</option>
                                            <option value="contrat">Contrats</option>
                                            <option value="fiscalite">Taxes Professionnelles</option>
                                            <option value="autre">Autre</option>
                                        </select>
                                        {errors.document_type && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.document_type}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mb-6">
                                        <label htmlFor="expiration_date" className="block text-gray-700 text-sm font-bold mb-2">
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

                                    {/* Boutons */}
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            onClick={() => setShowEditForm(false)}
                                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className={`px-4 py-2 bg-yellow-100 text-yellow-600 rounded-md hover:text-yellow-900 focus:outline-none focus:ring-2 focus:ring-offset-2  transition-colors ${
                                                processing ? "opacity-75 cursor-not-allowed" : ""
                                            }`}
                                        >
                                            {processing ? "Enregistrement..." : "Mettre à jour le document"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div> ) : (
                    <div className="w-full px-2 py-1">
                        <div className="bg-white shadow-sm rounded-md">
                            <div className="p-3">
                                <form onSubmit={handleSubmit} encType="multipart/form-data">
                                    {/* Aperçu du document */}
                                    <div className="mb-6">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file_path">
                                            Aperçu du document
                                        </label>
                                        {document.file_path ? (
                                            <>
                                                {document.file_path.match(/\.(pdf)$/i) ? (
                                                    <div className="mt-2">
                                                        <iframe src={`/storage/${document.file_path}`} width="100%" height="500px" title="Aperçu PDF" className="border rounded-lg" />
                                                    </div>
                                                ) : document.file_path.match(/\.(jpg|jpeg|png)$/i) ? (
                                                    <img src={`/storage/${document.file_path}`} alt="Aperçu image" className="mt-2 max-w-full rounded-lg shadow-lg" />
                                                ) : document.file_path.match(/\.(doc|docx|xls|csv|xlsx)$/i) ? (
                                                    <a href={`/storage/${document.file_path}`} className="mt-2 text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">
                                                        Télécharger et ouvrir le document
                                                    </a>
                                                ) : (
                                                    <div className="mt-2 text-sm text-gray-500">Format non pris en charge</div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="mt-2 text-sm text-gray-500">Aucun fichier disponible</div>
                                        )}
                                    </div>
                                    {/* Input fichier */}
                                    <div className="mb-2">
                                        <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="file_path">
                                            Document (nouveau fichier)
                                        </label>
                                        <input
                                            id="file_path"
                                            type="file"
                                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                            onChange={(e) => setData('file_path', e.target.files[0])}
                                        />
                                        {errors.file_path && (
                                            <p className="mt-1 text-[10px] text-red-600">{errors.file_path}</p>
                                        )}
                                    </div>

                                    {/* Site & Titre */}
                                    <div className="mb-2">
                                        <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="site_id">Affecter un site</label>
                                        <select
                                            id="site_id"
                                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                            value={data.site_id}
                                            onChange={(e) => setData("site_id", e.target.value)}
                                        >
                                            <option value="">Sélectionner un site</option>
                                            {sites?.length > 0 ? sites.map((site) => (
                                                <option key={site.id} value={site.id}>{site.name}</option>
                                            )) : (
                                                <option disabled>Aucun site disponible</option>
                                            )}
                                        </select>
                                        {errors.site_id && (
                                            <p className="mt-1 text-[10px] text-red-600">{errors.site_id}</p>
                                        )}
                                    </div>

                                    <div className="mb-2">
                                        <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="title">Titre</label>
                                        <input
                                            id="title"
                                            type="text"
                                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                            value={data.title}
                                            onChange={(e) => setData("title", e.target.value)}
                                        />
                                        {errors.title && (
                                            <p className="mt-1 text-[10px] text-red-600">{errors.title}</p>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div className="mb-2">
                                        <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="description">Description</label>
                                        <textarea
                                            id="description"
                                            rows="2"
                                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                            value={data.description}
                                            onChange={(e) => setData("description", e.target.value)}
                                        />
                                        {errors.description && (
                                            <p className="mt-1 text-[10px] text-red-600">{errors.description}</p>
                                        )}
                                    </div>

                                    <div className="mb-2">
                                        <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="document_type">
                                            Type de document
                                        </label>
                                        <select
                                            id="document_type"
                                            name="document_type"
                                            value={data.document_type}
                                            onChange={(e) => setData('document_type', e.target.value)}
                                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                        >
                                            <option value="">-- Sélectionnez un type --</option>
                                            <option value="urbanisme">Informations Urbanistiques</option>
                                            <option value="contrat">Contrats</option>
                                            <option value="fiscalite">Taxes Professionnelles</option>
                                            <option value="autre">Autre</option>
                                        </select>
                                        {errors.document_type && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.document_type}
                                            </p>
                                        )}
                                    </div>

                                    {/* Date expiration */}
                                    <div className="mb-2">
                                        <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="expiration_date">Date d'expiration</label>
                                        <input
                                            id="expiration_date"
                                            type="date"
                                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                            value={data.expiration_date}
                                            onChange={(e) => setData("expiration_date", e.target.value)}
                                        />
                                        {errors.expiration_date && (
                                            <p className="mt-1 text-[10px] text-red-600">{errors.expiration_date}</p>
                                        )}
                                    </div>

                                    {/* Boutons */}
                                    <div className="flex space-x-2 mt-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowEditForm(false)}
                                            className="flex-1 px-2 py-1 text-xs bg-gray-500 text-white rounded-sm hover:bg-gray-600 transition"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className={`flex-1 px-2 py-1 text-xs bg-yellow-100 text-yellow-600 rounded-sm hover:text-yellow-900 transition ${processing ? "opacity-50 cursor-not-allowed" : ""}`}
                                        >
                                            {processing ? "Enregistrement..." : "Mettre à jour le document"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
}
