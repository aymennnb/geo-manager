import Authenticated from "@/Layouts/AuthenticatedLayout";
import {Head, Link, useForm} from "@inertiajs/react";
import React from "react";

function IndexDocuments({ auth, documents,sites,users }) {

    const { data, setData, post, processing, errors, delete: destroy } = useForm({
        title: "",
        site_id: "",
        uploaded_by: auth.user.id,
        description: "",
        file_path: null
    });

    const deleteDocument = (Docid) => {
        if (confirm('Voulez-vous vraiment supprimer ce document ?')) {
            destroy(`/documents/delete/${Docid}`);
        }
    }

    return (
        <Authenticated user={auth.user} header={<h2 className="mb-4">Documents</h2>}>
            <Head title="Documents" />

            <Link href={'/documents/add'} className="btn btn-success mb-3">
                Ajouter un Document
            </Link>

            <table className="table table-bordered">
                <thead className="table-light">
                <tr>
                    <th>Titre</th>
                    <th>Description</th>
                    <th>Chemin du fichier</th>
                    <th>site</th>
                    <th>Téléversé par</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {documents && documents.length > 0 ? (
                    documents.map((document) => (
                        <tr key={document.id}>
                            <td>{document.title}</td>
                            <td>{document.description}</td>
                            <td>{document.file_path}</td>
                            <td>{sites.find(site => site.id === document.site_id)?.name || 'Non trouvé'}</td>
                            <td>{users.find(user => user.id === document.uploaded_by)?.name || 'Non trouvé'}</td>
                            <td>
                                <Link href={`/documents/edit/${document.id}`} className="btn btn-sm btn-warning">
                                    Modifier
                                </Link>
                                <button onClick={() => deleteDocument(document.id)} className="btn btn-danger">
                                    Supprimer
                                </button>
                                <button className="btn btn-sm btn-info me-2">
                                    Détails
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6" className="text-center">Aucun document trouvé.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </Authenticated>
    );
}

export default IndexDocuments;
