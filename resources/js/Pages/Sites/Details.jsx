import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React from "react";

function Details({ auth,site,documents }) {
    return (
        <Authenticated user={auth.user} header={<h2 >Détails du Site</h2>}>
            <Head title="Détails du Site" />
            <div className="container mt-4">
                <div className="row">
                    <div className="col-md-5">
                        <img
                            src={"/storage/" + site.image}
                            alt={site.name}
                            className="img-fluid rounded shadow"
                            style={{ maxHeight: "300px", objectFit: "cover" }}
                        />
                    </div>

                    <div className="col-md-7">
                        <div className="card shadow-sm p-4">
                            <h3 className="mb-3 text-primary">{site.name}</h3>
                            <p>
                                <strong>Adresse :</strong> {site.address}
                            </p>
                            <p>
                                <strong>Site web :</strong>{" "}
                                <a
                                    href={site.web}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {site.web}
                                </a>
                            </p>
                            <p>
                                <strong>Téléphone :</strong> {site.phone}
                            </p>
                            <p>
                                <strong>Email :</strong> {site.email}
                            </p>
                            <p>
                                <strong>Latitude :</strong> {site.latitude}
                            </p>
                            <p>
                                <strong>Longitude :</strong> {site.longitude}
                            </p>
                            <p>
                                <strong>Date de creation : </strong>
                                {new Date(site.created_at).toLocaleString(
                                    "fr-FR",
                                    {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }
                                )}
                            </p>
                            <p>
                                <strong>Date de dernière mise a jour : </strong>
                                {new Date(site.updated_at).toLocaleString(
                                    "fr-FR",
                                    {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-5">
                <h4 className="mb-3 text-secondary">Documents liés</h4>
                {documents && documents.filter((doc) => doc.site_id === site.id).length > 0 ? (
                    <ul className="list-group">
                        {documents
                            .filter((doc) => doc.site_id === site.id)
                            .map((doc) => (
                                <li
                                    key={doc.id}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                >
                                    <div>
                                        <strong>{doc.title}</strong><br />
                                        <small className="text-muted">{doc.description}</small>
                                    </div>
                                    <a
                                        href={`/storage/${doc.file_path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-sm btn-outline-primary"
                                    >
                                        Voir / Télécharger
                                    </a>
                                </li>
                            ))}
                    </ul>
                ) : (
                    <p className="text-muted">Aucun document lié à ce site.</p>
                )}
            </div>
        </Authenticated>
    );
}

export default Details;
