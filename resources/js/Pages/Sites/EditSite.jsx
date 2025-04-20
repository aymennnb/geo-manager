import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import React from "react";

function EditSite({auth,site}) {
    const { data, setData, post, errors } = useForm({
        id: site.id,
        name: site.name,
        web: site.web,
        email: site.email,
        phone: site.phone,
        address: site.address,
        latitude: site.latitude,
        longitude: site.longitude,
        image: null,
    });
    
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("sites.update"));
    };
    return (
        <Authenticated user={auth.user} header={<h2>Editer un Site</h2>}>
            <Head title="Edit Site" />
            <form onSubmit={handleSubmit}>
                <div className="col-md-3">
                    <img src={'../../storage/'+ site.image} style={{width:'200px'}} alt={site.name} />
                </div>
                <label>Photo pour ce site</label>
                <input 
                  type="file" 
                  onChange={e => setData('image', e.target.files[0])} 
                />
                {errors.image && <div className="text-danger">{errors.image}</div>}
                <label htmlFor="name" className="form-label">
                    Nom du site
                </label>
                <input
                    id="name"
                    className="form-control"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                />
                {errors.name && <div className="text-danger">{errors.name}</div>}
                <label htmlFor="web" className="form-label">
                    Site web
                </label>
                <input
                    id="web"
                    className="form-control"
                    type="url"
                    value={data.web}
                    onChange={(e) => setData("web", e.target.value)}
                />
                {errors.web && <div className="text-danger">{errors.web}</div>}
                <label htmlFor="email" className="form-label">
                    Email
                </label>
                <input
                    id="email"
                    className="form-control"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                />
                {errors.email && <div className="text-danger">{errors.email}</div>}
                <label htmlFor="phone" className="form-label">
                    Téléphone
                </label>
                <input
                    id="phone"
                    className="form-control"
                    type="tel"
                    value={data.phone}
                    onChange={(e) => setData("phone", e.target.value)}
                />
                {errors.phone && <div className="text-danger">{errors.phone}</div>}
                <label htmlFor="address" className="form-label">
                    Adresse
                </label>
                <input
                    id="address"
                    className="form-control"
                    type="text"
                    value={data.address}
                    onChange={(e) => setData("address", e.target.value)}
                />
                {errors.address && <div className="text-danger">{errors.address}</div>}
                <label htmlFor="latitude" className="form-label">
                    Latitude
                </label>
                <input
                    id="latitude"
                    className="form-control"
                    type="number"
                    step="any"
                    value={data.latitude}
                    onChange={(e) => setData("latitude", e.target.value)}
                />
                {errors.latitude && <div className="text-danger">{errors.latitude}</div>}
                <label htmlFor="longitude" className="form-label">
                    Longitude
                </label>
                <input
                    id="longitude"
                    className="form-control"
                    type="number"
                    step="any"
                    value={data.longitude}
                    onChange={(e) => setData("longitude", e.target.value)}
                />
                {errors.longitude && <div className="text-danger">{errors.longitude}</div>}
                <button className="btn btn-success" type="submit">
                    save
                </button>
            </form>
        </Authenticated>
    );
}

export default EditSite;