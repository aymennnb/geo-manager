import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { useWindowWidth } from "@/hooks/useWindowWidth.js";

export default function AddSite({ auth, setShowAddForm }) {
    const { data, setData, processing, post, errors } = useForm({
        // Informations de base pour tous les sites
        name: "",
        ville: "",
        adresse: "",
        titre_foncier: "",
        superficie_terrain: "",
        zoning_urbanistique: "",
        consistance: "",
        surface_gla: "",
        latitude: "",
        longitude: "",
        image: null,
        // Type de site
        type_site: "propre",
        // Champs pour les surfaces détaillées
        surfaces_details: {
            "SHOW ROOM DACIA": "",
            "SHOW ROOM RENAULT": "",
            "SHOW ROOM NOUVELLE MARQUE": "",
            "ATELIER MÉCANIQUE": "",
            "ATELIER CARROSSERIE": "",
            "ZONE DE PREPARATION": "",
            "VN": "",
            "VO": "",
            "APV": "",
            "RMS": "",
            "PARKING": "",
            "TOTAL": ""
        },
        // Informations spécifiques pour les sites en location
        exploitant: "",
        bailleur: "",
        date_effet: "",
        duree_bail: "",
        loyer_actuel: "",
        taux_revision: "",
        prochaine_revision: ""
    });

    const Width = useWindowWidth();
    const isDesktop = Width > 930;

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("sites.create"), {
            onSuccess: () => {
                setShowAddForm(false);
            }
        });
    };

    // Mise à jour de la surface totale quand les autres surfaces changent
    useEffect(() => {
        let total = 0;
        Object.entries(data.surfaces_details).forEach(([key, value]) => {
            if (key !== "TOTAL" && value) {
                total += parseFloat(value) || 0;
            }
        });

        // Mettre à jour uniquement si le total calculé est différent de zéro
        if (total > 0) {
            setData("surfaces_details", {
                ...data.surfaces_details,
                "TOTAL": total
            });
        }
    }, [data.surfaces_details]);

    // Fonction pour mettre à jour une surface spécifique
    const updateSurfaceDetail = (key, value) => {
        setData("surfaces_details", {
            ...data.surfaces_details,
            [key]: value
        });
    };

    return (
        <>
            {isDesktop ? (
                // Version desktop
                <div>
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 bg-white border-b border-gray-200">
                                <h3 className="text-lg font-medium mb-4">Fournir les informations du site</h3>
                                <form onSubmit={handleSubmit} encType="multipart/form-data">
                                    {/* Type de site */}
                                    <div className="mb-4">
                                        <label htmlFor="type_site" className="block text-gray-700 text-sm font-bold mb-2">
                                            Type de site
                                        </label>
                                        <select
                                            id="type_site"
                                            value={data.type_site}
                                            onChange={(e) => setData("type_site", e.target.value)}
                                            className="w-full border rounded px-3 py-1"
                                        >
                                            <option value="propre">Propriété</option>
                                            <option value="location">Loué</option>
                                        </select>
                                    </div>

                                    {/* Image du site */}
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

                                    {/* Informations générales */}
                                    <div className="mb-6 flex gap-4">
                                        <div className="w-1/2">
                                            <label htmlFor="name" className="block text-sm font-bold mb-2">Nom du site</label>
                                            <input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                placeholder="Nom du site"
                                                onChange={(e) => setData("name", e.target.value)}
                                                className="w-full border rounded px-3 py-1"
                                            />
                                            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                                        </div>

                                        <div className="w-1/2">
                                            <label htmlFor="ville" className="block text-sm font-bold mb-2">Ville</label>
                                            <input
                                                id="ville"
                                                type="text"
                                                value={data.ville}
                                                placeholder="Ville"
                                                onChange={(e) => setData("ville", e.target.value)}
                                                className="w-full border rounded px-3 py-1"
                                            />
                                            {errors.ville && <p className="text-sm text-red-600 mt-1">{errors.ville}</p>}
                                        </div>
                                    </div>

                                    {/* Adresse et Titre Foncier */}
                                    <div className="mb-6">
                                        <label htmlFor="adresse" className="block text-sm font-bold mb-2">Adresse</label>
                                        <input
                                            id="adresse"
                                            type="text"
                                            value={data.adresse}
                                            placeholder="Adresse complète"
                                            onChange={(e) => setData("adresse", e.target.value)}
                                            className="w-full border rounded px-3 py-1"
                                        />
                                        {errors.adresse && <p className="text-sm text-red-600 mt-1">{errors.adresse}</p>}
                                    </div>

                                    <div className="mb-6 flex gap-4">
                                        <div className="w-1/2">
                                            <label htmlFor="titre_foncier" className="block text-sm font-bold mb-2">Titre foncier</label>
                                            <input
                                                id="titre_foncier"
                                                type="text"
                                                value={data.titre_foncier}
                                                placeholder="Titre foncier"
                                                onChange={(e) => setData("titre_foncier", e.target.value)}
                                                className="w-full border rounded px-3 py-1"
                                            />
                                            {errors.titre_foncier && <p className="text-sm text-red-600 mt-1">{errors.titre_foncier}</p>}
                                        </div>

                                        <div className="w-1/2">
                                            <label htmlFor="superficie_terrain" className="block text-sm font-bold mb-2">Superficie terrain (m²)</label>
                                            <input
                                                id="superficie_terrain"
                                                type="number"
                                                step="0.01"
                                                value={data.superficie_terrain}
                                                placeholder="Superficie du terrain"
                                                onChange={(e) => setData("superficie_terrain", e.target.value)}
                                                className="w-full border rounded px-3 py-1"
                                            />
                                            {errors.superficie_terrain && <p className="text-sm text-red-600 mt-1">{errors.superficie_terrain}</p>}
                                        </div>
                                    </div>

                                    {/* Zoning et Consistance */}
                                    <div className="mb-6 flex gap-4">
                                        <div className="w-1/2">
                                            <label htmlFor="zoning_urbanistique" className="block text-sm font-bold mb-2">Zoning urbanistique</label>
                                            <input
                                                id="zoning_urbanistique"
                                                type="text"
                                                value={data.zoning_urbanistique}
                                                placeholder="Zoning urbanistique"
                                                onChange={(e) => setData("zoning_urbanistique", e.target.value)}
                                                className="w-full border rounded px-3 py-1"
                                            />
                                            {errors.zoning_urbanistique && <p className="text-sm text-red-600 mt-1">{errors.zoning_urbanistique}</p>}
                                        </div>

                                        <div className="w-1/2">
                                            <label htmlFor="consistance" className="block text-sm font-bold mb-2">Consistance</label>
                                            <input
                                                id="consistance"
                                                type="text"
                                                value={data.consistance}
                                                placeholder="Ex: RDC+1 & Terrasse accessible"
                                                onChange={(e) => setData("consistance", e.target.value)}
                                                className="w-full border rounded px-3 py-1"
                                            />
                                            {errors.consistance && <p className="text-sm text-red-600 mt-1">{errors.consistance}</p>}
                                        </div>
                                    </div>

                                    {/* Surface GLA et coordonnées */}
                                    <div className="mb-6 flex gap-4">
                                        <div className="w-1/3">
                                            <label htmlFor="surface_gla" className="block text-sm font-bold mb-2">Surface GLA (m²)</label>
                                            <input
                                                id="surface_gla"
                                                type="number"
                                                step="0.01"
                                                value={data.surface_gla}
                                                placeholder="Surface GLA"
                                                onChange={(e) => setData("surface_gla", e.target.value)}
                                                className="w-full border rounded px-3 py-1"
                                            />
                                            {errors.surface_gla && <p className="text-sm text-red-600 mt-1">{errors.surface_gla}</p>}
                                        </div>

                                        <div className="w-1/3">
                                            <label htmlFor="latitude" className="block text-sm font-bold mb-2">Latitude</label>
                                            <input
                                                id="latitude"
                                                type="number"
                                                step="any"
                                                placeholder="Latitude (ex. 33.5731)"
                                                value={data.latitude}
                                                onChange={(e) => setData("latitude", e.target.value)}
                                                className="w-full border rounded px-3 py-1"
                                            />
                                            {errors.latitude && <p className="text-sm text-red-600 mt-1">{errors.latitude}</p>}
                                        </div>

                                        <div className="w-1/3">
                                            <label htmlFor="longitude" className="block text-sm font-bold mb-2">Longitude</label>
                                            <input
                                                id="longitude"
                                                type="number"
                                                step="any"
                                                placeholder="Longitude (ex. -7.5898)"
                                                value={data.longitude}
                                                onChange={(e) => setData("longitude", e.target.value)}
                                                className="w-full border rounded px-3 py-1"
                                            />
                                            {errors.longitude && <p className="text-sm text-red-600 mt-1">{errors.longitude}</p>}
                                        </div>
                                    </div>

                                    {/* Surfaces détaillées */}
                                    <div className="mb-6">
                                        <h4 className="text-md font-bold mb-2">Surfaces détaillées (m²)</h4>
                                        <div className="grid grid-cols-3 gap-4">
                                            {Object.entries(data.surfaces_details).map(([key, value]) => (
                                                key !== "TOTAL" && (
                                                    <div key={key} className="mb-2">
                                                        <label htmlFor={`surface_${key}`} className="block text-sm font-bold mb-1">{key}</label>
                                                        <input
                                                            id={`surface_${key}`}
                                                            type="number"
                                                            step="0.01"
                                                            value={value}
                                                            placeholder={`Surface ${key}`}
                                                            onChange={(e) => updateSurfaceDetail(key, e.target.value)}
                                                            className="w-full border rounded px-3 py-1"
                                                        />
                                                    </div>
                                                )
                                            ))}
                                            <div className="mb-2">
                                                <label htmlFor="surface_TOTAL" className="block text-sm font-bold mb-1">TOTAL</label>
                                                <input
                                                    id="surface_TOTAL"
                                                    type="number"
                                                    step="0.01"
                                                    value={data.surfaces_details.TOTAL}
                                                    readOnly
                                                    className="w-full border rounded px-3 py-1 bg-gray-100"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Informations spécifiques pour les sites en location */}
                                    {data.type_site === "location" && (
                                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                            <h4 className="text-md font-bold mb-4">Informations de location</h4>

                                            <div className="mb-4 flex gap-4">
                                                <div className="w-1/2">
                                                    <label htmlFor="exploitant" className="block text-sm font-bold mb-2">Exploitant</label>
                                                    <input
                                                        id="exploitant"
                                                        type="text"
                                                        value={data.exploitant}
                                                        placeholder="Exploitant"
                                                        onChange={(e) => setData("exploitant", e.target.value)}
                                                        className="w-full border rounded px-3 py-1"
                                                    />
                                                    {errors.exploitant && <p className="text-sm text-red-600 mt-1">{errors.exploitant}</p>}
                                                </div>

                                                <div className="w-1/2">
                                                    <label htmlFor="bailleur" className="block text-sm font-bold mb-2">Bailleur</label>
                                                    <input
                                                        id="bailleur"
                                                        type="text"
                                                        value={data.bailleur}
                                                        placeholder="Bailleur"
                                                        onChange={(e) => setData("bailleur", e.target.value)}
                                                        className="w-full border rounded px-3 py-1"
                                                    />
                                                    {errors.bailleur && <p className="text-sm text-red-600 mt-1">{errors.bailleur}</p>}
                                                </div>
                                            </div>

                                            <div className="mb-4 flex gap-4">
                                                <div className="w-1/2">
                                                    <label htmlFor="date_effet" className="block text-sm font-bold mb-2">Date d'effet</label>
                                                    <input
                                                        id="date_effet"
                                                        type="date"
                                                        value={data.date_effet}
                                                        onChange={(e) => setData("date_effet", e.target.value)}
                                                        className="w-full border rounded px-3 py-1"
                                                    />
                                                    {errors.date_effet && <p className="text-sm text-red-600 mt-1">{errors.date_effet}</p>}
                                                </div>

                                                <div className="w-1/2">
                                                    <label htmlFor="duree_bail" className="block text-sm font-bold mb-2">Durée du bail</label>
                                                    <input
                                                        id="duree_bail"
                                                        type="text"
                                                        value={data.duree_bail}
                                                        placeholder="Ex: 3 ans"
                                                        onChange={(e) => setData("duree_bail", e.target.value)}
                                                        className="w-full border rounded px-3 py-1"
                                                    />
                                                    {errors.duree_bail && <p className="text-sm text-red-600 mt-1">{errors.duree_bail}</p>}
                                                </div>
                                            </div>

                                            <div className="mb-4 flex gap-4">
                                                <div className="w-1/3">
                                                    <label htmlFor="loyer_actuel" className="block text-sm font-bold mb-2">Loyer actuel (DH)</label>
                                                    <input
                                                        id="loyer_actuel"
                                                        type="number"
                                                        step="0.01"
                                                        value={data.loyer_actuel}
                                                        placeholder="Loyer actuel"
                                                        onChange={(e) => setData("loyer_actuel", e.target.value)}
                                                        className="w-full border rounded px-3 py-1"
                                                    />
                                                    {errors.loyer_actuel && <p className="text-sm text-red-600 mt-1">{errors.loyer_actuel}</p>}
                                                </div>

                                                <div className="w-1/3">
                                                    <label htmlFor="taux_revision" className="block text-sm font-bold mb-2">Taux révision (%)</label>
                                                    <input
                                                        id="taux_revision"
                                                        type="number"
                                                        step="0.01"
                                                        value={data.taux_revision}
                                                        placeholder="Ex: 10"
                                                        onChange={(e) => setData("taux_revision", e.target.value)}
                                                        className="w-full border rounded px-3 py-1"
                                                    />
                                                    {errors.taux_revision && <p className="text-sm text-red-600 mt-1">{errors.taux_revision}</p>}
                                                </div>

                                                <div className="w-1/3">
                                                    <label htmlFor="prochaine_revision" className="block text-sm font-bold mb-2">Prochaine révision</label>
                                                    <input
                                                        id="prochaine_revision"
                                                        type="date"
                                                        value={data.prochaine_revision}
                                                        onChange={(e) => setData("prochaine_revision", e.target.value)}
                                                        className="w-full border rounded px-3 py-1"
                                                    />
                                                    {errors.prochaine_revision && <p className="text-sm text-red-600 mt-1">{errors.prochaine_revision}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-end gap-2 mt-6">
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
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // Version mobile
                <div className="w-full px-2 py-1">
                    <div className="bg-white shadow-sm rounded-md">
                        <div className="p-3">
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                {/* Type de site */}
                                <div className="mb-2">
                                    <label htmlFor="type_site" className="block text-gray-700 text-xs font-bold mb-1">
                                        Type de site
                                    </label>
                                    <select
                                        id="type_site"
                                        value={data.type_site}
                                        onChange={(e) => setData("type_site", e.target.value)}
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                    >
                                        <option value="propre">Propre</option>
                                        <option value="location">Location</option>
                                    </select>
                                </div>

                                {/* Image du site */}
                                <div className="mb-2">
                                    <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="image">
                                        Photo du site (obligatoire)
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

                                {/* Informations générales */}
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
                                        placeholder="Nom du site"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-[10px] text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-2">
                                    <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="ville">
                                        Ville
                                    </label>
                                    <input
                                        id="ville"
                                        type="text"
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                        value={data.ville}
                                        onChange={(e) => setData("ville", e.target.value)}
                                        placeholder="Ville"
                                    />
                                    {errors.ville && (
                                        <p className="mt-1 text-[10px] text-red-600">
                                            {errors.ville}
                                        </p>
                                    )}
                                </div>

                                {/* Adresse */}
                                <div className="mb-2">
                                    <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="adresse">
                                        Adresse
                                    </label>
                                    <input
                                        id="adresse"
                                        type="text"
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                        value={data.adresse}
                                        onChange={(e) => setData("adresse", e.target.value)}
                                        placeholder="Adresse complète"
                                    />
                                    {errors.adresse && (
                                        <p className="mt-1 text-[10px] text-red-600">
                                            {errors.adresse}
                                        </p>
                                    )}
                                </div>

                                {/* Titre foncier et Superficie */}
                                <div className="flex space-x-2 mb-2">
                                    <div className="w-1/2">
                                        <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="titre_foncier">
                                            Titre foncier
                                        </label>
                                        <input
                                            id="titre_foncier"
                                            type="text"
                                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                            value={data.titre_foncier}
                                            onChange={(e) => setData("titre_foncier", e.target.value)}
                                            placeholder="Titre foncier"
                                        />
                                        {errors.titre_foncier && (
                                            <p className="mt-1 text-[10px] text-red-600">
                                                {errors.titre_foncier}
                                            </p>
                                        )}
                                    </div>

                                    <div className="w-1/2">
                                        <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="superficie_terrain">
                                            Superficie terrain (m²)
                                        </label>
                                        <input
                                            id="superficie_terrain"
                                            type="number"
                                            step="0.01"
                                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                            value={data.superficie_terrain}
                                            onChange={(e) => setData("superficie_terrain", e.target.value)}
                                            placeholder="Superficie"
                                        />
                                        {errors.superficie_terrain && (
                                            <p className="mt-1 text-[10px] text-red-600">
                                                {errors.superficie_terrain}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Zoning et Consistance */}
                                <div className="flex space-x-2 mb-2">
                                    <div className="w-1/2">
                                        <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="zoning_urbanistique">
                                            Zoning urbanistique
                                        </label>
                                        <input
                                            id="zoning_urbanistique"
                                            type="text"
                                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                            value={data.zoning_urbanistique}
                                            onChange={(e) => setData("zoning_urbanistique", e.target.value)}
                                            placeholder="Zoning"
                                        />
                                        {errors.zoning_urbanistique && (
                                            <p className="mt-1 text-[10px] text-red-600">
                                                {errors.zoning_urbanistique}
                                            </p>
                                        )}
                                    </div>

                                    <div className="w-1/2">
                                        <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="consistance">
                                            Consistance
                                        </label>
                                        <input
                                            id="consistance"
                                            type="text"
                                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                            value={data.consistance}
                                            onChange={(e) => setData("consistance", e.target.value)}
                                            placeholder="Ex: RDC+1"
                                        />
                                        {errors.consistance && (
                                            <p className="mt-1 text-[10px] text-red-600">
                                                {errors.consistance}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Surface GLA */}
                                <div className="mb-2">
                                    <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="surface_gla">
                                        Surface GLA (m²)
                                    </label>
                                    <input
                                        id="surface_gla"
                                        type="number"
                                        step="0.01"
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                        value={data.surface_gla}
                                        onChange={(e) => setData("surface_gla", e.target.value)}
                                        placeholder="Surface GLA"
                                    />
                                    {errors.surface_gla && (
                                        <p className="mt-1 text-[10px] text-red-600">
                                            {errors.surface_gla}
                                        </p>
                                    )}
                                </div>

                                {/* Latitude et Longitude */}
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
                                            placeholder="Ex: 33.5731"
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
                                            placeholder="Ex: -7.5898"
                                        />
                                        {errors.longitude && (
                                            <p className="mt-1 text-[10px] text-red-600">
                                                {errors.longitude}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Surfaces détaillées */}
                                <div className="mb-2">
                                    <h4 className="text-xs font-bold mb-2">Surfaces détaillées (m²)</h4>

                                    {Object.entries(data.surfaces_details).map(([key, value]) => (
                                        key !== "TOTAL" && (
                                            <div key={key} className="mb-2">
                                                <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor={`surface_${key}`}>
                                                    {key}
                                                </label>
                                                <input
                                                    id={`surface_${key}`}
                                                    type="number"
                                                    step="0.01"
                                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                                    value={value}
                                                    onChange={(e) => updateSurfaceDetail(key, e.target.value)}
                                                    placeholder={`Surface ${key}`}
                                                />
                                            </div>
                                        )
                                    ))}

                                    <div className="mb-2">
                                        <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="surface_TOTAL">
                                            TOTAL
                                        </label>
                                        <input
                                            id="surface_TOTAL"
                                            type="number"
                                            step="0.01"
                                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm bg-gray-100"
                                            value={data.surfaces_details.TOTAL}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                {/* Informations spécifiques pour les sites en location */}
                                {data.type_site === "location" && (
                                    <div className="mt-3 p-2 bg-gray-50 rounded-md">
                                        <h4 className="text-xs font-bold mb-2">Informations de location</h4>

                                        <div className="mb-2">
                                            <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="exploitant">
                                                Exploitant
                                            </label>
                                            <input
                                                id="exploitant"
                                                type="text"
                                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                                value={data.exploitant}
                                                onChange={(e) => setData("exploitant", e.target.value)}
                                                placeholder="Exploitant"
                                            />
                                            {errors.exploitant && (
                                                <p className="mt-1 text-[10px] text-red-600">
                                                    {errors.exploitant}
                                                </p>
                                            )}
                                        </div>

                                        <div className="mb-2">
                                            <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="bailleur">
                                                Bailleur
                                            </label>
                                            <input
                                                id="bailleur"
                                                type="text"
                                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                                value={data.bailleur}
                                                onChange={(e) => setData("bailleur", e.target.value)}
                                                placeholder="Bailleur"
                                            />
                                            {errors.bailleur && (
                                                <p className="mt-1 text-[10px] text-red-600">
                                                    {errors.bailleur}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex space-x-2 mb-2">
                                            <div className="w-1/2">
                                                <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="date_effet">
                                                    Date d'effet
                                                </label>
                                                <input
                                                    id="date_effet"
                                                    type="date"
                                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                                    value={data.date_effet}
                                                    onChange={(e) => setData("date_effet", e.target.value)}
                                                />
                                                {errors.date_effet && (
                                                    <p className="mt-1 text-[10px] text-red-600">
                                                        {errors.date_effet}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="w-1/2">
                                                <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="duree_bail">
                                                    Durée du bail
                                                </label>
                                                <input
                                                    id="duree_bail"
                                                    type="text"
                                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                                    value={data.duree_bail}
                                                    onChange={(e) => setData("duree_bail", e.target.value)}
                                                    placeholder="Ex: 3 ans"
                                                />
                                                {errors.duree_bail && (
                                                    <p className="mt-1 text-[10px] text-red-600">
                                                        {errors.duree_bail}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mb-2">
                                            <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="loyer_actuel">
                                                Loyer actuel (DH)
                                            </label>
                                            <input
                                                id="loyer_actuel"
                                                type="number"
                                                step="0.01"
                                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                                value={data.loyer_actuel}
                                                onChange={(e) => setData("loyer_actuel", e.target.value)}
                                                placeholder="Loyer actuel"
                                            />
                                            {errors.loyer_actuel && (
                                                <p className="mt-1 text-[10px] text-red-600">
                                                    {errors.loyer_actuel}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex space-x-2 mb-2">
                                            <div className="w-1/2">
                                                <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="taux_revision">
                                                    Taux révision (%)
                                                </label>
                                                <input
                                                    id="taux_revision"
                                                    type="number"
                                                    step="0.01"
                                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                                    value={data.taux_revision}
                                                    onChange={(e) => setData("taux_revision", e.target.value)}
                                                    placeholder="Ex: 10"
                                                />
                                                {errors.taux_revision && (
                                                    <p className="mt-1 text-[10px] text-red-600">
                                                        {errors.taux_revision}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="w-1/2">
                                                <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="prochaine_revision">
                                                    Prochaine révision
                                                </label>
                                                <input
                                                    id="prochaine_revision"
                                                    type="date"
                                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                                    value={data.prochaine_revision}
                                                    onChange={(e) => setData("prochaine_revision", e.target.value)}
                                                />
                                                {errors.prochaine_revision && (
                                                    <p className="mt-1 text-[10px] text-red-600">
                                                        {errors.prochaine_revision}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

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
                                        {processing ? "Enregistrement..." : "Ajouter le site"}
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
