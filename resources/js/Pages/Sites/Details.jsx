import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React from "react";
import { useWindowWidth } from "@/hooks/useWindowWidth.js";

function Details({ auth, site, siteDetails,surfaces,locations, documents, setShowDetailModal }) {
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

    const typeLabels = {
        location: "Loué",
        propre: "Propriété",
    };

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
                                            : "-" }
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Création</p>
                                    <p className="font-medium">
                                        {formatDate(siteDetails.created_at)}
                                    </p>
                                </div>

                                <div >
                                    <p className="text-gray-500 text-sm">Dernière mise à jour</p>
                                    <p className="font-medium">
                                        {formatDate(siteDetails.updated_at)}
                                    </p>
                                </div>

                                {/* Nouveau champs */}
                                <div>
                                    <p className="text-gray-500 text-sm">Ville</p>
                                    <p className="font-medium">{siteDetails.ville || "Aucune ville définie"}</p>
                                </div>

                                <div >
                                    <p className="text-gray-500 text-sm">Titre Foncier</p>
                                    <p className="font-medium">{siteDetails.titre_foncier || "Aucun titre foncier défini"}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Superficie du terrain</p>
                                    <p className="font-medium">
                                        {siteDetails.superficie_terrain ? siteDetails.superficie_terrain + " m²" : "Aucune superficie du terrain définie"}
                                    </p>
                                </div>

                                <div >
                                    <p className="text-gray-500 text-sm">Zoning Urbanistique</p>
                                    <p className="font-medium">{siteDetails.zoning_urbanistique || "Aucun zoning urbanistique défini"}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Consistance</p>
                                    <p className="font-medium">{siteDetails.consistance || "Aucune consistance définie"}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Surface GLA</p>
                                    <p className="font-medium">{siteDetails.surface_gla ? siteDetails.surface_gla + " m²" : "Aucune surface GLA définie"}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Type de site</p>
                                    <p className="font-medium">
                                        {typeLabels[siteDetails.type_site] || "Aucun type de site défini"}
                                    </p>
                                </div>

                                {/* Informations sur la surface (si présentes) */}
                                {surfaces && (
                                    <>
                                        <div className="col-span-full">
                                            <h3 className="text-lg font-semibold mb-2 text-gray-700">Surfaces détaillées</h3>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm">Total</p>
                                            <p className="font-medium">{surfaces.total ? surfaces.total + ' m²' : 'Aucun'}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm">VN</p>
                                            <p className="font-medium">{surfaces.vn ? surfaces.vn + ' m²' : 'Aucun'}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm">Show Room Dacia</p>
                                            <p className="font-medium">{surfaces.show_room_dacia ? surfaces.show_room_dacia + ' m²' : 'Aucun'}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm">Show Room Renault</p>
                                            <p className="font-medium">{surfaces.show_room_renault ? surfaces.show_room_renault + ' m²' : 'Aucun'}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm">Show Room Nouvelle Marque</p>
                                            <p className="font-medium">{surfaces.show_room_nouvelle_marque ? surfaces.show_room_nouvelle_marque + ' m²' : 'Aucun'}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm">Zone de préparation</p>
                                            <p className="font-medium">{surfaces.zone_de_preparation ? surfaces.zone_de_preparation + ' m²' : 'Aucun'}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm">APV</p>
                                            <p className="font-medium">{surfaces.apv ? surfaces.apv + ' m²' : 'Aucun'}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm">RMS</p>
                                            <p className="font-medium">{surfaces.rms ? surfaces.rms + ' m²' : 'Aucun'}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm">Atelier mécanique</p>
                                            <p className="font-medium">{surfaces.atelier_mecanique ? surfaces.atelier_mecanique + ' m²' : 'Aucun'}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm">Atelier carrosserie</p>
                                            <p className="font-medium">{surfaces.atelier_carrosserie ? surfaces.atelier_carrosserie + ' m²' : 'Aucun'}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm">VO</p>
                                            <p className="font-medium">{surfaces.vo ? surfaces.vo + ' m²' : 'Aucun'}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm">Parking</p>
                                            <p className="font-medium">{surfaces.parking ? surfaces.parking + ' m²' : 'Aucun'}</p>
                                        </div>
                                    </>
                                )}

                                {/* Informations sur la location (si présentes) */}
                                {locations && (
                                    <>
                                            <div className="col-span-full">
                                                <h3 className="text-lg font-semibold mb-2 text-gray-700">Informations de location</h3>
                                            </div>
                                            {locations.exploitant && (
                                                <div>
                                                    <p className="text-gray-500 text-sm">Exploitant</p>
                                                    <p className="font-medium">{locations.exploitant}</p>
                                                </div>
                                            )}
                                            {locations.bailleur && (
                                                <div>
                                                    <p className="text-gray-500 text-sm">Bailleur</p>
                                                    <p className="font-medium">{locations.bailleur}</p>
                                                </div>
                                            )}
                                            {locations.date_effet && (
                                                <div>
                                                    <p className="text-gray-500 text-sm">Date d'effet</p>
                                                    <p className="font-medium">{new Date(locations.date_effet).toLocaleDateString()}</p>
                                                </div>
                                            )}
                                            {locations.duree_bail && (
                                                <div>
                                                    <p className="text-gray-500 text-sm">Durée du bail</p>
                                                    <p className="font-medium">{locations.duree_bail} ans</p>
                                                </div>
                                            )}
                                            {locations.loyer_actuel && (
                                                <div>
                                                    <p className="text-gray-500 text-sm">Loyer actuel</p>
                                                    <p className="font-medium">{locations.loyer_actuel} MAD</p>
                                                </div>
                                            )}
                                            {locations.taux_revision && (
                                                <div>
                                                    <p className="text-gray-500 text-sm">Taux de révision</p>
                                                    <p className="font-medium">{locations.taux_revision} %</p>
                                                </div>
                                            )}
                                            {locations.prochaine_revision && (
                                                <div>
                                                    <p className="text-gray-500 text-sm">Prochaine révision</p>
                                                    <p className="font-medium">{new Date(locations.prochaine_revision).toLocaleDateString()}</p>
                                                </div>
                                            )}
                                    </>
                                )}


                            </div>
                        </div>
                    </div>
                </div>
                {/*{import.meta.env.DEV && (*/}
                {/*    <div className="mt-4 p-2 bg-gray-100 rounded">*/}
                {/*        <p>Données du formulaire:</p>*/}
                {/*        <pre>{JSON.stringify(siteDetails, null, 2)}</pre>*/}
                {/*        <pre>{JSON.stringify(surfaces, null, 2)}</pre>*/}
                {/*        <pre>{JSON.stringify(locations, null, 2)}</pre>*/}
                {/*    </div>*/}
                {/*)}*/}
            </div>
        </div>
    );
}

export default Details;
