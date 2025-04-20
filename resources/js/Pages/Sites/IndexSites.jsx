import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm} from "@inertiajs/react";
import React, { useEffect } from "react";
import Pagination from "@/Components/Pagination";

function IndexSites({auth,sites}) {
    const { data, setData, get, delete: destroy} = useForm({
        name:'',
        address:'',
        page: sites.current_page
    })

    const handleFilter = (e) => setData(e.target.name,e.target.value)

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            get('sites', {
                preserveState: true,
                name: data.name,
                address: data.address,
                page: data.page
            });
        }, 300);

        return () => clearTimeout(timeoutId);
    },[data]);

    const handleDelete = (SiteId) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce site ?')) {
            destroy(`/sites/delete/${SiteId}`);
        }
    };

  return (
    <Authenticated user={auth.user} header={<h2>Liste des Sites de M-AUTOMOTIV</h2>}>
            <Head title="Sites M-AUTOMOTIV" />
            <Link href={'sites/add'} className="btn btn-success">Ajouter un Site</Link>
            <table className="table">
                <thead>
                    <th>Image</th>
                    <th>
                        <label>Name</label>
                        <input type="text" name="name" value={data.name} onChange={handleFilter} placeholder="filter by name"/>
                    </th>
                    {/* <th>Email</th>
                    <th>Phone</th>
                    <th>Web</th> */}
                    <th>
                        <label>Address</label>
                        <input type="text" name="address" value={data.address} onChange={handleFilter} placeholder="filter by Address"/>
                    </th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>Actions</th>
                    <th></th>
                </thead>
                <tbody>
                    {sites && sites.data.map((site) => (
                        <tr key={site.id}>
                            <td><img src={'storage/' + site.image} style={{width: '70px'}} alt={site.name} /></td>
                            <td>{site.name}</td>
                            {/* <td>{site.email}</td>
                            <td>{site.phone}</td>
                            <td>{site.web}</td> */}
                            <td>{site.address}</td>
                            <td>{site.latitude}</td>
                            <td>{site.longitude}</td>
                            <td>
                                <Link href={'sites/edit/'+site.id} className='btn btn-success'>Edit</Link>
                                <button onClick={() => handleDelete(site.id)} className='btn btn-danger'>Delete</button>
                                <Link href={'sites/details/' + site.id} className='btn btn-info'>details</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination links={sites.links} currentPage={sites.current_page} setCurrentPage={(page)=> setData('page',page)}/>

            {/* <div className="row">
            {sites.map((site) => (
                <div className="col-md-4 mb-4" key={site.id}>
                    <div className="card h-100">
                        <img 
                            src={'/storage/' + site.image} 
                            className="card-img-top" 
                            alt={site.name}
                            style={{ height: '200px', objectFit: 'cover' }}
                        />
                        <div className="card-body">
                            <h5 className="card-title">{site.name}</h5>
                            <p className="card-text"><strong>Email:</strong> {site.email}</p>
                            <p className="card-text"><strong>Téléphone:</strong> {site.phone}</p>
                            <p className="card-text"><strong>Latitude:</strong> {site.latitude}</p>
                            <p className="card-text"><strong>Longitude:</strong> {site.longitude}</p>
                        </div>
                        <div className="card-footer d-flex justify-content-between">
                            <Link href={'sites/edit/' + site.id} className='btn btn-success btn-sm'>Edit</Link>
                            <button onClick={() => handleDelete(site.id)} className='btn btn-danger btn-sm'>Delete</button>
                            <Link href={'site/details/' + site.id} className='btn btn-info btn-sm'>Details</Link>
                        </div>
                    </div>
                </div>
            ))}
        </div> */}
    </Authenticated>
  )
}

export default IndexSites