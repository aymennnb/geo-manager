import Authenticated from "@/Layouts/AuthenticatedLayout.jsx";
import { Head, useForm } from "@inertiajs/react";
import React, { useState, useEffect, useRef } from "react";
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

// Composant de carte des statistiques
function StatsCard({ title, value, icon, bgColor }) {
    return (
        <div className={`p-4 rounded-lg shadow-sm ${bgColor} text-white`}>
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-medium opacity-75">{title}</h4>
                    <p className="text-2xl font-bold mt-1">{value}</p>
                </div>
                <div className="text-white opacity-75">
                    {icon}
                </div>
            </div>
        </div>
    );
}

// Composant pour afficher un tableau simple
function SimpleTable({ title, headers, data }) {
    return (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <h3 className="font-semibold text-base mb-3">{title}</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {header}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default function Dashboard({ auth, users, surfaces, locations, sitesMaps, documents, documentAccess, alerts }) {
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
    const [showStats, setShowStats] = useState(true); // Changed to true to show stats by default
    const [sideBySide, setSideBySide] = useState(true); // State to control side-by-side display

    useEffect(() => {
        if (pendingAlert) {
            post(route('alert.create'), pendingAlert);
            setPendingAlert(null);
        }
    }, [pendingAlert, post]);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
            setSideBySide(window.innerWidth >= 1200); // Only side by side on larger screens
        };

        checkScreenSize();

        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Effet pour gérer la visibilité du champ de recherche lors de l'affichage des détails d'un site
    useEffect(() => {
        // Quand un site est sélectionné, fermer également les résultats de recherche
        if (selectedSite) {
            setShowResults(false);
        }
    }, [selectedSite]);

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

        const filteredSites = sitesMaps.filter(site => site.name.toLowerCase().includes(value.toLowerCase()));
        setSearchResults(filteredSites);
        setShowResults(true);
    };

    const handleSelectSite = (site) => {
        // !isMobile ? setSelectedSite(site) : null
        setSearchTerm(site.name);
        setShowResults(false);
        setMapCenter([site.latitude, site.longitude]);
        setMapZoom(13);
    };

    // Fonction pour gérer le clic sur un marqueur
    const handleMarkerClick = (site) => {
        setSelectedSite(site);
        setMapCenter([site.latitude, site.longitude]);

        const message = `a consulté les informations du site ${site.name} qui a l'id ${site.id}.`;
        setData('message', message);
        const alertData = {
            user_id: auth.user.id,
            role: auth.user.role,
            action: 'consultation',
            type: 'site',
            message: message,
        };

        setPendingAlert(alertData);
    };

    // Préparation des données pour les statistiques
    const calculateStats = () => {
        // Statistiques des sites
        const totalSites = sitesMaps.length;
        const ownedSites = sitesMaps.filter(site => site.type_site === 'propre').length;
        const rentedSites = sitesMaps.filter(site => site.type_site === 'location').length;

        // Répartition par ville - Grouper les sites par ville
        const sitesByCity = sitesMaps.reduce((acc, site) => {
            const city = (site.ville || 'Non spécifié').toLowerCase();
            if (!acc[city]) acc[city] = 0;
            acc[city]++;
            return acc;
        }, {});

        // Mapping des types de documents stockés vers leurs labels d'affichage
        const documentTypeMapping = {
            'urbanisme': 'Informations Urbanistiques',
            'contrat': 'Contrats',
            'fiscalite': 'Taxes Professionnelles',
            'autre': 'Autre'
        };

        // Statistiques des documents par type de document avec mapping des labels
        const documentTypeCounts = documents.reduce((acc, doc) => {
            const rawType = doc.document_type || 'autre';
            const displayType = documentTypeMapping[rawType] || 'Autre';

            if (!acc[displayType]) acc[displayType] = 0;
            acc[displayType]++;
            return acc;
        }, {});

        // S'assurer que les types spécifiques sont toujours inclus, même avec 0
        const specificDisplayTypes = ['Informations Urbanistiques', 'Contrats', 'Taxes Professionnelles', 'Autre'];
        specificDisplayTypes.forEach(type => {
            if (!documentTypeCounts.hasOwnProperty(type)) {
                documentTypeCounts[type] = 0;
            }
        });

        // Statistiques des utilisateurs par rôle - Compter directement sur le tableau des utilisateurs
        const userRoleCounts = {
            'admin': 0,
            'manager': 0,
            'user': 0
        };

        users.forEach(user => {
            const role = user.role || 'user';
            if (userRoleCounts.hasOwnProperty(role)) {
                userRoleCounts[role]++;
            }
        });

        // Journal des activités récentes (3 derniers) avec noms d'utilisateurs
        const recentAlerts = Array.isArray(alerts)
            ? alerts
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .slice(0, 3)
                .map(alert => {
                    const user = users?.find(u => u.id === alert.user_id);
                    return {
                        ...alert,
                        user_name: user ? user.name : 'Utilisateur inconnu'
                    };
                })
            : [];

        return {
            sites: {
                total: totalSites,
                owned: ownedSites,
                rented: rentedSites,
                byCity: sitesByCity
            },
            documents: {
                total: documents.length,
                byType: documentTypeCounts
            },
            users: userRoleCounts,
            recentAlerts
        };
    };

    const stats = calculateStats();

    const citiesTableData = Object.entries(stats.sites.byCity)
        .sort((a, b) => b[1] - a[1]) // Trier du plus grand au plus petit
        .map(([city, count]) => [city, count]);

    const documentTypesTableData = Object.entries(stats.documents.byType)
        .filter(([_, count]) => count > 0) // Ne montrer que les types avec au moins un document
        .sort((a, b) => b[1] - a[1]) // Trier du plus grand au plus petit
        .map(([type, count]) => [type, count]);

    const usersRolesTableData = Object.entries(stats.users)
        .map(([role, count]) => {
            const roleLabels = {
                'admin': 'Administrateur',
                'manager': 'Manager',
                'user': 'Utilisateur'
            };
            return [roleLabels[role] || role, count];
        });

    // Préparer les données pour le journal des activités
    const recentAlertsData = stats.recentAlerts
        // .filter(alert => {
        //     if (alert.role !== "superadmin") {
        //         return true;
        //     }
        //     return auth.user.role === "superadmin" && alert.user_id === auth.user.id;
        // })
        .map(alert => {
        const user = users.find(u => u.id === alert.user_id);
        const userRole = user?.role || 'inconnu';
        const userName = user?.name || 'Utilisateur inconnu';

        // Formatter le message selon le rôle
        let fullMessage = '';
        if (userRole === 'admin') {
            fullMessage = `L'admin ${userName} ${alert.message}`;
        } else if (userRole === 'manager') {
            fullMessage = `Le manager ${userName} ${alert.message}`;
        } else {
            fullMessage = `${userName} ${alert.message}`;
        }

        return [
            new Date(alert.created_at).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            fullMessage
        ];
    });

    return (
        <Authenticated user={auth.user} header={
            <div className="flex justify-between items-center">
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Cartographie des Sites
                </h2>
            </div>
        }>
            <Head title="Maps" />
            {auth.user.role === "user" ? (
                <div className="relative w-full">
                    <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg relative">
                            <div className="p-3 sm:p-5">
                                <div className="flex justify-between items-center mb-6">
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
                                                <motion.div
                                                    className="absolute inset-0 bg-black bg-opacity-40"
                                                    style={{ pointerEvents: "auto" }}
                                                    onClick={() => setSelectedSite(null)}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                />
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
                                                        filterSurfaces={selectedSite ? surfaces.find((item) => item.site_id === selectedSite.id): null}
                                                        filterLocations={selectedSite ? locations.find((item) => item.sitef_id === selectedSite.id): null}
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
            ) : (
                <div className="relative w-full">
                    <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg relative">
                            <div className="p-3 sm:p-5">
                                {/* Layout principal - side by side or stacked */}
                                <div className={`${sideBySide ? 'grid grid-cols-1 lg:grid-cols-3 gap-6' : ''}`}>
                                    {/* Section statistiques - toujours visible */}
                                    <div className={`${sideBySide ? 'lg:col-span-1' : 'mb-6'}`}>
                                        <div className="statistics-container">
                                            <h3 className="font-semibold text-lg text-gray-800 mb-4">Tableau de bord statistique</h3>
                                            {/* Cartes de statistiques principales */}
                                            <div className="grid grid-cols-2 gap-3 mb-6">
                                                <StatsCard
                                                    title="Total des sites"
                                                    value={stats.sites.total}
                                                    bgColor="bg-blue-500"
                                                    icon={
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                    }
                                                />
                                                <StatsCard
                                                    title="Sites en propriété"
                                                    value={stats.sites.owned}
                                                    bgColor="bg-green-500"
                                                    icon={
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                        </svg>
                                                    }
                                                />
                                                <StatsCard
                                                    title="Sites loués"
                                                    value={stats.sites.rented}
                                                    bgColor="bg-yellow-500"
                                                    icon={
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    }
                                                />
                                                <StatsCard
                                                    title="Total des documents"
                                                    value={stats.documents.total}
                                                    bgColor="bg-purple-500"
                                                    icon={
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2.2z" />
                                                        </svg>
                                                    }
                                                />
                                            </div>

                                            {/* Tableaux de données */}
                                            {(auth.user.role === "admin" || auth.user.role === "superadmin") && (
                                                <SimpleTable
                                                    title="Utilisateurs par rôle"
                                                    headers={["Rôle", "Nombre"]}
                                                    data={usersRolesTableData}
                                                />)}

                                            <SimpleTable
                                                title="Sites par ville"
                                                headers={["Ville", "Nombre de sites"]}
                                                data={citiesTableData}
                                            />

                                            <SimpleTable
                                                title="Documents par type"
                                                headers={["Type de document", "Nombre"]}
                                                data={documentTypesTableData}
                                            />

                                            {(auth.user.role === "admin" || auth.user.role === "superadmin") && (
                                                <SimpleTable
                                                    title="Journal des activités récentes"
                                                    headers={["Date", "Action"]}
                                                    data={recentAlertsData.length > 0 ? recentAlertsData : [["--", "Aucune activité récente"]]}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/* Section Carte */}
                                    <div className={`${sideBySide ? 'lg:col-span-2' : ''}`}>
                                        <div className="mb-3 sm:mb-4">
                                            <h3 className="font-semibold text-base sm:text-lg text-gray-800">Sites récents</h3>
                                        </div>

                                        {/* La barre de recherche */}
                                        <div className="mb-4 sm:mb-6">
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

                                                {/* Liste des résultats de recherche */}
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

                                        {/* Conteneur de la carte avec hauteur responsive */}
                                        <div className="relative" style={{ height: isMobile ? "60vh" : "91%" }}>
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
                                                        <motion.div
                                                            className="absolute inset-0 bg-black bg-opacity-40"
                                                            style={{ pointerEvents: "auto" }}
                                                            onClick={() => setSelectedSite(null)}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                        />
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
                                                                filterSurfaces={selectedSite ? surfaces.find((item) => item.site_id === selectedSite.id): null}
                                                                filterLocations={selectedSite ? locations.find((item) => item.sitef_id === selectedSite.id): null}
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
                    </div>
                </div>
            )}
        </Authenticated>
    );
}
