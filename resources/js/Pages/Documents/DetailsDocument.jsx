import React from "react";
import { Head } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";

export default function DetailsDocument({ auth, document, setshowDetailModal, sites, users }) {
    // Format de date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="max-w-5xl mx-auto px-1 py-2">
            <div className="bg-white shadow rounded-lg overflow-hidden">
                {/* En-tête */}
                <div className="bg-blue-100 p-4">
                    <h2 className="text-xl font-semibold text-blue-600">{document.title}</h2>
                </div>

                {/* Contenu principal */}
                <div className="md:flex">
                    {/* Aperçu du document */}
                    <div className="md:w-2/3 p-4 border-b md:border-b-0 md:border-r border-gray-200">
                        <h3 className="text-lg font-medium text-gray-800 mb-3">Aperçu du document</h3>

                        <div className="bg-gray-50 rounded border border-gray-200">
                            {document.file_path ? (
                                <>
                                    {document.file_path.match(/\.(pdf)$/i) ? (
                                        <iframe
                                            src={`/storage/${document.file_path}`}
                                            width="100%"
                                            height="500px"
                                            title="Aperçu PDF"
                                            className="rounded"
                                        />
                                    ) : document.file_path.match(/\.(jpg|jpeg|png)$/i) ? (
                                        <div className="flex justify-center p-2">
                                            <img
                                                src={`/storage/${document.file_path}`}
                                                alt="Aperçu image"
                                                className="max-h-80 object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center">
                                            <p className="text-gray-600">Aperçu non disponible</p>
                                            <a
                                                href={`/storage/${document.file_path}`}
                                                className="mt-3 inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded hover:text-blue-900"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Télécharger le fichier
                                            </a>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    Aucun fichier disponible
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Détails du document */}
                    <div className="md:w-1/3 p-4 bg-gray-50">
                        <h3 className="text-lg font-medium text-gray-800 mb-3">Informations</h3>

                        <div className="space-y-3 text-sm">
                            <div>
                                <h4 className="font-medium text-gray-700">Description</h4>
                                <p className="text-gray-600 mt-1">
                                    {document.description || <span className="italic text-gray-400">Aucune description</span>}
                                </p>
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-700">Site associé</h4>
                                <p className="text-gray-600 mt-1">
                                    {sites.find(site => site.id === document.site_id)?.name || 'Non trouvé'}
                                </p>
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-700">Ajouté par</h4>
                                <p className="text-gray-600 mt-1">
                                    {users.find(user => Number(user.id) === Number(document.uploaded_by))?.name || 'Non trouvé'}
                                </p>
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-700">Dates</h4>
                                <div className="text-gray-600 mt-1">
                                    <div>Création: {formatDate(document.created_at)}</div>
                                    <div>Mise à jour: {formatDate(document.updated_at)}</div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <a
                                    href={`/storage/${document.file_path}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full block text-center px-3 py-2 bg-blue-100 text-blue-600 rounded hover:text-blue-900"
                                >
                                    Voir / Télécharger
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
