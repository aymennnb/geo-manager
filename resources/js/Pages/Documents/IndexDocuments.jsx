import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import AddDocuments from "@/Pages/Documents/AddDocuments";
import AddUser from "@/Pages/Utilisateurs/AddUser.jsx";
import ConfirmSupprimeDocument from "@/Components/ConfirmSupprimeDocument";
import DocumentAcces from "@/Pages/Documents/DocumentAcces";
import EditDocuments from "@/Pages/Documents/EditDocuments";
import DetailsDocument from "@/pages/Documents/DetailsDocument";
import DocumentsAccesGroup from '@/pages/Documents/DocumentsAccesGroup';
import ConfirmSuppDOcs from '@/Components/ConfirmSuppDOcs';
import ModalWrapper from "@/Components/ModalWrapper";
import toast from 'react-hot-toast';
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { FaBackward } from "react-icons/fa6";

function IndexDocuments({ auth, documents, sites, users, DocumentAccess, flash }) {
    const { data, setData, delete: destroy, post } = useForm({
        document_ids: [],
        searchTerm: '',
        start_date: "", // Ajout du champ pour la date de début
        end_date: ""    // Ajout du champ pour la date de fin
    });

    const [showAddForm, setShowAddForm] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState(null);
    const [showAccessModal, setShowAccessModal] = useState(false);
    const [currentDocumentAccess, setCurrentDocumentAccess] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [documentToEdit, setDocumentToEdit] = useState(null);
    const [documentDetail, setdocumentDetail] = useState([]);
    const [showDetailModal, setshowDetailModal] = useState(false);
    const [showAccessGroup, setShowAccessGroup] = useState(false);
    const [showConfirmGroupModal, setShowConfirmGroupModal] = useState(false);
    const [docsToDelete, setDocsToDelete] = useState([]);

    // Ajout pour la pagination
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredDocuments, setFilteredDocuments] = useState([]);

    // Fonction pour filtrer les documents en fonction du terme de recherche et des dates
    useEffect(() => {
        if (!documents) return;

        let filtered = documents.filter(doc =>
            doc.title && doc.title.toLowerCase().includes(data.searchTerm.toLowerCase())
        );

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

        setFilteredDocuments(filtered);
        setCurrentPage(1); // Réinitialiser à la première page lors d'une nouvelle recherche
    }, [data.searchTerm, data.start_date, data.end_date, documents]);

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

    const openDetailModal = (document) => {
        setdocumentDetail(document);
        setshowDetailModal(true);
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
            onSuccess: (page) => {
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

    // Options pour le nombre d'éléments par page
    const documentsPerPageOptions = [5, 10, 20, 25, 50, 100, 150,200,300,400,600,1000];
    const totalDocuments = filteredDocuments.length;
    const availableOptions = documentsPerPageOptions.filter(option => option <= totalDocuments || option === documentsPerPageOptions[0]);

    // Gestionnaire pour le champ de recherche et les filtres de date
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    useEffect(() => {
        if (flash.message.success) {
            toast.success(flash.message.success);
        }
        if (flash.message.error) {
            toast.error(flash.message.error);
        }
    }, [flash]);

    // Initialiser filteredDocuments avec documents au chargement
    useEffect(() => {
        if (documents) {
            setFilteredDocuments(documents);
        }
    }, [documents]);

    return (
        <Authenticated user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Documents</h2>}>
            <Head title="Documents" />
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium text-gray-900">Liste des documents</h3>
                            </div>
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

                        {/* Barre de recherche, filtres de date et sélection du nombre d'éléments par page */}
                        <div className="flex items-end gap-4 mb-7">
                            <div className="relative flex-1">
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    style={{height:'33px'}}
                                    type="text"
                                    name="searchTerm"
                                    value={data.searchTerm}
                                    onChange={handleFilterChange}
                                    className="block w-full pl-10 pr-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Rechercher par titre..."
                                />
                            </div>

                            {/* Champ pour la date de début */}
                            <div className="flex flex-col w-40">
                                <label htmlFor="start_date" className="text-xs font-medium text-gray-700 mb-1">Date de début:</label>
                                <input
                                    type="date"
                                    className="px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    id="start_date"
                                    name="start_date"
                                    value={data.start_date}
                                    onChange={handleFilterChange}
                                />
                            </div>

                            {/* Champ pour la date de fin */}
                            <div className="flex flex-col w-40">
                                <label htmlFor="end_date" className="text-xs font-medium text-gray-700 mb-1">Date de fin:</label>
                                <input
                                    type="date"
                                    className="px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    id="end_date"
                                    name="end_date"
                                    value={data.end_date}
                                    onChange={handleFilterChange}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-xs font-medium text-gray-700 mb-1">Par page:</label>
                                <select
                                    id="itemsPerPage"
                                    className="w-24 px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        </div>

                        <div className="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto">
                            <table className="border-collapse table-auto w-full whitespace-nowrap">
                                <thead>
                                <tr className="text-left bg-gray-50">
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    </th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Titre
                                    </th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Site
                                    </th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Création
                                    </th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
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
                                                {sites && document.site_id
                                                    ? (sites.find((site) => site.id === document.site_id)?.name || "Non trouvé")
                                                    : "Non spécifié"}
                                            </td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                {document.created_at ? new Date(document.created_at).toLocaleString("fr-FR") : "Non spécifié"}
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

                        {/* Pagination */}
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
                {/*{import.meta.env.DEV && (*/}
                {/*    <div className="mt-4 p-2 bg-gray-100 rounded">*/}
                {/*        <p>Données du formulaire :</p>*/}
                {/*        <pre>{JSON.stringify(data, null, 2)}</pre>*/}
                {/*        <pre>{JSON.stringify(currentDocumentAccess, null, 2)}</pre>*/}
                {/*    </div>*/}
                {/*)}*/}
            </div>
            {showAccessGroup && (
                <ModalWrapper title="Gérer les accès" onClose={() => setShowAccessGroup(false)}>
                    <DocumentsAccesGroup documentIds={data.document_ids} users={users} setShowAccessGroup={setShowAccessGroup} />
                </ModalWrapper>
            )}
            {showDetailModal && documentDetail && (
                <ModalWrapper title="Détails du document" onClose={() => setshowDetailModal(false)}>
                    <DetailsDocument auth={auth} document={documentDetail} users={users} sites={sites} setshowDetailModal={setshowDetailModal} />
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
                <ModalWrapper title="Gérer les accès" onClose={() => setShowAccessModal(false)} width="60%">
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

export default IndexDocuments;
