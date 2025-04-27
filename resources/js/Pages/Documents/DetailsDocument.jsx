import React from "react";
import { Head } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";

export default function DetailsDocument({ auth, document,sites,users }) {
    return (
        <Authenticated user={auth.user} header={<h2>Détails du Document</h2>}>
            <Head title="Détails du Document" />

            <div className="container mt-4">
                <div className="mb-3">
                    <label className="form-label">Aperçu du document</label>
                    {document.file_path ? (
                        <>
                            {document.file_path.match(/\.(pdf)$/i) ? (
                                <div>
                                    <iframe
                                        src={`/storage/${document.file_path}`}
                                        width="100%"
                                        height="500px"
                                        title="Aperçu PDF"
                                        className="border"
                                    />
                                </div>
                            ) : document.file_path.match(/\.(jpg|jpeg|png)$/i) ? (
                                <img
                                    src={`/storage/${document.file_path}`}
                                    alt="Aperçu image"
                                    className="img-fluid rounded shadow"
                                    style={{ maxHeight: '300px' }}
                                />
                            ) : document.file_path.match(/\.(doc|docx|xls|csv|xlsx)$/i) ? (
                                <a
                                    href={`/storage/${document.file_path}`}
                                    className="btn btn-outline-primary flex w-50"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Télécharger et ouvrir le document
                                </a>
                            ) : (
                                <div className="text-muted">Format non pris en charge</div>
                            )}
                        </>
                    ) : (
                        <div className="text-muted">Aucun fichier disponible</div>
                    )}
                </div>
                <div className="card shadow-sm p-4">
                    <h3 className="mb-3 text-primary">{document.title}</h3>

                    <p>
                        <strong>Description :</strong><br />
                        {document.description || <span className="text-muted">Aucune description</span>}
                    </p>
                    <p>
                        <strong>Site associé :</strong>{" "}
                        {sites.find(site => site.id === document.site_id)?.name || 'Non trouvé'}
                    </p>

                    <p>
                        <strong>Ajouté par :</strong>{" "}
                        {users.find(user => user.id === document.uploaded_by)?.name || 'Non trouvé'}
                    </p>

                    <p>
                        <strong>Date de création :</strong>{" "}
                        {new Date(document.created_at).toLocaleString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>

                    <p>
                        <strong>Date du dernière mise à jour :</strong>{" "}
                        {new Date(document.updated_at).toLocaleString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>

                    <div className="mt-4">
                        <a
                            href={`/storage/${document.file_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline-primary"
                        >
                            Voir / Télécharger le document
                        </a>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
