import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function SiteMap({ auth, selectedSite, oncancel, documents, documentAccess }) {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [showArrows, setShowArrows] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const carouselRef = useRef(null);

    // Détecte si l'appareil est mobile
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

    const filteredDocuments = documents.filter((doc) => {
        const isSiteMatch = doc.site_id === selectedSite.id;
        const hasAccess = documentAccess.find(
            (access) => access.document_id === doc.id && access.user_id === auth.user.id
        );
        const isAdmin = auth.user.role === "admin";
        return isSiteMatch && (hasAccess || isAdmin);
    });

    useEffect(() => {
        // Sur mobile, montrer les flèches si plus d'un document
        // Sur desktop, montrer les flèches si plus de 2 documents
        setShowArrows(isMobile ? filteredDocuments.length > 1 : filteredDocuments.length > 2);
    }, [filteredDocuments, isMobile]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const scroll = (direction) => {
        const container = carouselRef.current;
        // Ajuster la quantité de défilement en fonction de la taille de l'écran
        const scrollAmount = isMobile ? 200 : 300;

        if (container) {
            if (direction === "left") {
                container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
            } else {
                container.scrollBy({ left: scrollAmount, behavior: "smooth" });
            }

            setScrollPosition(container.scrollLeft);
        }
    };

    const handleScroll = () => {
        if (carouselRef.current) {
            setScrollPosition(carouselRef.current.scrollLeft);
        }
    };

    return (
        <div className="flex flex-col bg-white rounded-lg shadow-lg max-w-full mx-auto h-full">
            <div className="p-2 sm:p-4 border-b flex justify-between items-center bg-[#301454] text-orange-500 rounded-t-lg">
                <h3 className="px-3 py-2 font-semibold text-base sm:text-lg truncate max-w-[80%]">
                    {selectedSite.name}
                </h3>
                <button
                    onClick={oncancel}
                    className="text-white hover:text-gray-200 p-1"
                    aria-label="Fermer"
                >
                    <X size={isMobile ? 18 : 20} />
                </button>
            </div>

            <div className="p-4 sm:p-4 space-y-4 sm:space-y-6 overflow-y-auto flex-grow">
                {selectedSite.image && (
                    <img
                        src={`/storage/${selectedSite.image}`}
                        alt={selectedSite.name}
                        className="w-full h-auto object-cover rounded"
                    />
                )}

                <div className="space-y-2 text-xs sm:text-sm text-gray-700">
                    <div className="space-y-2 sm:space-y-2">
                        <p><strong>Adresse :</strong><br/> {selectedSite.address || "Non disponible"}</p>
                        {selectedSite.phone && <p><strong>Téléphone :</strong><br/> {selectedSite.phone}</p>}
                        {selectedSite.email && <p><strong>Email :</strong><br/> {selectedSite.email}</p>}
                        {selectedSite.web && (
                            <p>
                                <strong>Site web :</strong>{" "}<br/>
                                <a
                                    href={selectedSite.web}
                                    className="text-blue-600 hover:underline break-words"
                                    target="_blank"
                                >
                                    {selectedSite.web.replace(/^https?:\/\//, "")}
                                </a>
                            </p>
                        )}
                    </div>
                </div>

                {filteredDocuments.length > 0 && (
                    <div className="mt-4 sm:mt-6">
                        <h4 className="font-semibold text-gray-800 mb-3 sm:mb-3 text-sm sm:text-base">Documents liés à ce site</h4>
                        <div className="relative">
                            {showArrows && scrollPosition > 0 && (
                                <button
                                    onClick={() => scroll("left")}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-0.5 sm:p-1 shadow-md z-10"
                                    aria-label="Précédent"
                                >
                                    <ChevronLeft size={isMobile ? 18 : 24} className="text-gray-500" />
                                </button>
                            )}

                            <div
                                ref={carouselRef}
                                className="flex overflow-x-auto scrollbar-hide gap-2 sm:gap-4 py-2 px-1"
                                onScroll={handleScroll}
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                                {filteredDocuments.map((doc, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col justify-between flex-shrink-0 w-2/3 sm:w-64 bg-white rounded-2xl shadow-md p-3 sm:p-4 border border-gray-200 hover:shadow-xl transition duration-300 ease-in-out"
                                    >
                                        <div>
                                            {/* En-tête avec icône */}
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <h5 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-1">
                                                        {doc.title}
                                                    </h5>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <p className="text-xs sm:text-sm text-gray-600 mt-2 line-clamp-2">
                                                {doc.description || "Aucune description disponible."}
                                            </p>
                                        </div>

                                        {/* Bouton Consulter */}
                                        <a
                                            href={`/storage/${doc.path}`}
                                            target="_blank"
                                            title={`Ouvrir le document "${doc.title}"`}
                                            className="mt-3 w-full justify-center inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-600 text-xs sm:text-sm rounded-full hover:bg-blue-200 transition"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            Consulter
                                        </a>
                                    </div>
                                ))}

                            </div>

                            {showArrows && (
                                <button
                                    onClick={() => scroll("right")}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-0.5 sm:p-1 shadow-md z-10"
                                    aria-label="Suivant"
                                >
                                    <ChevronRight size={isMobile ? 18 : 24} className="text-gray-500" />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {filteredDocuments.length === 0 && (
                    <div className="mt-4 sm:mt-6">
                        <h4 className="font-semibold text-gray-800 mb-2 sm:mb-4 text-sm sm:text-base">Documents liés à ce site</h4>
                        <div className="m-4 sm:m-3">
                            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 text-center">
                                <svg className="w-8 h-8 sm:w-12 sm:h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                </svg>
                                <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500">Aucun document lié à ce site pour le moment.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
