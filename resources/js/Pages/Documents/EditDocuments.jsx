import React, { useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import Authenticated from '@/Layouts/AuthenticatedLayout';

export default function EditDocuments({ auth, document, sites }) {
    const { data, setData, post, processing, errors } = useForm({
        id: document.id,
        title: document.title,
        site_id: document.site_id,
        uploaded_by: document.uploaded_by,
        description: document.description,
        file_path: null,
        // Données pour l'alerte
        role: auth.user.role,
        user_id: auth.user.id,
        action: '',
        type: 'document',
        elem_id: document.id,
    });

    // Utilisation de useEffect pour mettre à jour les attributs d'alert
    useEffect(() => {
        setData('action', 'update');
    }, [data.title, data.site_id, auth.user.role]);

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("documents.update"), {
            data,
            preserveScroll: true,
            onSuccess: () => {
                // Suppression de l'appel à l'alerte
                // post(route('alert.create'), {
                //     role: data.role,
                //     user_id: data.user_id,
                //     action: data.action,
                //     type: data.type,
                //     elem_id: data.elem_id,
                // });
            },
            onError: () => {
                console.error('Erreur lors de la mise à jour du document');
            }
        });
    };

    return (
        <Authenticated user={auth.user} header={<h2>Modifier le document</h2>}>
            <Head title="Modifier le document" />

            <form onSubmit={handleSubmit} encType="multipart/form-data" className="p-4 bg-white rounded shadow-sm">
                {/* Formulaire pour l'aperçu du document */}
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

                {/* Sélecteur de fichier */}
                <label className="form-label">Document (nouveau fichier)</label>
                <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setData('file_path', e.target.files[0])}
                />
                {errors.file_path && <div className="text-danger">{errors.file_path}</div>}

                {/* Sélecteur de site */}
                <div className="mb-3">
                    <label className="form-label">Affecter un site</label>
                    <select
                        className="form-control"
                        value={data.site_id}
                        onChange={(e) => setData("site_id", e.target.value)}
                    >
                        <option value="">Sélectionner un site</option>
                        {sites.map((site) => (
                            <option key={site.id} value={site.id}>{site.name}</option>
                        ))}
                    </select>
                    {errors.site_id && <div className="text-danger">{errors.site_id}</div>}
                </div>

                {/* Titre */}
                <div className="mb-3">
                    <label className="form-label">Titre</label>
                    <input
                        type="text"
                        className="form-control"
                        value={data.title}
                        onChange={(e) => setData("title", e.target.value)}
                    />
                    {errors.title && <div className="text-danger">{errors.title}</div>}
                </div>

                {/* Description */}
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                    />
                    {errors.description && <div className="text-danger">{errors.description}</div>}
                </div>

                <button className="btn btn-warning" type="submit" disabled={processing}>
                    {processing ? "Enregistrement..." : "Mettre à jour"}
                </button>
            </form>
        </Authenticated>
    );
}
