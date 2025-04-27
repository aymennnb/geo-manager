import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import Pagination from "@/Components/Pagination";

function IndexSites({ auth, sites }) {
    const { data, setData, get, delete: destroy } = useForm({
        name: '',
        address: '',
        page: sites.current_page
    });

    const [showAddForm, setShowAddForm] = useState(false);

    const handleFilter = (e) => setData(e.target.name, e.target.value);

    const handleDelete = (siteId) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce site ?')) {
            destroy(`/sites/delete/${siteId}`);
        }
    };

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

    return (
        <Authenticated user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Sites</h2>}>
            <Head title="Sites M-AUTOMOTIV" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">

                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-medium text-gray-900">
                                {showAddForm ? "Ajouter un site" : "Liste des sites"}
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
                                    Ajouter un Site
                                </button>
                            )}
                        </div>

                        {/*{showAddForm &&*/}
                        {/*    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">*/}
                        {/*        <div className="bg-white p-4 rounded-lg shadow-lg w-7/10 sm:w-7/10">*/}
                        {/*            <div className="flex justify-between items-center mb-4">*/}
                        {/*                <h3 className="text-lg font-medium text-gray-900">Ajouter un site</h3>*/}
                        {/*                <button*/}
                        {/*                    onClick={() => setShowAddForm(false)}*/}
                        {/*                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"*/}
                        {/*                >*/}
                        {/*                    Retour*/}
                        {/*                </button>*/}
                        {/*            </div>*/}
                        {/*            <div className="flex justify-center">*/}
                        {/*                /!* Ajouter un site formulaire ici *!/*/}
                        {/*                /!* Par exemple, vous pouvez intégrer un formulaire comme AddSite *!/*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*}*/}

                        <div className="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto">
                            <table className="border-collapse table-auto w-full whitespace-nowrap">
                                <thead>
                                <tr className="text-left bg-gray-50">
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Image
                                    </th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nom
                                    </th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Adresse
                                    </th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Latitude
                                    </th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Longitude
                                    </th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {sites.data && sites.data.length > 0 ? (
                                    sites.data.map((site) => (
                                        <tr key={site.id} className="hover:bg-gray-50">
                                            <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-900">
                                                <img src={`/storage/${site.image}`} alt={site.name} />
                                            </td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                {site.name}
                                            </td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                {site.address}
                                            </td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                {site.latitude}
                                            </td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                {site.longitude}
                                            </td>
                                            <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <Link
                                                        href={`/sites/edit/${site.id}`}
                                                        className="text-yellow-600 hover:text-yellow-900 px-2 py-1 rounded bg-yellow-100"
                                                    >
                                                        Modifier
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(site.id)}
                                                        className="text-red-600 hover:text-red-900 px-2 py-1 rounded bg-red-100"
                                                    >
                                                        Supprimer
                                                    </button>
                                                    <Link
                                                        href={`/sites/details/${site.id}`}
                                                        className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded bg-blue-100"
                                                    >
                                                        Détails
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                            Aucun site trouvé.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        <Pagination links={sites.links} currentPage={sites.current_page} setCurrentPage={(page) => setData('page', page)} />
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}

export default IndexSites;
