import Authenticated from "@/Layouts/AuthenticatedLayout.jsx";
import { Head, useForm } from "@inertiajs/react";
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
    const { data, setData, post, processing, errors } = useForm({
        user_id: auth.user.id,
        role: auth.user.role,
        action: 'consultation',
        type: 'site',
        message: '',
    });

    const [selectedSite, setSelectedSite] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [mapCenter, setMapCenter] = useState([33.721000, -7.520000]);
    const [mapZoom, setMapZoom] = useState(9);
    const searchRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);
    const [pendingAlert, setPendingAlert] = useState(null);

    // Nouvel useEffect pour gérer l'envoi d'alertes en attente
    useEffect(() => {
        if (pendingAlert) {
            post(route('alert.create'), pendingAlert);
            setPendingAlert(null);
        }
    }, [pendingAlert, post]);

    // Détecte la taille de l'écran pour ajuster l'interface mobile/desktop
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Vérification initiale
        checkScreenSize();

        // Ajouter un écouteur pour les changements de taille d'écran
        window.addEventListener('resize', checkScreenSize);

        // Nettoyer l'écouteur
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

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

    // Fonction pour gérer le clic sur un marqueur
    const handleMarkerClick = (site) => {
        // Mise à jour immédiate du site sélectionné
        setSelectedSite(site);
        // Centrer la carte sur le site sélectionné
        setMapCenter([site.latitude, site.longitude]);

        // Construction du message d'alerte
        const message = `a consulté les informations du site ${site.name} qui a l'id ${site.id}.`;

        // Mettre à jour l'état avec le message pour cohérence
        setData('message', message);

        // Créer un objet avec toutes les données d'alerte
        const alertData = {
            user_id: auth.user.id,
            role: auth.user.role,
            action: 'consultation',
            type: 'site',
            message: message,
        };

        setPendingAlert(alertData);
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
            <div className="relative w-full">
                <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg relative">
                        <div className="p-3 sm:p-5">
                            <div className="mb-3 sm:mb-4">
                                <h3 className="font-semibold text-base sm:text-lg text-gray-800">Sites récents</h3>
                            </div>
                            {/* La barre de recherche n'est visible que lorsqu'aucun site n'est sélectionné */}
                            <div className="mb-4 sm:mb-6">
                                {/* Barre de recherche responsive */}
                                <div className="relative z-[1001]" ref={searchRef}>
                                    <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                                        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-1 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-base"
                                        placeholder="Rechercher un site..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        onFocus={() => searchResults.length > 0 && setShowResults(true)}
                                    />

                                    {/* Bouton de réinitialisation */}
                                    {searchTerm && (
                                        <div
                                            className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center cursor-pointer"
                                            onClick={() => {
                                                setSearchTerm('');
                                                setSearchResults([]);
                                                setShowResults(false);
                                            }}
                                        >
                                            <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Liste des résultats de recherche responsive */}
                                    {showResults && searchResults.length > 0 && (
                                        <div className="absolute z-[1002] mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 sm:max-h-60 overflow-auto">
                                            {searchResults.map(site => (
                                                <div
                                                    key={site.id}
                                                    className="p-1.5 sm:p-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handleSelectSite(site)}
                                                >
                                                    <div className="font-medium text-sm sm:text-base">{site.name}</div>
                                                    {site.address && (
                                                        <div className="text-xs sm:text-sm text-gray-600 truncate">{site.address}</div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Conteneur principal avec hauteur responsive */}
                            <div className="relative" style={{ height: isMobile ? "70vh" : "85vh" }}>
                                {/* Section Carte */}
                                <div className="h-full w-full" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }}>
                                    <MapContainer
                                        center={mapCenter}
                                        zoom={mapZoom}
                                        className="h-full w-full"
                                        style={{ height: "100%", width: "100%", borderRadius: "7px" }}
                                        zoomControl={!isMobile}
                                    >
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        {/* Sur mobile, placer les contrôles de zoom en haut à droite */}
                                        {isMobile && (
                                            <div className="leaflet-top leaflet-right">
                                                <div className="leaflet-control-zoom leaflet-bar leaflet-control">
                                                    <a className="leaflet-control-zoom-in" href="#" title="Zoom in" role="button" aria-label="Zoom in" aria-disabled="false">+</a>
                                                    <a className="leaflet-control-zoom-out" href="#" title="Zoom out" role="button" aria-label="Zoom out" aria-disabled="false">−</a>
                                                </div>
                                            </div>
                                        )}
                                        <MapFlyTo position={mapCenter} zoom={mapZoom} />
                                        {sitesMaps.map((site) => (
                                            <Marker
                                                key={site.id}
                                                title={site.name}
                                                position={[site.latitude, site.longitude]}
                                                eventHandlers={{
                                                    click: () => handleMarkerClick(site),
                                                }}
                                            />
                                        ))}
                                    </MapContainer>
                                </div>

                                <AnimatePresence>
                                    {selectedSite && (
                                        <div className="fixed inset-0" style={{ pointerEvents: "none", zIndex: 1100 }}>
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
                                            {/* Panneau latéral avec animation - plein écran sur mobile, latéral sur desktop */}
                                            <motion.div
                                                className={`absolute ${isMobile ? 'inset-0' : 'right-0 top-0 bottom-0 max-w-md'} bg-white overflow-y-auto shadow-lg`}
                                                style={{
                                                    pointerEvents: "auto",
                                                    borderRadius: isMobile ? '0' : '8px 0 0 8px',
                                                    width: isMobile ? '100%' : '100%'
                                                }}
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
