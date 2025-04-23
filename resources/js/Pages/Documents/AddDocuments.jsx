import React from 'react'
import { Head, useForm } from '@inertiajs/react'
import Authenticated from '@/Layouts/AuthenticatedLayout'

export default function AddDocuments({ auth, sites }) {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        site_id: "",
        uploaded_by: auth.user.id,
        description: "",
        file_path: null
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('documents.create'));
    };

    return (
        <Authenticated user={auth.user} header={<h2>Ajouter un nouveau document</h2>}>
            <Head title="Nouveau document" />
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="p-4 bg-white rounded shadow-sm">
                <div className="mb-3">
                    <label className="form-label">Document</label>
                    <input
                        type="file"
                        className="form-control"
                        onChange={(e) => setData('file_path', e.target.files[0])}
                    />
                    {errors.file_path && <div className="text-danger">{errors.file_path}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Affecter un site</label>
                    <select
                        className="form-control"
                        value={data.site_id}
                        onChange={(e) => setData("site_id", e.target.value)}
                    >
                        <option value="">Sélectionner un site</option>
                        {sites.length > 0 ? sites.map((site) => (
                            <option key={site.id} value={site.id}>{site.name}</option>
                        )) : (
                            <option disabled>Aucun site disponible</option>
                        )}
                    </select>
                    {errors.site_id && <div className="text-danger">{errors.site_id}</div>}
                </div>

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

                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                    />
                    {errors.description && <div className="text-danger">{errors.description}</div>}
                </div>

                <button className="btn btn-success" type="submit">
                    Ajouter
                </button>
            </form>
        </Authenticated>
    );
}
