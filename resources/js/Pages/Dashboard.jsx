import Authenticated from "@/Layouts/AuthenticatedLayout.jsx";
import { Head } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SIteMap from "@/Components/SIteMap";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from 'leaflet';

// Composant pour centrer la carte sur un site sélectionné
function MapFlyTo({ position, zoom }) {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.flyTo(position, zoom);
        }
    }, [position, zoom, map]);

    return null;
}

export default function Dashboard({ auth, sitesMaps, documents, documentAccess }) {
    const [selectedSite, setSelectedSite] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [mapCenter, setMapCenter] = useState([33.721000, -7.520000]);
    const [mapZoom, setMapZoom] = useState(9);
    const searchRef = useRef(null);

    // Effet pour gérer la visibilité du champ de recherche lors de l'affichage des détails d'un site
    useEffect(() => {
        // Quand un site est sélectionné, fermer également les résultats de recherche
        if (selectedSite) {
            setShowResults(false);
        }
    }, [selectedSite]);

    // Fix pour les icônes Leaflet
    useEffect(() => {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
            iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        });
    }, []);

    // Effet pour fermer les résultats quand on clique à l'extérieur
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchRef]);

    // Fonction de recherche
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.trim() === "") {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        // Filtrer les sites selon le terme de recherche
        const filteredSites = sitesMaps.filter(site =>
            site.name.toLowerCase().includes(value.toLowerCase())
        );

        setSearchResults(filteredSites);
        setShowResults(true);
    };

    // Sélectionner un site depuis la recherche
    const handleSelectSite = (site) => {
        setSelectedSite(site);
        setSearchTerm(site.name);
        setShowResults(false);
        setMapCenter([site.latitude, site.longitude]);
        setMapZoom(15); // Zoom plus proche
    };

    return (
        <Authenticated user={auth.user} header={
            <div className="flex justify-between items-center">
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Cartographie des Sites
                </h2>
            </div>
        }>
            <Head title="Maps" />
            <div className="relative">
                <div className=" mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg relative">
                        <div className="p-4 sm:p-6">
                            <div className="mb-4">
                                <h3 className="font-semibold text-lg text-gray-800">Sites récents</h3>
                            </div>
                            <div className="mb-6">
                                {/* Rendu de la barre de recherche en dehors du flux normal pour contrôler son z-index */}
                                <div className="relative z-[9999]" ref={searchRef}>
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Rechercher un site..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        onFocus={() => searchResults.length > 0 && setShowResults(true)}
                                    />

                                    {/* Liste des résultats de recherche avec z-index très élevé */}
                                    {showResults && searchResults.length > 0 && (
                                        <div className="absolute z-[9999] mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                            {searchResults.map(site => (
                                                <div
                                                    key={site.id}
                                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handleSelectSite(site)}
                                                >
                                                    <div className="font-medium">{site.name}</div>
                                                    {site.address && (
                                                        <div className="text-sm text-gray-600">{site.address}</div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Conteneur principal avec position relative pour que le z-index fonctionne correctement */}
                            <div className="relative" style={{ height: "85vh" }}>
                                {/* Section Carte avec z-index inférieur à celui des suggestions */}
                                <div className="h-full w-full" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }}>
                                    <MapContainer
                                        center={mapCenter}
                                        zoom={mapZoom}
                                        className="h-full w-full"
                                        style={{ height: "100%", width: "100%",borderRadius:"7px"}}
                                    >
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        <MapFlyTo position={mapCenter} zoom={mapZoom} />
                                        {sitesMaps.map((site) => (
                                            <Marker
                                                key={site.id}
                                                title={site.name}
                                                position={[site.latitude, site.longitude]}
                                                eventHandlers={{
                                                    click: () => {
                                                        setSelectedSite(site);
                                                        // setMapCenter([site.latitude, site.longitude]);
                                                        // setMapZoom(15);
                                                    },
                                                }}
                                            />
                                        ))}
                                    </MapContainer>
                                </div>

                                <AnimatePresence>
                                    {selectedSite && (
                                        <div className="fixed inset-0" style={{ pointerEvents: "none", zIndex: 10000 }}>
                                            {/* Overlay semi-transparent avec animation */}
                                            <motion.div
                                                className="absolute inset-0 bg-black bg-opacity-40"
                                                style={{ pointerEvents: "auto" }}
                                                onClick={() => setSelectedSite(null)}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                            />
                                            {/* Panneau latéral avec animation */}
                                            <motion.div
                                                className="absolute right-0 top-0 bottom-0 bg-white sm:w-96 w-full overflow-y-auto rounded-tl-lg shadow-lg"
                                                style={{ pointerEvents: "auto" }}
                                                initial={{ x: "100%" }}
                                                animate={{ x: 0 }}
                                                exit={{ x: "100%" }}
                                                transition={{ duration: 0.3, ease: "easeOut" }}
                                            >
                                                <SIteMap
                                                    auth={auth}
                                                    oncancel={() => setSelectedSite(null)}
                                                    selectedSite={selectedSite}
                                                    documents={documents}
                                                    documentAccess={documentAccess}
                                                />
                                            </motion.div>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
