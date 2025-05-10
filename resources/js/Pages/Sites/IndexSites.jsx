import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import Pagination from "@/Components/Pagination";
import ConfirmDeleteSite from "@/Components/ConfirmDeleteSite";
import ConfirmSitesDelete from "@/Components/ConfirmSitesDelete";
import AddSite from "@/Pages/Sites/AddSite"
import EditSite from "@/Pages/Sites/EditSite"
import Details from "@/Pages/Sites/Details"
import ImportSitesXLSX from "@/Pages/Sites/AddFileXLSX";
import ModalWrapper from "@/Components/ModalWrapper";
import toast from 'react-hot-toast';
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { FaBackward } from "react-icons/fa6";
import { TbHomeEdit } from "react-icons/tb";
import { TiDeleteOutline } from "react-icons/ti";
import { BsHouseAdd } from "react-icons/bs";
import { CgDetailsMore } from "react-icons/cg";
import { FaFileImport } from "react-icons/fa6";



function IndexSites({ auth, sites, documents, flash}) {
    const { data, setData, post, get, delete: destroy } = useForm({
        sites_ids: [],
        searchTerm: '',
        address: '',
        start_date: '',
        end_date: ''
    });

    const [showAddForm, setShowAddForm] = useState(false);

    const [siteToDelete, setSiteToDelete] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);
    const [siteToEdit, setsiteToEdit] = useState(null);

    const [showDetailModal, setShowDetailModal] = useState(false);
    const [siteToShowDetails, setSiteToShowDetails] = useState(null);

    const [showSitesDelete, setShowSitesDelete] = useState(false);

    // Ajout pour la pagination
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredSites, setFilteredSites] = useState([]);

    const [showAddFileForm,setshowAddFileForm] = useState(false)

    const selectedSitesTodelete = sites.filter((site) =>
        data.sites_ids.includes(site.id)
    );

    // Fonction pour filtrer les sites
    useEffect(() => {
        if (!sites) return;

        let filtered = sites.filter(site =>
            (!data.searchTerm || (site.name && site.name.toLowerCase().includes(data.searchTerm.toLowerCase()))) &&
            (!data.address || (site.address && site.address.toLowerCase().includes(data.address.toLowerCase())))
        );

        // Filtrage par date de création
        if (data.start_date) {
            const startDate = new Date(data.start_date);
            filtered = filtered.filter(site => new Date(site.created_at) >= startDate);
        }

        if (data.end_date) {
            const endDate = new Date(data.end_date);
            // Ajuster la fin de la journée pour inclure toute la journée
            endDate.setHours(23, 59, 59, 999);
            filtered = filtered.filter(site => new Date(site.created_at) <= endDate);
        }

        setFilteredSites(filtered);
        setCurrentPage(1); // Réinitialiser à la première page lors d'une nouvelle recherche
    }, [data.searchTerm, data.address, data.start_date, data.end_date, sites]);

    // Fonction pour obtenir les éléments de la page courante
    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredSites.slice(startIndex, endIndex);
    };

    // Fonction pour gérer le changement de page
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= Math.ceil(filteredSites.length / itemsPerPage)) {
            setCurrentPage(pageNumber);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleSelectSite = (siteId) => {
        if (data.sites_ids.includes(siteId)) {
            setData("sites_ids", data.sites_ids.filter((id) => id !== siteId));
        } else {
            setData("sites_ids", [...data.sites_ids, siteId]);
        }
    };

    const handleSitesDelete = () => {
        if (data.sites_ids.length === 0) {
            toast.error("Veuillez sélectionner au moins un site.");
            return;
        }

        post(route('sites.SitesDelete'), {
            onSuccess: () => {
                setData("sites_ids", []);
                setShowSitesDelete(false);
            }
        });
    }

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

    // Options pour le nombre d'éléments par page
    const sitesPerPageOptions = [5, 10, 20, 25, 50, 100, 150,200,300,400,600,1000];
    const totalSites = filteredSites.length;
    const availableOptions = sitesPerPageOptions.filter(option => option <= totalSites || option === sitesPerPageOptions[0]);

    // Initialiser filteredSites avec sites au chargement
    useEffect(() => {
        if (sites) {
            setFilteredSites(sites);
        }
    }, [sites]);

    useEffect(() => {
        if (flash.message?.success) {
            toast.success(flash.message.success);
        }
        if (flash.message?.error) {
            toast.error(flash.message.error);
        }
    }, [flash]);

    return (
        <Authenticated user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Sites</h2>}>
            <Head title="Sites" />
            <div className="mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="mr-1 text-lg font-medium text-gray-900">Liste des sites</h3>
                            <div className="flex space-x-3">
                                {data.sites_ids.length > 0 && (
                                    <>
                                        <button
                                            onClick={() => setShowSitesDelete(true)}
                                            disabled={data.sites_ids.length === 0}
                                            className="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:text-red-900 transition"
                                        >
                                            <TiDeleteOutline/>{/*Supprimer*/}
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => setshowAddFileForm(true)}
                                    className="px-4 py-2 bg-green-100 text-green-600 rounded-md hover:text-green-900 transition"
                                >
                                    <FaFileImport/>
                                </button>
                                <button
                                    onClick={() => setShowAddForm(true)}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                                >
                                    <BsHouseAdd/>{/*Ajouter un Site*/}
                                </button>
                            </div>
                        </div>

                        {/* Barre de recherche, filtres et sélection du nombre d'éléments par page */}
                        <div className="flex items-end gap-4 mb-7">
                            {/* Recherche par nom */}
                            <div className="relative flex-1">
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    style={{height:'33px'}}
                                    type="text"
                                    name="searchTerm"
                                    value={data.searchTerm}
                                    onChange={handleFilterChange}
                                    className="block w-full pl-10 pr-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Rechercher par nom..."
                                />
                            </div>

                            {/* Recherche par adresse */}
                            <div className="relative flex-1">
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    style={{height:'33px'}}
                                    type="text"
                                    name="address"
                                    value={data.address}
                                    onChange={handleFilterChange}
                                    className="block w-full pl-10 pr-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Rechercher par adresse..."
                                />
                            </div>

                            {/* Champ pour la date de début */}
                            <div className="flex flex-col w-40">
                                <label htmlFor="start_date" className="text-xs font-medium text-gray-700 mb-1">Date de début:</label>
                                <input
                                    type="date"
                                    className="px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    id="start_date"
                                    name="start_date"
                                    value={data.start_date}
                                    onChange={handleFilterChange}
                                />
                            </div>

                            {/* Champ pour la date de fin */}
                            <div className="flex flex-col w-40">
                                <label htmlFor="end_date" className="text-xs font-medium text-gray-700 mb-1">Date de fin:</label>
                                <input
                                    type="date"
                                    className="px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    id="end_date"
                                    name="end_date"
                                    value={data.end_date}
                                    onChange={handleFilterChange}
                                />
                            </div>

                            {/* Sélection du nombre d'éléments par page */}
                            <div className="flex flex-col">
                                <label className="text-xs font-medium text-gray-700 mb-1">Par page:</label>
                                <select
                                    id="itemsPerPage"
                                    className="w-24 px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        setItemsPerPage(Number(e.target.value));
                                        setCurrentPage(1); // Réinitialiser à la première page lors du changement d'items par page
                                    }}
                                >
                                    {availableOptions.map(option => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
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
                                        Création
                                    </th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {getCurrentPageItems().length > 0 ? (
                                    getCurrentPageItems().map((site) => (
                                        <tr key={site.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                                                <input
                                                    type="checkbox"
                                                    checked={data.sites_ids.includes(site.id)}
                                                    onChange={() => handleSelectSite(site.id)}
                                                />
                                            </td>
                                            <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-900">
                                                <img
                                                    src={`/storage/${site.image}`}
                                                    alt={site.name}
                                                    style={{ width: '65px', height: '65px', objectFit: 'cover' }}
                                                />
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
                                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                {site.created_at ? new Date(site.created_at).toLocaleString("fr-FR") : "Non spécifié"}
                                            </td>
                                            <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            setShowDetailModal(true);
                                                            setSiteToShowDetails(site);
                                                        }}
                                                        className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded bg-blue-100"
                                                    >
                                                        <CgDetailsMore/>{/*Détails*/}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setShowEditModal(true);
                                                            setsiteToEdit(site);
                                                        }}
                                                        className="text-yellow-600 hover:text-yellow-900 px-2 py-1 rounded bg-yellow-100"
                                                    >
                                                        <TbHomeEdit/>{/*Modifier*/}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(site)}
                                                        className="text-red-600 hover:text-red-900 px-2 py-1 rounded bg-red-100"
                                                    >
                                                        <TiDeleteOutline/>{/*Supprimer*/}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                                            Aucun site trouvé.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {filteredSites.length > 0 && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex justify-end text-sm text-gray-500">
                                    {filteredSites.length} site(s) trouvé(s)
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-1 rounded-md ${
                                            currentPage === 1
                                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                    >
                                        <FaBackward/>
                                    </button>
                                    <span className="px-3 py-1 bg-gray-100 rounded-md">
                                        Page {currentPage} sur {Math.ceil(filteredSites.length / itemsPerPage)}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage >= Math.ceil(filteredSites.length / itemsPerPage)}
                                        className={`px-3 py-1 rounded-md ${
                                            currentPage >= Math.ceil(filteredSites.length / itemsPerPage)
                                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                    >
                                        <TbPlayerTrackNextFilled/>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    {showAddFileForm && (
                        <ModalWrapper title="Importation groupée des sites" onClose={() => setshowAddFileForm(false)}>
                            <ImportSitesXLSX auth={auth} setshowAddFileForm={setshowAddFileForm} />
                        </ModalWrapper>
                    )}
                    {showAddForm && (
                        <ModalWrapper title="Ajouter un nouveau site" onClose={() => setShowAddForm(false)}>
                            <AddSite auth={auth} setShowAddForm={setShowAddForm} />
                        </ModalWrapper>
                    )}
                    {showEditModal && (
                        <ModalWrapper title="Modifier le site" onClose={() => setShowEditModal(false)}>
                            <EditSite auth={auth} siteToEdit={siteToEdit} setShowEditModal={setShowEditModal} />
                        </ModalWrapper>
                    )}
                    {showDetailModal && (
                        <ModalWrapper title="Détails du Site" onClose={() => setShowDetailModal(false)}>
                            <Details auth={auth} documents={documents} siteDetails={siteToShowDetails} setShowDetailModal={setShowDetailModal} />
                        </ModalWrapper>
                    )}
                    {isModalOpen && (
                        <ConfirmDeleteSite
                            onConfirm={confirmDelete}
                            onCancel={cancelDelete}
                            siteToDelete={siteToDelete}
                        />
                    )}
                    {showSitesDelete && (
                        <ConfirmSitesDelete
                            sitesToDelete={selectedSitesTodelete}
                            onConfirm={handleSitesDelete}
                            onCancel={() => setShowSitesDelete(false)}
                        />
                    )}
                </div>
                {/*{import.meta.env.DEV && (*/}
                {/*    <div className="mt-4 p-2 bg-gray-100 rounded">*/}
                {/*        <p>IDs des utilisateurs sélectionnés :</p>*/}
                {/*        <pre>{JSON.stringify(data, null, 2)}</pre>*/}
                {/*    </div>*/}
                {/*)}*/}
            </div>
        </Authenticated>
    );
}

export default IndexSites;
