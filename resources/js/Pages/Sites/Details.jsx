import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React from "react";
import { useWindowWidth } from "@/hooks/useWindowWidth.js";

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

    const Width = useWindowWidth();

    return (
        <div className="max-w-6xl mx-auto px-2 py-2">
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
                                    className={Width < 550 ? "w-full h-54 object-cover" : "w-full h-64 object-cover"}
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
        </div>
    );
}

export default Details;
