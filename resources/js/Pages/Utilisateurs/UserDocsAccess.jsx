import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";
import { useWindowWidth } from "@/hooks/useWindowWidth.js";

export default function UserDocsAccess({ auth, userId, users, documents, userDocumentsAccess, setShowAccessModal }) {
    const { data, setData, post, processing, errors } = useForm({
        user_id: userId,
        documents: [], // Initialize as empty array
        searchTerm: ""
    });

    const Width = useWindowWidth();

    // État pour stocker les documents filtrés
    const [filteredDocuments, setFilteredDocuments] = useState(documents || []);

    // S'assurer que data.documents est toujours initialisé correctement
    useEffect(() => {
        // userDocumentsAccess should be an array of document IDs
        if (Array.isArray(userDocumentsAccess)) {
            setData("documents", userDocumentsAccess);
        } else {
            console.warn("userDocumentsAccess is not an array:", userDocumentsAccess);
            setData("documents", []);
        }
    }, [userDocumentsAccess]);

    // Filtrer les documents en fonction du terme de recherche
    useEffect(() => {
        if (!documents) return;

        // Appliquer uniquement le filtre de recherche sans mélanger avec les documents sélectionnés
        if (data.searchTerm) {
            const filtered = documents.filter(document =>
                document.title && document.title.toLowerCase().includes(data.searchTerm.toLowerCase())
            );
            setFilteredDocuments(filtered);
        } else {
            // Si pas de terme de recherche, montrer tous les documents
            setFilteredDocuments(documents);
        }
    }, [data.searchTerm, documents]);

    // Initialiser les documents filtrés
    useEffect(() => {
        if (documents) {
            setFilteredDocuments(documents);
        }
    }, [documents]);

    // Gestionnaire pour le champ de recherche
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    // Gérer la sélection des documents
    const handleSelect = (e) => {
        const documentId = parseInt(e.target.value, 10);
        const isChecked = e.target.checked;

        // S'assurer que data.documents est un tableau avant de le manipuler
        const currentDocs = Array.isArray(data.documents) ? [...data.documents] : [];

        if (isChecked) {
            // Ajouter l'ID du document s'il n'existe pas déjà
            if (!currentDocs.includes(documentId)) {
                setData("documents", [...currentDocs, documentId]);
            }
        } else {
            // Supprimer l'ID du document
            setData("documents", currentDocs.filter(id => id !== documentId));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("utilisateurs.updateAccessDocs"), {
            onSuccess: () => {
                setShowAccessModal(false);
            },
            onError: (errors) => {
                console.error("Errors:", errors);
                toast.error("Une erreur est survenue lors de la mise à jour des accès");
            }
        });
    };

    // Trouver l'utilisateur concerné
    const user = auth?.user;

    // Vérifier si un document est sélectionné
    const isDocumentSelected = (docId) => {
        return Array.isArray(data.documents) && data.documents.includes(docId);
    };

    return (
        <div>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6">
                        <h3 className="text-lg font-medium mb-4">Sélectionner les documents</h3>

                        {/* Affichage des documents sélectionnés */}
                        <div className="mb-4">
                            <label className="block mb-2">
                                Documents sélectionnés pour l'utilisateur <b>{users.find((u)=>u.id===userId)?.name}</b>{" "}
                                ({Array.isArray(data.documents) ? data.documents.length : 0}) :
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {data.documents.length > 0 ? (
                                    data.documents.map((docId) => {
                                        const doc = documents.find(d => d.id === docId);
                                        return (
                                            <div key={docId} className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
                                                {doc?.title || "Document introuvable"}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-gray-500"><span className="italic text-gray-400">Aucun document sélectionné</span></p>
                                )}
                            </div>
                        </div>

                        {/* Champ de recherche */}
                        <div className="mb-4">
                            <div className="relative flex-1">
                                {/* Icône de recherche */}
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>

                                {/* Champ de recherche */}
                                <input
                                    style={{ height: '33px' }}
                                    type="text"
                                    name="searchTerm"
                                    value={data.searchTerm}
                                    onChange={handleFilterChange}
                                    className="block w-full pl-10 pr-8 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Rechercher par nom de document..."
                                />

                                {/* Bouton X (réinitialisation) */}
                                {data.searchTerm && (
                                    <div
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                        onClick={() => handleFilterChange({ target: { name: 'searchTerm', value: '' } })}
                                    >
                                        <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="border rounded p-4 mb-4 max-h-60 overflow-y-auto">
                                {filteredDocuments.length > 0 ? (
                                    filteredDocuments.map((document) => (
                                        <div key={document.id} className="checkbox-container mb-2">
                                            <input
                                                type="checkbox"
                                                name="documents"
                                                id={`document-${document.id}`}
                                                value={document.id}
                                                checked={isDocumentSelected(document.id)}
                                                onChange={handleSelect}
                                                className="mr-2"
                                            />
                                            <label htmlFor={`document-${document.id}`}>{document.title}</label>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500"><span className="italic text-gray-400">Aucun document trouvé.</span></p>
                                )}
                            </div>

                            {errors.documents && (
                                <div className="text-red-500 mb-4">{errors.documents}</div>
                            )}

                            {
                                Width > 550 ? (
                                    <div className="flex justify-end space-x-2 mb-3">
                                        <button
                                            type="button"
                                            onClick={() => setData("documents", [])}
                                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                                        >
                                            Révoquer tous les accès
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowAccessModal(false)}
                                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                            disabled={processing}
                                        >
                                            {processing ? "Enregistrement..." : "Enregistrer les modifications"}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex justify-end space-x-2 mb-3">
                                        <button
                                            type="button"
                                            onClick={() => setData("documents", [])}
                                            className="px-2 py-1 text-xs bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                                        >
                                            Révoquer l'access
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowAccessModal(false)}
                                            className="px-1 py-1 text-xs bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-1 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                                            disabled={processing}
                                        >
                                            {processing ? "Enregistrement..." : "Enregistrer les modifications"}
                                        </button>
                                    </div>
                                )
                            }
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
