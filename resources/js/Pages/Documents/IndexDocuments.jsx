import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import React, { useState } from "react";
import AddDocuments from "@/Pages/Documents/AddDocuments";
import AddUser from "@/Pages/Utilisateurs/AddUser.jsx";
import ConfirmSupprimeDocument from "@/Components/ConfirmSupprimeDocument";
import DocumentAcces from "@/Pages/Documents/DocumentAcces";
import EditDocuments from "@/Pages/Documents/EditDocuments";
import ModalWrapper from "@/Components/ModalWrapper";

function IndexDocuments({ auth, documents, sites, users,documentId }) {
    const { delete: destroy } = useForm();

    const [showAddForm, setShowAddForm] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState(null);
    const [selectedDocuments, setSelectedDocuments] = useState([]);
    const [showAccessModal, setShowAccessModal] = useState(false);

    const [currentDocumentAccess, setCurrentDocumentAccess] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [documentToEdit, setDocumentToEdit] = useState(null);

    const openEditModal = (document) => {
        setDocumentToEdit(document);
        setShowEditModal(true);
    };

    const openAccessModal = (documentId) => {
        const doc = documents.find((d) => d.id === documentId);
        if (doc) {
            setCurrentDocumentAccess({
                documentId: doc.id,
                documentAccesses: doc.users || [],
            });
            setShowAccessModal(true);
        }
    };

    const handleSelectUser = (documentId) => {
        setSelectedDocuments((prevSelected) => {
            if (prevSelected.includes(documentId)) {
                return prevSelected.filter((id) => id !== documentId);
            } else {
                return [...prevSelected, documentId];
            }
        });
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

    return (
        <Authenticated user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Documents</h2>}>
            <Head title="Documents" />

            <div>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-gray-900">Liste des documents</h3>
                                <div className="flex space-x-3">
                                    {selectedDocuments.length > 0 && (
                                        <>
                                            <button
                                                // onClick={() => handleDocsDelete()}
                                                disabled={selectedDocuments.length === 0}
                                                className="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:text-red-900 transition"
                                            >
                                                Supprimer
                                            </button><button
                                                // onClick={() => handleChangeAccess()}
                                                disabled={selectedDocuments.length === 0}
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
                                <div className="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto">
                                    <table className="border-collapse table-auto w-full whitespace-nowrap">
                                        <thead>
                                        <tr className="text-left bg-gray-50">
                                            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">

                                            </th><th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Titre
                                            </th>
                                            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Description
                                            </th>
                                            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Site
                                            </th>
                                            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                        {documents && documents.length > 0 ? (
                                            documents.map((document) => (
                                                <tr key={document.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedDocuments.includes(document.id)}
                                                            onChange={() => handleSelectUser(document.id)}
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
                                                    <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <a
                                                                href={`/documents/details/${document.id}`}
                                                                className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded bg-blue-100"
                                                            >
                                                                Détails
                                                            </a>
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
                                                                    siteName: sites.find((site) => site.id === document.site_id)?.name                                                                })}
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
                                                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    Aucun document trouvé.
                                                </td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                        </div>
                    </div>
                    {import.meta.env.DEV && (
                        <div className="mt-4 p-2 bg-gray-100 rounded">
                            <p>IDs des documents sélectionnés :</p>
                            <pre>{JSON.stringify(selectedDocuments, null, 2)}</pre>
                        </div>
                    )}
                </div>
            </div>
            {showEditModal && documentToEdit && (
                <ModalWrapper title="Modifier le document" onClose={() => setShowEditModal(false)}>
                    <EditDocuments auth={auth} document={documentToEdit} sites={sites} setShowEditForm={setShowEditModal}/>
                </ModalWrapper>
            )}
            {showAddForm && (
                <ModalWrapper title="Ajouter un document" onClose={() => setShowAddForm(false)}>
                    <AddDocuments auth={auth} sites={sites} setShowAddForm={setShowAddForm} />
                </ModalWrapper>
            )}
            {showAccessModal && currentDocumentAccess && (
                <ModalWrapper title="Gérer les accès" onClose={() => setShowAccessModal(false)} width="60%">
                    <DocumentAcces auth={auth} users={users} documentId={currentDocumentAccess.documentId} documentAccesses={currentDocumentAccess.documentAccesses} setShowAccesModel={setShowAccessModal}/>
                </ModalWrapper>
            )}
            {showConfirmModal && (
                <ConfirmSupprimeDocument
                    documentToDelete={documentToDelete}
                    confirmDelete={confirmDelete}
                    cancelDelete={cancelDelete}
                />
            )}
        </Authenticated>
    );
}

export default IndexDocuments;
