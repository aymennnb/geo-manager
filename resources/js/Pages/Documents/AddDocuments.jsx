import React from 'react'
import { Head,Link,useForm } from '@inertiajs/react'
import Authenticated from '@/Layouts/AuthenticatedLayout'

function AddDocuments({auth}) {
  const { data, setData, post, errors } = useForm({
          title: "",
          description: "",
          file_path: null,
          uploaded_by: "",
      });
      const handleSubmit = () => {
        alert('Ops !')
      }
  return (
    <Authenticated user={auth.user} header={<h2>Ajouter un nouveau documents</h2>}>
        <Head title="new document"/>
        <form onSubmit={handleSubmit}>
                <label className="form-label" >documents</label>
                <input 
                  className="form-control"
                  type="file" 
                  onChange={e => setData('file_path', e.target.files[0])} 
                />
                {/* {errors.image && <div className="text-danger">{errors.image}</div>} */}
                <label className="form-label">
                  title
                </label>
                <input
                    id="title"
                    className="form-control"
                    type="text"
                    value={data.title}
                    onChange={(e) => setData("title", e.target.value)}
                />
                {/* {errors.web && <div className="text-danger">{errors.web}</div>} */}
                <label className="form-label">
                  description
                </label>
                <textarea className="form-control" id="description" value={data.description} onChange={(e) => setData("description", e.target.value)}></textarea>
                {/* {errors.email && <div className="text-danger">{errors.email}</div>} */}
                <label className="form-label">
                  uploaded by
                </label>
                <input
                    id="uploaded_by"
                    className="form-control"
                    type="text"
                    value={data.uploaded_by}
                    onChange={(e) => setData("uploaded_by", e.target.value)}
                />
                {/* {errors.phone && <div className="text-danger">{errors.phone}</div>} */}
                <button className="btn btn-success" type="submit">
                    Ajouter
                </button>
            </form>
    </Authenticated>
  )
}

export default AddDocuments