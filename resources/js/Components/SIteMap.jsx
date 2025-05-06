import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SiteMap({ auth, selectedSite, oncancel, documents, documentAccess }) {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [showArrows, setShowArrows] = useState(false);
    const carouselRef = useRef(null);

    const filteredDocuments = documents.filter(
        (doc) =>
            doc.site_id === selectedSite.id &&
            !documentAccess.find(
                (access) => access.document_id === doc.id && access.user_id === auth.user.id
            )
    );

    useEffect(() => {
        setShowArrows(filteredDocuments.length > 2);
    }, [filteredDocuments]);

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
        const scrollAmount = 300; // Ajuster selon la largeur des cartes

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
        <div className="flex flex-col bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
            <div className="p-4 border-b flex justify-between items-center bg-orange-500 text-white rounded-t-lg">
                <h3 className="font-semibold text-lg">
                    {selectedSite.name}
                </h3>
                <button
                    onClick={oncancel}
                    className="text-white hover:text-gray-200"
                >
                    ✕
                </button>
            </div>

            <div className="p-4 space-y-6">
                {selectedSite.image && (
                    <img
                        src={`/storage/${selectedSite.image}`}
                        alt={selectedSite.name}
                        className="w-full h-58 object-cover rounded"
                    />
                )}

                <div className="md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div className="space-y-2">
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

                {filteredDocuments.length > 0 && (
                    <div className="mt-6">
                        <h4 className="font-semibold text-gray-800 mb-3">Documents disponibles</h4>

                        <div className="relative">
                            {showArrows && scrollPosition > 0 && (
                                <button
                                    onClick={() => scroll("left")}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-10"
                                >
                                    <ChevronLeft size={24} className="text-gray-500" />
                                </button>
                            )}

                            <div
                                ref={carouselRef}
                                className="flex overflow-x-auto scrollbar-hide gap-4 py-2 px-1"
                                onScroll={handleScroll}
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                                {filteredDocuments.map((doc, index) => (
                                    <div
                                        key={index}
                                        className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h5 className="font-medium text-gray-800 text-sm">{doc.title}</h5>
                                                {/*{doc.updated_at && (*/}
                                                {/*    <p className="text-xs text-gray-500 mt-1">*/}
                                                {/*        Mis à jour le {formatDate(doc.updated_at)}*/}
                                                {/*    </p>*/}
                                                {/*)}*/}
                                            </div>
                                        </div>

                                        <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                                            {doc.description || "Aucune description"}
                                        </p>

                                        <a
                                            href={`/storage/${doc.path}`}
                                            target="_blank"
                                            className="inline-flex items-center mt-3 px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full hover:bg-blue-100"
                                        >
                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                            </svg>
                                            Consulter
                                        </a>
                                    </div>
                                ))}
                            </div>

                            {showArrows && (
                                <button
                                    onClick={() => scroll("right")}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-10"
                                >
                                    <ChevronRight size={24} className="text-gray-500" />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {filteredDocuments.length === 0 && (
                    <div className="mt-6">
                        <h4 className="font-semibold text-gray-800 mb-4">Documents disponibles</h4>
                        <div className="m-3">
                            <div className="bg-gray-50 rounded-lg p-6 text-center">
                                <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                </svg>
                                <p className="mt-4 text-gray-500">Aucun document lié à ce site pour le moment.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
