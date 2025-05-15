import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React from "react";
import { useWindowWidth } from "@/hooks/useWindowWidth.js";

function Details({ auth, site, siteDetails,users,location, documents, setShowDetailModal }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const selectedLocation = siteDetails.type_site === "location"
        ? location.find(loc => Number(loc.sitef_id) === Number(siteDetails.id))
        : null;

    const Width = useWindowWidth();

    // Pour afficher les types en français
    const typeLabels = {
        location: "Loué",
        propre: "Propriété",
    };

    const uploader = React.useMemo(() => {
        return users.find(user => Number(user.id) === Number(siteDetails.uploaded_by))?.name || 'Non trouvé';
    }, [users, siteDetails.uploaded_by]);

    return (
        <div className="max-w-6xl mx-auto px-2 py-2">
            <div className="bg-white rounded-lg shadow mb-6">
                <div className="bg-blue-600 rounded-t-lg p-4">
                    <h2 className="text-xl font-bold text-white">{siteDetails.name}</h2>
                </div>

                <div className="md:flex">
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

                    <div className="md:w-3/5 p-4">
                        <div className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <p className="text-gray-500 text-sm">Ville</p>
                                    <p className="font-medium">{siteDetails.ville || "-"}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Adresse</p>
                                    <p className="font-medium">{siteDetails.adresse || "-"}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Titre Foncier</p>
                                    <p className="font-medium">{siteDetails.titre_foncier || "-"}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Superficie du Terrain</p>
                                    <p className="font-medium">{siteDetails.superficie_terrain} m²</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Zoning Urbanistique</p>
                                    <p className="font-medium">{siteDetails.zoning_urbanistique || "-"}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Consistance</p>
                                    <p className="font-medium">{siteDetails.consistance || "-"}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Superficie GLA</p>
                                    <p className="font-medium">{siteDetails.surface_gla} m²</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Type de Site</p>
                                    <p className="font-medium">
                                        {typeLabels[siteDetails.type_site] || siteDetails.type_site}
                                    </p>
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
                                    <p className="text-gray-500 text-sm">Ajouté par</p>
                                    <p className="font-medium">
                                        {uploader}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Créé le</p>
                                    <p className="font-medium">
                                        {formatDate(siteDetails.created_at)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Dernier mis à jour le</p>
                                    <p className="font-medium">
                                        {formatDate(siteDetails.updated_at)}
                                    </p>
                                </div>
                            </div>

                            {/* Surfaces détaillées */}
                            {siteDetails.surfaces_details && (
                                <div className="mt-6">
                                    <p className="text-gray-700 font-semibold mb-2">Surfaces détaillées</p>
                                    <ul className="list-none space-y-1 text-sm text-gray-600">

                                        {/* TOTAL */}
                                        {siteDetails.surfaces_details["TOTAL"] !== undefined && (
                                            <li>
                                                <span className="font-medium">TOTAL :</span> {siteDetails.surfaces_details["TOTAL"]} m²
                                            </li>
                                        )}

                                        {/* VN */}
                                        {siteDetails.surfaces_details["VN"] !== undefined && (
                                            <li>
                                                <span className="font-medium">VN :</span> {siteDetails.surfaces_details["VN"]} m²
                                            </li>
                                        )}

                                        {/* Sous-éléments de VN */}
                                        {["SHOW ROOM DACIA", "SHOW ROOM RENAULT", "SHOW ROOM NOUVELLE MARQUE", "ZONE DE PREPARATION"].map((key) => (
                                            siteDetails.surfaces_details[key] !== undefined && (
                                                <li key={key} className="ml-4">
                                                    <span className="font-medium">{key} :</span> {siteDetails.surfaces_details[key]} m²
                                                </li>
                                            )
                                        ))}

                                        {/* APV */}
                                        {siteDetails.surfaces_details["APV"] !== undefined && (
                                            <li>
                                                <span className="font-medium">APV :</span> {siteDetails.surfaces_details["APV"]} m²
                                            </li>
                                        )}

                                        {/* Sous-éléments de APV */}
                                        {["RMS", "ATELIER MÉCANIQUE", "ATELIER CARROSSERIE"].map((key) => (
                                            siteDetails.surfaces_details[key] !== undefined && (
                                                <li key={key} className="ml-4">
                                                    <span className="font-medium">{key} :</span> {siteDetails.surfaces_details[key]} m²
                                                </li>
                                            )
                                        ))}

                                        {/* VO */}
                                        {siteDetails.surfaces_details["VO"] !== undefined && (
                                            <li>
                                                <span className="font-medium">VO :</span> {siteDetails.surfaces_details["VO"]} m²
                                            </li>
                                        )}

                                        {/* PARKING */}
                                        {siteDetails.surfaces_details["PARKING"] !== undefined && (
                                            <li>
                                                <span className="font-medium">PARKING :</span> {siteDetails.surfaces_details["PARKING"]} m²
                                            </li>
                                        )}

                                    </ul>
                                </div>
                            )}

                            {/* Informations de location */}
                            {selectedLocation && (
                                <div className="mt-6">
                                    <p className="text-gray-700 font-semibold mb-2">Informations de location</p>
                                    <ul className="list-none space-y-2 text-sm text-gray-700">
                                        <li>
                                            <span className="font-medium">Exploitant :</span> {selectedLocation.exploitant || "-"}
                                        </li>
                                        <li>
                                            <span className="font-medium">Bailleur :</span> {selectedLocation.bailleur || "-"}
                                        </li>
                                        <li>
                                            <span className="font-medium">Date d’effet :</span>{" "}
                                            {selectedLocation.date_effet ? formatDate(selectedLocation.date_effet) : "-"}
                                        </li>
                                        <li>
                                            <span className="font-medium">Durée du bail :</span> {selectedLocation.duree_bail || "-"}
                                        </li>
                                        <li>
                                            <span className="font-medium">Loyer actuel :</span>{" "}
                                            {selectedLocation.loyer_actuel ? `${selectedLocation.loyer_actuel.toLocaleString()} MAD` : "-"}
                                        </li>
                                        <li>
                                            <span className="font-medium">Taux de révision :</span> {selectedLocation.taux_revision || "-"}%
                                        </li>
                                        <li>
                                            <span className="font-medium">Prochaine révision :</span>{" "}
                                            {selectedLocation.prochaine_revision ? formatDate(selectedLocation.prochaine_revision) : "-"}
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {import.meta.env.DEV && (
                    <div className="mt-4 p-2 bg-gray-100 rounded">
                        <p>Données du formulaire:</p>
                        <pre>{JSON.stringify(selectedLocation, null, 2)}</pre>
                        <p>2</p>
                        <pre>{JSON.stringify(siteDetails, null, 2)}</pre>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Details;
