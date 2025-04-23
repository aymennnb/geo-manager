import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import React, { useEffect } from "react";
import Pagination from "@/Components/Pagination";

function IndexSites({ auth, sites,addresses }) {
    const { data, setData, get, delete: destroy } = useForm({
        name: '',
        address: '',
        page: sites.current_page
    });

    const handleFilter = (e) => setData(e.target.name, e.target.value);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            get('sites', {
                preserveState: true,
                replace: true,
                only: ['sites'],
                data: {
                    name: data.name,
                    address: data.address,
                    page: data.page
                }
            });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [data]);

    const handleDelete = (siteId) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce site ?')) {
            destroy(`/sites/delete/${siteId}`);
        }
    };

    return (
        <Authenticated user={auth.user} header={<h2 className="mb-4">Liste des Sites de M-AUTOMOTIV</h2>}>
            <Head title="Sites M-AUTOMOTIV" />
            <Link href={'/sites/add'} className="btn btn-success mb-3">Ajouter un Site</Link>

            <table className="table table-bordered">
                <thead className="table-light">
                <tr>
                    <th>Image</th>
                    <th>
                        <label className="form-label">Nom</label>
                        <input
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={handleFilter}
                            placeholder="Filtrer par nom"
                            className="form-control"
                        />
                    </th>
                    <th>
                        <label className="form-label">Adresse</label>
                        {/*<input*/}
                        {/*    type="text"*/}
                        {/*    name="address"*/}
                        {/*    value={data.address}*/}
                        {/*    onChange={handleFilter}*/}
                        {/*    placeholder="Filtrer par adresse"*/}
                        {/*    className="form-control"*/}
                        {/*/>*/}
                        <select
                            name="address"
                            value={data.address}
                            onChange={handleFilter}
                            className="form-control"
                        >
                            <option value="">Toutes les adresses</option>
                            <option value="Casablanca">Casablanca</option>
                            <option value="Rabat">Rabat</option>
                            <option value="temara ">Temara</option>
                            <option value="Tanger">Tanger</option>
                        </select>
                    </th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {sites.data && sites.data.length > 0 ? (
                    sites.data.map((site) => (
                        <tr key={site.id}>
                            <td>
                                <img src={`/storage/${site.image}`} style={{ width: '150px' }} alt={site.name} />
                            </td>
                            <td>{site.name}</td>
                            <td>{site.address}</td>
                            <td>{site.latitude}</td>
                            <td>{site.longitude}</td>
                            <td>
                                <Link href={`/sites/edit/${site.id}`} className="btn btn-sm btn-warning me-2">Modifier</Link>
                                <button onClick={() => handleDelete(site.id)} className="btn btn-sm btn-danger me-2">Supprimer</button>
                                <Link href={`/sites/details/${site.id}`} className="btn btn-sm btn-info">Détails</Link>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6" className="text-center">Aucun site trouvé.</td>
                    </tr>
                )}
                </tbody>
            </table>

            <Pagination links={sites.links} currentPage={sites.current_page} setCurrentPage={(page) => setData('page', page)} />
        </Authenticated>
    );
}

export default IndexSites;
