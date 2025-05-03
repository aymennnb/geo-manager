import Authenticated from "@/Layouts/AuthenticatedLayout.jsx";
import { Head, usePage } from "@inertiajs/react";
import { APIProvider, Map, AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard({ auth, sitesMaps }) {
    const [selectedSite, setSelectedSite] = useState(null);
    const position = { lat: 33.711000, lng: -7.600000 };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <Authenticated user={auth.user} header={
            <div className="flex justify-between items-center">
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Cartographie des Sites
                </h2>
                {/*<div className="bg-white rounded-lg shadow px-3 py-2 text-sm text-gray-600">*/}
                {/*    {sitesMaps.length} sites affichés*/}
                {/*</div>*/}
            </div>
        }>
            <Head title="Maps" />
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-4 sm:p-6">
                            <div className="mb-4">
                                <h3 className="font-semibold text-lg text-gray-800">Sites récents</h3>
                            </div>
                            <div className="mb-6">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Rechercher un site..."
                                    />
                                </div>
                            </div>
                            <div className="relative bg-gray-50 rounded-lg shadow-inner overflow-hidden" style={{ height: "85vh" }}>
                                {/* Section Carte */}
                                <div className="bg-gray-50 rounded-lg shadow-inner overflow-hidden" style={{ height: "85vh" }}>
                                    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                                        <Map
                                            center={position}
                                            zoom={9}
                                            mapId={import.meta.env.VITE_MAP_ID}
                                            style={{ width: "100%", height: "100%" }}
                                            options={{
                                                zoomControl: true,
                                                mapTypeControl: false,
                                                streetViewControl: false,
                                                fullscreenControl: true,
                                            }}
                                        >
                                        {sitesMaps.map((site) => (
                                                <AdvancedMarker
                                                    key={site.id}
                                                    position={{
                                                        lat: parseFloat(site.latitude),
                                                        lng: parseFloat(site.longitude),
                                                    }}
                                                    title={site.name}
                                                    onClick={() => setSelectedSite(site)}
                                                >
                                                    <div className="bg-orange-500 text-white rounded-full shadow-md hover:bg-orange-600 cursor-pointer transition-all duration-200 flex items-center justify-center" style={{ width: "25px", height: "25px" }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                    </div>
                                                </AdvancedMarker>
                                            ))}
                                        </Map>
                                    </APIProvider>
                                </div>

                                {/* Section Détail du Site */}
                                <div className="w-1/3 h-full p-4 overflow-y-auto border-l border-gray-300 bg-white">
                                    <AnimatePresence>
                                        {selectedSite && (
                                            <>
                                                {/* Overlay semi-transparent */}
                                                <motion.div
                                                    className="fixed inset-0 bg-black bg-opacity-40 z-40"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    onClick={() => setSelectedSite(null)}
                                                />

                                                {/* Panneau latéral */}
                                                <motion.div
                                                    initial={{ x: "100%" }}
                                                    animate={{ x: 0 }}
                                                    exit={{ x: "100%" }}
                                                    transition={{ duration: 0.3 }}
                                                    className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-lg z-50 overflow-y-auto"
                                                >
                                                    <div className="p-4 border-b flex justify-between items-center">
                                                        <h3 className="font-semibold text-lg text-gray-800">
                                                            {selectedSite.name}
                                                        </h3>
                                                        <button
                                                            onClick={() => setSelectedSite(null)}
                                                            className="text-gray-500 hover:text-gray-700"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                    <div className="p-4 space-y-4">
                                                        {selectedSite.image && (
                                                            <img
                                                                src={`/storage/${selectedSite.image}`}
                                                                alt={selectedSite.name}
                                                                className="w-full h-48 object-cover rounded"
                                                            />
                                                        )}
                                                        <div className="text-sm text-gray-700 space-y-2">
                                                            <p><strong>Adresse :</strong><br/> {selectedSite.address || "Non disponible"}</p>
                                                            {selectedSite.phone && <p><strong>Téléphone :</strong><br/> {selectedSite.phone}</p>}
                                                            {selectedSite.email && <p><strong>Email :</strong><br/> {selectedSite.email}</p>}
                                                            {selectedSite.web && (
                                                                <p>
                                                                    <strong>Site web :</strong>{" "}<br/>
                                                                    <a
                                                                        href={selectedSite.web}
                                                                        className="text-blue-600 hover:underline"
                                                                        target="_blank"
                                                                    >
                                                                        {selectedSite.web.replace(/^https?:\/\//, "")}
                                                                    </a>
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
