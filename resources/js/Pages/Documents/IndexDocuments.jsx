import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import AddDocuments from "@/Pages/Documents/AddDocuments";
import ConfirmSupprimeDocument from "@/Components/ConfirmSupprimeDocument";
import DocumentAcces from "@/Pages/Documents/DocumentAcces";
import EditDocuments from "@/Pages/Documents/EditDocuments";
import DetailsDocument from "@/Pages/Documents/DetailsDocument";
import DocumentsAccesGroup from '@/Pages/Documents/DocumentsAccesGroup';
import ConfirmSuppDOcs from '@/Components/ConfirmSuppDOcs';
import ModalWrapper from "@/Components/ModalWrapper";
import MultiSelectDropdown from "@/Components/MultiSelectDropdown";
import toast from 'react-hot-toast';
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { FaBackward } from "react-icons/fa6";
import { TbZoomReset } from "react-icons/tb";
import { TiDocumentDelete } from "react-icons/ti";
import { FaFileShield } from "react-icons/fa6";
import { BiDetail } from "react-icons/bi";
import { HiDocumentAdd } from "react-icons/hi";
import { MdEditDocument } from "react-icons/md";
import { CiExport } from "react-icons/ci";
import { TbFileTypeCsv } from "react-icons/tb";
import { useWindowWidth } from "@/hooks/useWindowWidth.js";


export default function IndexDocuments({ auth,AccessTable, documents,usersAccess, sites, users, DocumentAccess, flash }) {
    const { data, setData, delete: destroy, post } = useForm({
        document_ids: [],
        searchTerm: '',
        start_date: "", // Date de début pour la création
        end_date: "",   // Date de fin pour la création
        exp_start_date: "", // Date de début pour l'expiration
        exp_end_date: "",    // Date de fin pour l'expiration
        document_type: 'all'
    });

    const width = useWindowWidth();

    const [showAddForm, setShowAddForm] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState(null);
    const [showAccessModal, setShowAccessModal] = useState(false);
    const [currentDocumentAccess, setCurrentDocumentAccess] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [documentToEdit, setDocumentToEdit] = useState(null);
    const [documentDetail, setDocumentDetail] = useState([]);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showAccessGroup, setShowAccessGroup] = useState(false);
    const [showConfirmGroupModal, setShowConfirmGroupModal] = useState(false);
    const [docsToDelete, setDocsToDelete] = useState([]);

    // Ajout pour la pagination
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredDocuments, setFilteredDocuments] = useState([]);

    // Utiliser un tableau d'IDs pour le filtre par site au lieu d'un seul ID
    const [selectedSites, setSelectedSites] = useState([]);

    // Filtrer les documents en fonction des critères de recherche et dates
    useEffect(() => {
        if (!documents) return;

        let filtered = documents.filter(doc =>
            doc.title && doc.title.toLowerCase().includes(data.searchTerm.toLowerCase())
        );

        // Filtrage par site (avec support multi-sélection)
        if (selectedSites.length > 0) {
            filtered = filtered.filter(doc => selectedSites.includes(doc.site_id));
        }

        // Filtrage par date de création
        if (data.start_date) {
            const startDate = new Date(data.start_date);
            filtered = filtered.filter(doc => new Date(doc.created_at) >= startDate);
        }

        if (data.end_date) {
            const endDate = new Date(data.end_date);
            // Ajuster la fin de la journée pour inclure toute la journée
            endDate.setHours(23, 59, 59, 999);
            filtered = filtered.filter(doc => new Date(doc.created_at) <= endDate);
        }

        // Filtrage par date d'expiration
        if (data.exp_start_date) {
            const expStartDate = new Date(data.exp_start_date);
            filtered = filtered.filter(doc => doc.expiration_date && new Date(doc.expiration_date) >= expStartDate);
        }

        if (data.exp_end_date) {
            const expEndDate = new Date(data.exp_end_date);
            expEndDate.setHours(23, 59, 59, 999);
            filtered = filtered.filter(doc => doc.expiration_date && new Date(doc.expiration_date) <= expEndDate);
        }

        if (data.document_type && data.document_type !== "all") {
            filtered = filtered.filter(doc => doc.document_type === data.document_type);
        }

        setFilteredDocuments(filtered);
        setCurrentPage(1); // Réinitialiser à la première page lors d'une nouvelle recherche
    }, [data.searchTerm, data.start_date, data.end_date, selectedSites,data.document_type, data.exp_start_date, data.exp_end_date, documents]);

    // Initialiser filteredDocuments avec documents au chargement
    useEffect(() => {
        if (documents) {
            setFilteredDocuments(documents);
        }
    }, [documents]);

    // Fonction pour obtenir les éléments de la page courante
    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredDocuments.slice(startIndex, endIndex);
    };

    // Fonction pour gérer le changement de page
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= Math.ceil(filteredDocuments.length / itemsPerPage)) {
            setCurrentPage(pageNumber);
        }
    };

    // Gestionnaire pour le champ de recherche et les filtres de date
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    // Options pour le nombre d'éléments par page
    const documentsPerPageOptions = [5, 10, 20, 25, 50, 100, 150, 200, 300, 400, 600, 1000];
    const totalDocuments = filteredDocuments.length;
    const availableOptions = documentsPerPageOptions.filter(option => option <= totalDocuments || option === documentsPerPageOptions[0]);

    const resetFilters = () => {
        setData({
            ...data,
            searchTerm: '',
            start_date: '',
            end_date: '',
            exp_start_date: '',
            exp_end_date: '',
            document_type: 'all'
        });
        // Réinitialiser également la sélection des sites
        setSelectedSites([]);
    };

    const openDetailModal = (document) => {
        setDocumentDetail(document);
        setShowDetailModal(true);
    };

    const openEditModal = (document) => {
        setDocumentToEdit(document);
        setShowEditModal(true);
    };

    const openAccessModal = (documentId) => {
        const documentAccesses = DocumentAccess.filter((access) => access.document_id === documentId);
        const usersWithAccess = documentAccesses.map((access) => access.user.id);

        setCurrentDocumentAccess({
            documentId: documentId,
            usersWithAccess: usersWithAccess,
        });
        setShowAccessModal(true);
    };

    const handleSelectDoc = (documentId) => {
        if (data.document_ids.includes(documentId)) {
            setData("document_ids", data.document_ids.filter((id) => id !== documentId));
        } else {
            setData("document_ids", [...data.document_ids, documentId]);
        }
    };

    const confirmDocsGroupDelete = () => {
        if (data.document_ids.length === 0) return;

        // Filtrer les documents avec accès
        const docsWithAccess = data.document_ids
            .map((id) => {
                const accessCount = AccessTable.filter(entry => entry.document_id === id).length;
                const doc = documents.find(doc => doc.id === id);
                return accessCount > 0 ? { id, title: doc ? doc.title : `Document ${id}`, accessCount } : null;
            })
            .filter(Boolean);

        if (docsWithAccess.length > 0) {
            // Limiter l'affichage à 5 documents et ajouter "..."
            const maxDocuments = 5;
            const displayedDocuments = docsWithAccess.slice(0, maxDocuments);
            const remainingDocuments = docsWithAccess.length - maxDocuments > 0;

            // Créer une liste formatée pour l'affichage
            const documentList = displayedDocuments.map(d => `• ${d.title} : ${d.accessCount} utilisateur${d.accessCount > 1 ? 's' : ''} ayant accès`).join('\n');
            const additionalMessage = remainingDocuments ? "\n...\n" : "";  // Afficher "..." si plus de 5 documents

            // Afficher le message d'erreur avec la liste des documents
            toast.error(
                `Impossible de supprimer certains documents car des utilisateurs y ont encore accès :\n${documentList}${additionalMessage}\n\nVeuillez d'abord supprimer ces accès.`,
                { duration: 10000 }
            );

            setShowConfirmGroupModal(false);
            return;
        }

        // Aucun accès trouvé → suppression possible
        post(route("documents.DocsDelete"), {
            onSuccess: () => {
                setData("document_ids", []);
            },
        });

        setShowConfirmGroupModal(false);
    };


    const handleDocsDelete = () => {
        const selectedDocs = documents
            .filter((doc) => data.document_ids.includes(doc.id))
            .map((doc) => ({ id: doc.id, name: doc.title }));

        setDocsToDelete(selectedDocs);
        setShowConfirmGroupModal(true);
    };

    const cancelGroupDelete = () => {
        setShowConfirmGroupModal(false);
    };

    const handleChangeAccess = () => {
        setShowAccessGroup(true);
    };

    const deleteDocument = (doc) => {
        setDocumentToDelete(doc);
        setShowConfirmModal(true);
    };

    const confirmDelete = () => {
        if (!documentToDelete) return;

        const accessCount = AccessTable.filter((entry) => entry.document_id === documentToDelete.id).length;

        const doc = documents.find((doc) => doc.id === documentToDelete.id);
        const doctitle = doc ? doc.title : "ce document";

        if (accessCount > 0) {
            toast.error(
                `Le document ${doctitle} a ${accessCount} utilisateur${accessCount > 1 ? "s" : ""} ayant accès.\n\nVeuillez supprimer ${accessCount > 1 ? "ces accès" : "cet accès"} avant de pouvoir supprimer ce document.`,
                {
                    duration: 10000,
                }
            );
            setShowConfirmModal(false);
            return;
        }

        destroy(`/documents/delete/${documentToDelete.id}`);
        setShowConfirmModal(false);
        setDocumentToDelete(null);
    };



    const cancelDelete = () => {
        setShowConfirmModal(false);
        setDocumentToDelete(null);
    };

    useEffect(() => {
        if (flash.message?.success) {
            toast.success(flash.message.success);
        }
        if (flash.message?.error) {
            toast.error(flash.message.error);
        }
    }, [flash]);


// This function constructs the export URL with all current filters
    const handleExport = () => {
        // Vérifie si des documents correspondent aux filtres actuels
        if (filteredDocuments.length === 0) {
            // Affiche un toast d'erreur si aucun document ne correspond
            toast.error("Aucun document à exporter");
            return; // Arrête l'exécution de la fonction
        }

        // Si des documents sont présents, continue avec l'exportation
        // Build query parameters from current filters
        const params = new URLSearchParams();

        // Add search term if present
        if (data.searchTerm) {
            params.append('searchTerm', data.searchTerm);
        }

        // Add selected sites if any
        if (selectedSites.length > 0) {
            params.append('siteIds', selectedSites.join(','));
        }

        // Add date filters if present
        if (data.start_date) {
            params.append('startDate', data.start_date);
        }

        if (data.end_date) {
            params.append('endDate', data.end_date);
        }

        if (data.exp_start_date) {
            params.append('expStartDate', data.exp_start_date);
        }

        if (data.exp_end_date) {
            params.append('expEndDate', data.exp_end_date);
        }

        if (data.document_type && data.document_type !== "all") {
            params.append('documentType', data.document_type);
        }

        // Build the final URL with query parameters
        const exportUrl = `${route('documents.export')}?${params.toString()}`;

        // Navigate to the export URL
        window.location.href = exportUrl;

        // Optionnellement, affiche un toast de succès
        toast.success(`Exportation de ${filteredDocuments.length} document(s) en cours...`);
    };

    const handleExportCSV = () => {
        // Vérifie si des documents correspondent aux filtres actuels
        if (filteredDocuments.length === 0) {
            // Affiche un toast d'erreur si aucun document ne correspond
            toast.error("Aucun document à exporter");
            return; // Arrête l'exécution de la fonction
        }

        // Si des documents sont présents, continue avec l'exportation
        // Build query parameters from current filters
        const params = new URLSearchParams();

        // Add search term if present
        if (data.searchTerm) {
            params.append('searchTerm', data.searchTerm);
        }

        // Add selected sites if any
        if (selectedSites.length > 0) {
            params.append('siteIds', selectedSites.join(','));
        }

        // Add date filters if present
        if (data.start_date) {
            params.append('startDate', data.start_date);
        }

        if (data.end_date) {
            params.append('endDate', data.end_date);
        }

        if (data.exp_start_date) {
            params.append('expStartDate', data.exp_start_date);
        }

        if (data.exp_end_date) {
            params.append('expEndDate', data.exp_end_date);
        }

        // Build the final URL with query parameters
        const exportUrl = `${route('documents.exportCSV')}?${params.toString()}`;

        // Navigate to the export URL
        window.location.href = exportUrl;

        // Optionnellement, affiche un toast de succès
        toast.success(`Exportation de ${filteredDocuments.length} document(s) en cours...`);
    };

    const getDocumentTypeLabel = (type) => {
        switch (type) {
            case 'urbanisme':
                return 'Informations Urbanistiques';
            case 'contrat':
                return 'Contrats';
            case 'fiscalite':
                return 'Taxes Professionnelles';
            case 'autre':
                return 'Autre';
            default:
                return <span className="italic text-gray-400">Type non défini</span> ;
        }
    };


    return (
        <Authenticated user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Documents</h2>}>
            <Head title="Documents" />
            <div>
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="mr-1 text-lg font-medium text-gray-900">
                                    Liste des documents
                                </h3>
                                {width < 550 ?
                                <div className="flex space-x-3">
                                    {data.document_ids.length > 0 && (
                                        <>
                                            <button
                                                onClick={handleDocsDelete}
                                                disabled={data.document_ids.length === 0}
                                                title={`Supprimer ${data.document_ids.length} document${data.document_ids.length > 1 ? 's' : ''} sélectionné${data.document_ids.length > 1 ? 's' : ''}`}
                                                className="px-2 py-2 bg-red-100 text-red-600 rounded-md hover:text-red-900 transition"
                                            >
                                                <TiDocumentDelete/>{/*Supprimer*/}
                                            </button>
                                            <button
                                                onClick={handleChangeAccess}
                                                title={`Gérer l'accès à ${data.document_ids.length} document${data.document_ids.length > 1 ? 's' : ''} sélectionné${data.document_ids.length > 1 ? 's' : ''}`}                                                disabled={data.document_ids.length === 0}
                                                className="px-2 py-2 bg-green-100 text-green-600 rounded-md hover:text-green-900 transition"
                                            >
                                                <FaFileShield/>{/*Accès*/}
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={handleExport}
                                        title="Exporter les Documents Filtrés"
                                        className="px-2 py-2 bg-green-100 text-green-600 rounded-md hover:text-green-900 transition"
                                    >
                                        <CiExport />
                                    </button>
                                    <button
                                        onClick={handleExportCSV}
                                        title="Exporter les Documents Filtrés"
                                        className="px-2 py-2 bg-green-100 text-green-600 rounded-md hover:text-green-900 transition"
                                    >
                                        <TbFileTypeCsv/>
                                    </button>
                                    <button
                                        onClick={() => setShowAddForm(true)}
                                        title="Ajouter un nouveau Document"
                                        className="px-2 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                                    >
                                        <HiDocumentAdd/>{/*Ajouter un Document*/}
                                    </button>
                                </div> :
                                    <div className="flex space-x-3">
                                        {data.document_ids.length > 0 && (
                                            <>
                                                <button
                                                    onClick={handleDocsDelete}
                                                    disabled={data.document_ids.length === 0}
                                                    title={`Supprimer ${data.document_ids.length} document${data.document_ids.length > 1 ? 's' : ''} sélectionné${data.document_ids.length > 1 ? 's' : ''}`}
                                                    className="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:text-red-900 transition"
                                                >
                                                    <TiDocumentDelete/>{/*Supprimer*/}
                                                </button>
                                                <button
                                                    onClick={handleChangeAccess}
                                                    title={`Gérer l'accès à ${data.document_ids.length} document${data.document_ids.length > 1 ? 's' : ''} sélectionné${data.document_ids.length > 1 ? 's' : ''}`}                                                disabled={data.document_ids.length === 0}
                                                    className="px-4 py-2 bg-green-100 text-green-600 rounded-md hover:text-green-900 transition"
                                                >
                                                    <FaFileShield/>{/*Accès*/}
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={handleExport}
                                            title="Exporter les Documents Filtrés  au format Exel"
                                            className="px-4 py-2 bg-green-100 text-green-600 rounded-md hover:text-green-900 transition"
                                        >
                                            <CiExport />
                                        </button>
                                        <button
                                            onClick={handleExportCSV}
                                            title="Exporter les documents filtrés au format CSV"
                                            className="px-2 py-2 bg-green-100 text-green-600 rounded-md hover:text-green-900 transition"
                                        >
                                            <TbFileTypeCsv/>
                                        </button>
                                        <button
                                            onClick={() => setShowAddForm(true)}
                                            title="Ajouter un nouveau Document"
                                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                                        >
                                            <HiDocumentAdd/>{/*Ajouter un Document*/}
                                        </button>
                                    </div>
                                }
                            </div>

                            {/* Nouvelle section de filtres sur une même ligne - Version corrigée */}
                            <div className="flex flex-wrap items-end gap-3 mb-7 relative z-0">
                                {/* Filtre par titre */}
                                <div className="relative flex-1 min-w-[170px]">
                                    <label htmlFor="searchTerm" className="text-xs font-medium text-gray-700 mb-1 block">Recherche par titre:</label>
                                    <div className="relative">
                                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <input
                                            type="text"
                                            id="searchTerm"
                                            name="searchTerm"
                                            value={data.searchTerm}
                                            onChange={handleFilterChange}
                                            className="block w-full pl-10 pr-3 py-1 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="Titre..."
                                        />
                                    </div>
                                </div>

                                {/* Filtre par site (MultiSelectDropdown) */}
                                <div className="relative flex-1 min-w-[200px] z-20">
                                    <MultiSelectDropdown
                                        options={sites}
                                        selectedOptions={selectedSites}
                                        setSelectedOptions={setSelectedSites}
                                        label="Filtrer par site:"
                                    />
                                </div>

                                {/* Filtrer par type de document */}
                                <div className="flex-1 min-w-[150px]">
                                    <label htmlFor="document_type" className="text-xs font-medium text-gray-700 mb-1 block">
                                        Filtrer par type :
                                    </label>
                                    <select
                                        className="block w-full px-3 py-1 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        id="document_type"
                                        name="document_type"
                                        value={data.document_type}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="all">Tous</option>
                                        <option value="urbanisme">Informations Urbanistiques</option>
                                        <option value="contrat">Contrats</option>
                                        <option value="fiscalite">Taxes Professionnelles</option>
                                        <option value="autre">Autre</option>
                                    </select>
                                </div>

                                {/* Dates de création */}
                                <div className="flex-1 min-w-[150px]">
                                    <label htmlFor="start_date" className="text-xs font-medium text-gray-700 mb-1 block">Création début:</label>
                                    <input
                                        type="date"
                                        className="block w-full px-3 py-1 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        id="start_date"
                                        name="start_date"
                                        value={data.start_date}
                                        onChange={handleFilterChange}
                                    />
                                </div>

                                <div className="flex-1 min-w-[150px]">
                                    <label htmlFor="end_date" className="text-xs font-medium text-gray-700 mb-1 block">Création fin:</label>
                                    <input
                                        type="date"
                                        className="block w-full px-3 py-1 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        id="end_date"
                                        name="end_date"
                                        value={data.end_date}
                                        onChange={handleFilterChange}
                                    />
                                </div>

                                {/* Dates d'expiration */}
                                <div className="flex-1 min-w-[150px]">
                                    <label htmlFor="exp_start_date" className="text-xs font-medium text-gray-700 mb-1 block">Expiration début:</label>
                                    <input
                                        type="date"
                                        className="block w-full px-3 py-1 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        id="exp_start_date"
                                        name="exp_start_date"
                                        value={data.exp_start_date}
                                        onChange={handleFilterChange}
                                    />
                                </div>

                                <div className="flex-1 min-w-[150px]">
                                    <label htmlFor="exp_end_date" className="text-xs font-medium text-gray-700 mb-1 block">Expiration fin:</label>
                                    <input
                                        type="date"
                                        className="block w-full px-3 py-1 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        id="exp_end_date"
                                        name="exp_end_date"
                                        value={data.exp_end_date}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                                <div className="flex-1 min-w-[200px]">
                                    <label className="text-xs font-medium text-gray-700 mb-1 block">Par page :</label>
                                    <div className="flex items-center gap-2">
                                        <select
                                            id="itemsPerPage"
                                            className="w-full h-[30px] px-3 py-1 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            value={itemsPerPage}
                                            onChange={(e) => {
                                                setItemsPerPage(Number(e.target.value));
                                                setCurrentPage(1); // Réinitialiser à la première page
                                            }}
                                        >
                                            {availableOptions.map(option => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={resetFilters}
                                            title="Réinitialiser le Filtre"
                                            className="h-[30px] px-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition flex items-center"
                                        >
                                            <TbZoomReset className="mr-1" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto">
                                <table className="border-collapse table-auto w-full whitespace-nowrap">
                                    <thead>
                                    <tr className="text-left bg-gray-50">
                                        <th className="px-6 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                        <th className="px-6 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                                        <th className="px-6 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">Type de document</th>
                                        <th className="px-6 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'expiration</th>
                                        <th className="px-6 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">Site</th>
                                        <th className="px-6 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {getCurrentPageItems().length > 0 ? (
                                        getCurrentPageItems().map((document) => (
                                            <tr key={document.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                                                    <input
                                                        type="checkbox"
                                                        checked={data.document_ids.includes(document.id)}
                                                        onChange={() => handleSelectDoc(document.id)}
                                                    />
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                                                    {document.title || <span className="italic text-gray-400">Sans titre</span>}
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {getDocumentTypeLabel(document.document_type)}
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {document.expiration_date
                                                        ? (document.expiration_date || "Non trouvé")
                                                        : <span className="italic text-gray-400">Non spécifié</span>
                                                    }
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {sites && document.site_id
                                                        ? (sites.find((site) => site.id === document.site_id)?.name || "Non trouvé")
                                                        : <span className="italic text-gray-400">Non spécifié</span> }
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => openDetailModal(document)}
                                                            title={`Consulter les détails du document ${document.title}`}
                                                            className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded bg-blue-100"
                                                        >
                                                            <BiDetail/>{/*Détails*/}
                                                        </button>
                                                        <button
                                                            onClick={() => openEditModal(document)}
                                                            title={`Modifier les informations du document ${document.title}`}
                                                            className="text-yellow-600 hover:text-yellow-900 px-2 py-1 rounded bg-yellow-100"
                                                        >
                                                            <MdEditDocument/>{/*Modifier*/}
                                                        </button>
                                                        <button
                                                            onClick={() => openAccessModal(document.id)}
                                                            title={`Gérer l'accès au document ${document.title}`}
                                                            className="text-green-600 hover:text-green-900 px-2 py-1 rounded bg-green-100"
                                                        >
                                                            <FaFileShield/>{/*Accès*/}
                                                        </button>
                                                        <button
                                                            onClick={() => deleteDocument({
                                                                id: document.id,
                                                                title: document.title,
                                                                siteName: sites.find((site) => site.id === document.site_id)?.name
                                                            })}
                                                            title={`Supprimer le document ${document.title}`}
                                                            className="text-red-600 hover:text-red-900 px-2 py-1 rounded bg-red-100"
                                                        >
                                                            <TiDocumentDelete/>{/*Supprimer*/}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                                <span className="italic text-gray-400">Aucun document trouvé.</span>
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                            {filteredDocuments.length > 0 && (
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex justify-end text-sm text-gray-500">
                                        {filteredDocuments.length} document(s) trouvé(s)
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className={`px-3 py-1 rounded-md ${
                                                currentPage === 1
                                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                            }`}
                                        >
                                            <FaBackward/>
                                        </button>
                                        <span className="px-3 py-1 bg-gray-100 rounded-md">
                                            Page {currentPage} sur {Math.ceil(filteredDocuments.length / itemsPerPage)}
                                        </span>
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage >= Math.ceil(filteredDocuments.length / itemsPerPage)}
                                            className={`px-3 py-1 rounded-md ${
                                                currentPage >= Math.ceil(filteredDocuments.length / itemsPerPage)
                                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                            }`}
                                        >
                                            <TbPlayerTrackNextFilled/>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {showAccessGroup && (
                <ModalWrapper title="Gérer les accès" onClose={() => setShowAccessGroup(false)}>
                    <DocumentsAccesGroup documentIds={data.document_ids} users={usersAccess} setShowAccessGroup={setShowAccessGroup} />
                </ModalWrapper>
            )}
            {showDetailModal && documentDetail && (
                <ModalWrapper title="Détails du document" onClose={() => setShowDetailModal(false)}>
                    <DetailsDocument auth={auth} document={documentDetail} users={users} sites={sites} setshowDetailModal={setShowDetailModal} />
                </ModalWrapper>
            )}
            {showEditModal && documentToEdit && (
                <ModalWrapper title="Modifier le document" onClose={() => setShowEditModal(false)}>
                    <EditDocuments auth={auth} document={documentToEdit} sites={sites} setShowEditForm={setShowEditModal} />
                </ModalWrapper>
            )}
            {showAddForm && (
                <ModalWrapper title="Ajouter un document" onClose={() => setShowAddForm(false)}>
                    <AddDocuments auth={auth} sites={sites} setShowAddForm={setShowAddForm} />
                </ModalWrapper>
            )}
            {showAccessModal && currentDocumentAccess && (
                <ModalWrapper title="Gérer les accès" onClose={() => setShowAccessModal(false)}>
                    <DocumentAcces
                        auth={auth}
                        users={usersAccess}
                        documentId={currentDocumentAccess.documentId}
                        usersWithAccess={currentDocumentAccess.usersWithAccess}
                        setShowAccesModel={setShowAccessModal}
                    />
                </ModalWrapper>
            )}
            {showConfirmModal && (
                <ConfirmSupprimeDocument
                    documentToDelete={documentToDelete}
                    confirmDelete={confirmDelete}
                    cancelDelete={cancelDelete}
                />
            )}
            {showConfirmGroupModal && (
                <ConfirmSuppDOcs
                    DOcsToDelete={docsToDelete}
                    onConfirm={confirmDocsGroupDelete}
                    onCancel={cancelGroupDelete}
                />
            )}
        </Authenticated>
    );
}
