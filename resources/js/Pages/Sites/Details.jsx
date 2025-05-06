import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React from "react";

function Details({ auth, site, siteDetails, documents, setShowDetailModal }) {
    // Format de date réutilisable
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
        <div className="max-w-6xl mx-auto px-4 py-6">
            {/* En-tête avec nom du site */}
            <div className="bg-white rounded-lg shadow mb-6">
                <div className="bg-blue-600 rounded-t-lg p-4">
                    <h2 className="text-xl font-bold text-white">{siteDetails.name}</h2>
                </div>

                {/* Informations du site */}
                <div className="md:flex">
                    {/* Image du site */}
                    <div className="md:w-2/5 p-4">
                        <div className="rounded-lg overflow-hidden shadow bg-gray-100">
                            {siteDetails.image ? (
                                <img
                                    src={"/storage/" + siteDetails.image}
                                    alt={siteDetails.name}
                                    className="w-full h-64 object-cover"
                                />
                            ) : (
                                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-400">Aucune image disponible</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Détails du site */}
                    <div className="md:w-3/5 p-4">
                        <div className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <p className="text-gray-500 text-sm">Adresse</p>
                                    <p className="font-medium">{siteDetails.address || "-"}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Site web</p>
                                    {siteDetails.web ? (
                                        <a
                                            href={siteDetails.web}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline font-medium"
                                        >
                                            {siteDetails.web}
                                        </a>
                                    ) : (
                                        <p className="font-medium">-</p>
                                    )}
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Téléphone</p>
                                    <p className="font-medium">{siteDetails.phone || "-"}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Email</p>
                                    <p className="font-medium">{siteDetails.email || "-"}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Coordonnées</p>
                                    <p className="font-medium">
                                        {siteDetails.latitude && siteDetails.longitude
                                            ? `${siteDetails.latitude}, ${siteDetails.longitude}`
                                            : "-"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Création</p>
                                    <p className="font-medium">
                                        {formatDate(siteDetails.created_at)}
                                    </p>
                                </div>

                                <div className="md:col-span-2">
                                    <p className="text-gray-500 text-sm">Dernière mise à jour</p>
                                    <p className="font-medium">
                                        {formatDate(siteDetails.updated_at)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Documents liés */}
            <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="bg-blue-600 w-1 h-6 mr-2 rounded"></span>
                    Documents liés à ce site
                </h3>

                {documents.filter((doc) => doc.site_id === siteDetails.id).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {documents
                            .filter((doc) => doc.site_id === siteDetails.id)
                            .map((doc) => {
                                // Détermine l'icône en fonction du type de fichier
                                let fileTypeIcon = null;
                                if (doc.file_path) {
                                    if (doc.file_path.match(/\.(pdf)$/i)) {
                                        fileTypeIcon = (
                                            <div className="bg-red-100 text-red-600 p-2 rounded-full">PDF</div>
                                        );
                                    } else if (doc.file_path.match(/\.(jpg|jpeg|png|gif)$/i)) {
                                        fileTypeIcon = (
                                            <div className="bg-blue-100 text-blue-600 p-2 rounded-full">IMG</div>
                                        );
                                    } else if (doc.file_path.match(/\.(doc|docx)$/i)) {
                                        fileTypeIcon = (
                                            <div className="bg-blue-100 text-blue-600 p-2 rounded-full">DOC</div>
                                        );
                                    } else if (doc.file_path.match(/\.(xls|xlsx|csv)$/i)) {
                                        fileTypeIcon = (
                                            <div className="bg-green-100 text-green-600 p-2 rounded-full">XLS</div>
                                        );
                                    } else {
                                        fileTypeIcon = (
                                            <div className="bg-gray-100 text-gray-600 p-2 rounded-full">FILE</div>
                                        );
                                    }
                                }

                                return (
                                    <div
                                        key={doc.id}
                                        className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
                                    >
                                        <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                                            {fileTypeIcon}
                                            <span className="text-xs text-gray-500">
                                                {new Date(doc.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="p-4">
                                            <h4 className="font-medium text-gray-800 mb-2 truncate">{doc.title}</h4>
                                            {doc.description && (
                                                <p className="text-sm text-gray-500 mb-4 line-clamp-2 h-10">
                                                    {doc.description}
                                                </p>
                                            )}
                                            <div className="mt-2 flex justify-end">
                                                <a
                                                    href={`/storage/${doc.file_path}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                                                >
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    Consulter
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                ) : (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                        <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                        <p className="mt-4 text-gray-500">Aucun document lié à ce site pour le moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Details;
