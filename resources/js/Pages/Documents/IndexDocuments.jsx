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
import toast from 'react-hot-toast';
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { FaBackward } from "react-icons/fa6";

export default function IndexDocuments({ auth, documents, sites, users, DocumentAccess, flash }) {
    const { data, setData, delete: destroy, post } = useForm({
        document_ids: [],
        searchTerm: '',
        start_date: "", // Date de début pour la création
        end_date: "",   // Date de fin pour la création
        site_id: "",    // Filtre par site
        exp_start_date: "", // Date de début pour l'expiration
        exp_end_date: ""    // Date de fin pour l'expiration
    });

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

    // Filtrer les documents en fonction des critères de recherche et dates
    useEffect(() => {
        if (!documents) return;

        let filtered = documents.filter(doc =>
            doc.title && doc.title.toLowerCase().includes(data.searchTerm.toLowerCase())
        );

        // Filtrage par site
        if (data.site_id) {
            filtered = filtered.filter(doc => doc.site_id === parseInt(data.site_id));
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

        setFilteredDocuments(filtered);
        setCurrentPage(1); // Réinitialiser à la première page lors d'une nouvelle recherche
    }, [data.searchTerm, data.start_date, data.end_date, data.site_id, data.exp_start_date, data.exp_end_date, documents]);

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
            site_id: '',
            exp_start_date: '',
            exp_end_date: ''
        });
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
        post(route("documents.DocsDelete"), {
            onSuccess: () => {
                setData("document_ids", []);
                setShowConfirmGroupModal(false);
            },
        });
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
        if (documentToDelete) {
            destroy(`/documents/delete/${documentToDelete.id}`);
            setShowConfirmModal(false);
            setDocumentToDelete(null);
        }
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
                                <div className="flex space-x-3">
                                    {data.document_ids.length > 0 && (
                                        <>
                                            <button
                                                onClick={handleDocsDelete}
                                                disabled={data.document_ids.length === 0}
                                                className="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:text-red-900 transition"
                                            >
                                                Supprimer
                                            </button>
                                            <button
                                                onClick={handleChangeAccess}
                                                disabled={data.document_ids.length === 0}
                                                className="px-4 py-2 bg-green-100 text-green-600 rounded-md hover:text-green-900 transition"
                                            >
                                                Accès
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => setShowAddForm(true)}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                                    >
                                        Ajouter un Document
                                    </button>
                                </div>
                            </div>

                            {/* Nouvelle section de filtres sur une même ligne */}
                            <div className="flex flex-wrap gap-4 mb-7">
                                {/* Filtre par titre */}
                                <div className="relative flex-1 min-w-[200px]">
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

                                {/* Filtre par site (select) */}
                                <div className="relative flex-1 min-w-[150px]">
                                    <label htmlFor="site_id" className="text-xs font-medium text-gray-700 mb-1 block">Site:</label>
                                    <select
                                        id="site_id"
                                        name="site_id"
                                        value={data.site_id}
                                        onChange={handleFilterChange}
                                        className="block w-full px-3 py-1 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    >
                                        <option value="">Tous les sites</option>
                                        {sites && sites.map(site => (
                                            <option key={site.id} value={site.id}>
                                                {site.name}
                                            </option>
                                        ))}
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

                                {/* Sélecteur d'éléments par page */}
                                <div className="flex-none min-w-[100px]">
                                    <label htmlFor="itemsPerPage" className="text-xs font-medium text-gray-700 mb-1 block">Par page:</label>
                                    <select
                                        id="itemsPerPage"
                                        className="block w-full px-3 py-1 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={itemsPerPage}
                                        onChange={(e) => {
                                            setItemsPerPage(Number(e.target.value));
                                            setCurrentPage(1); // Réinitialiser à la première page lors du changement d'items par page
                                        }}
                                    >
                                        {availableOptions.map(option => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Bouton de réinitialisation */}
                                <div className="flex items-end">
                                    <button
                                        onClick={resetFilters}
                                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                                    >
                                        Réinitialiser
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto">
                                <table className="border-collapse table-auto w-full whitespace-nowrap">
                                    <thead>
                                    <tr className="text-left bg-gray-50">
                                        <th className="px-6 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                        <th className="px-6 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                                        <th className="px-6 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
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
                                                    {document.title || "Sans titre"}
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {document.description
                                                        ? (document.description.length > 50
                                                            ? `${document.description.substring(0, 50)}...`
                                                            : document.description)
                                                        : "Aucune description"}
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {document.expiration_date
                                                        ? (document.expiration_date || "Non trouvé")
                                                        : "Non spécifié"
                                                    }
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {sites && document.site_id
                                                        ? (sites.find((site) => site.id === document.site_id)?.name || "Non trouvé")
                                                        : "Non spécifié"}
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => openDetailModal(document)}
                                                            className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded bg-blue-100"
                                                        >
                                                            Détails
                                                        </button>
                                                        <button
                                                            onClick={() => openEditModal(document)}
                                                            className="text-yellow-600 hover:text-yellow-900 px-2 py-1 rounded bg-yellow-100"
                                                        >
                                                            Modifier
                                                        </button>
                                                        <button
                                                            onClick={() => openAccessModal(document.id)}
                                                            className="text-green-600 hover:text-green-900 px-2 py-1 rounded bg-green-100"
                                                        >
                                                            Accès
                                                        </button>
                                                        <button
                                                            onClick={() => deleteDocument({
                                                                id: document.id,
                                                                title: document.title,
                                                                siteName: sites.find((site) => site.id === document.site_id)?.name
                                                            })}
                                                            className="text-red-600 hover:text-red-900 px-2 py-1 rounded bg-red-100"
                                                        >
                                                            Supprimer
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                                Aucun document trouvé.
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
                    <DocumentsAccesGroup documentIds={data.document_ids} users={users} setShowAccessGroup={setShowAccessGroup} />
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
                        users={users}
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
