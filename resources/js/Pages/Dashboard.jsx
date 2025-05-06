import Authenticated from "@/Layouts/AuthenticatedLayout.jsx";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SIteMap from "@/Components/SIteMap";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "../../../public/marker-icon.png";

export default function Dashboard({ auth, sitesMaps, documents, documentAccess }) {
    const [selectedSite, setSelectedSite] = useState(null);

    const customIcon = new Icon({
        iconUrl: markerIcon,
        iconSize: [38, 38]
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
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-4 sm:p-6">
                            <div className="mb-4">
                                <h3 className="font-semibold text-lg text-gray-800">Sites récents</h3>
                            </div>
                            <div className="relative bg-gray-50 rounded-lg shadow-inner overflow-hidden" style={{ height: "85vh" }}>
                                {/* Section Carte */}
                                <div className="h-[600px] w-full">
                                    <MapContainer
                                        center={[33.821000, -7.710000]}
                                        zoom={8}
                                        className="h-full w-full"
                                        style={{ height: "100%", width: "100%" }}
                                    >
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        {sitesMaps.map((site) => (
                                            <Marker
                                                key={site.id}
                                                position={[site.latitude, site.longitude]}
                                                // icon={customIcon}
                                                eventHandlers={{
                                                    click: () => {
                                                        setSelectedSite(site);
                                                    },
                                                }}
                                            />
                                        ))}
                                    </MapContainer>
                                </div>

                                {/* Panneau d'affichage des détails du site avec animation */}
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
                                                className="fixed top-0 right-0 h-full w-full rounded-tl-lg rounded-tr-lg sm:w-96 bg-white shadow-lg z-50 overflow-y-auto"
                                            >
                                                <SIteMap
                                                    auth={auth}
                                                    oncancel={() => setSelectedSite(null)}
                                                    selectedSite={selectedSite}
                                                    documents={documents}
                                                    documentAccess={documentAccess}
                                                />
                                            </motion.div>
                                        </>
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
