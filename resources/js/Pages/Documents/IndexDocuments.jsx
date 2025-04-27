import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import React, { useState } from "react";
import AddDocuments from "@/Pages/Documents/AddDocuments";
import AddUser from "@/Pages/Utilisateurs/AddUser.jsx";

function IndexDocuments({ auth, documents, sites, users }) {
    const { delete: destroy } = useForm();
    const [showAddForm, setShowAddForm] = useState(false); // <<< ici on contrôle l'affichage

    const deleteDocument = (docId) => {
        if (confirm("Voulez-vous vraiment supprimer ce document ?")) {
            destroy(`/documents/delete/${docId}`);
        }
    };

    return (
        <Authenticated user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Documents</h2>}>
            <Head title="Documents" />

            <div>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-gray-900">
                                    {showAddForm ? "Ajouter un document" : "Liste des documents"}
                                </h3>

                                {/* Bouton Ajouter ou Retour */}
                                {showAddForm ? (
                                    <button
                                        onClick={() => setShowAddForm(false)}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                                    >
                                        Retour
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setShowAddForm(true)}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                                    >
                                        Ajouter un Document
                                    </button>
                                )}
                            </div>

                            {showAddForm &&
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                                    <div style={{width:'60%'}} className="bg-white p-4 rounded-lg w-7/10 sm:w-7/10 shadow-lg flex flex-col space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-medium text-gray-900">Ajouter un document</h3>
                                            <button
                                                onClick={() => setShowAddForm(false)}
                                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                                            >
                                                Retour
                                            </button>
                                        </div>
                                        <div style={{width:'100%'}} className="flex justify-center">
                                            <AddDocuments auth={auth} sites={sites} />
                                        </div>
                                    </div>
                                </div>}

                                <div className="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto">
                                    <table className="border-collapse table-auto w-full whitespace-nowrap">
                                        <thead>
                                        <tr className="text-left bg-gray-50">
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
                                                Actions
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                        {documents && documents.length > 0 ? (
                                            documents.map((document) => (
                                                <tr key={document.id} className="hover:bg-gray-50">
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
                                                            <a
                                                                href={`/documents/edit/${document.id}`}
                                                                className="text-yellow-600 hover:text-yellow-900 px-2 py-1 rounded bg-yellow-100"
                                                            >
                                                                Modifier
                                                            </a>
                                                            <a
                                                                href={`/documents/access/${document.id}`}
                                                                className="text-green-600 hover:text-green-900 px-2 py-1 rounded bg-green-100"
                                                            >
                                                                Accès
                                                            </a>
                                                            <button
                                                                onClick={() => deleteDocument(document.id)}
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
                </div>
            </div>
        </Authenticated>
    );
}

export default IndexDocuments;
