import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import Pagination from "@/Components/Pagination";
import ConfirmDeleteSite from "@/Components/ConfirmDeleteSite";
import AddSite from "@/Pages/Sites/AddSite"
import EditSite from "@/Pages/Sites/EditSite"
import ModalWrapper from "@/Components/ModalWrapper";


function IndexSites({ auth, sites }) {
    const { data, setData, get, delete: destroy } = useForm({
        name: '',
        address: '',
        page: sites.current_page
    });

    const [showAddForm, setShowAddForm] = useState(false);

    const [siteToDelete, setSiteToDelete] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);
    const [siteToEdit, setsiteToEdit] = useState(null);

    // const handleFilter = (e) => setData(e.target.name, e.target.value);


    const handleDeleteClick = (site) => {
        setSiteToDelete(site);
        setIsModalOpen(true);
    };

    const confirmDelete = () => {
        if (siteToDelete) {
            destroy(`/sites/delete/${siteToDelete.id}`);
            setIsModalOpen(false);
            setSiteToDelete(null);
        }
    };

    const cancelDelete = () => {
        setIsModalOpen(false);
        setSiteToDelete(null);
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
            <Head title="Sites" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        {/* Bouton Ajouter un site */}
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="mr-1 text-lg font-medium text-gray-900">Liste des sites</h3>
                            <button
                                    onClick={() => setShowAddForm(true)}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                                >
                                    Ajouter un Site
                            </button>
                        </div>
                                <div className="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto">
                                    <table className="border-collapse table-auto w-full whitespace-nowrap">
                                        <thead>
                                        <tr className="text-left bg-gray-50">
                                            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">

                                            </th><th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                                                        <input type="checkbox"/>
                                                    </td>
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
                                                                href={`/sites/details/${site.id}`}
                                                                className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded bg-blue-100"
                                                            >
                                                                Détails
                                                            </Link>
                                                            <button
                                                                onClick={() => {
                                                                    setShowEditModal(true);
                                                                    setsiteToEdit(site);
                                                                }}
                                                                className="text-yellow-600 hover:text-yellow-900 px-2 py-1 rounded bg-yellow-100"
                                                            >
                                                                Modifier
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteClick(site)}
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
                                                    Aucun site trouvé.
                                                </td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination links={sites.links} currentPage={sites.current_page} setCurrentPage={(page) => setData('page', page)} />
                    </div>
                    {showEditModal && (
                        <ModalWrapper title="Modifier le site" onClose={() => setShowEditModal(false)}>
                            <EditSite auth={auth} siteToEdit={siteToEdit} setShowEditModal={setShowEditModal} />
                        </ModalWrapper>
                    )}
                    {showAddForm && (
                        <ModalWrapper title="Ajouter un nouveau site" onClose={() => setShowAddForm(false)}>
                            <AddSite auth={auth} setShowAddForm={setShowAddForm} />
                        </ModalWrapper>
                    )}
                    {isModalOpen && (
                        <ConfirmDeleteSite
                            onConfirm={confirmDelete}
                            onCancel={cancelDelete}
                            siteToDelete={siteToDelete}
                        />
                    )}
                </div>
            </div>
        </Authenticated>
    );
}

export default IndexSites;
