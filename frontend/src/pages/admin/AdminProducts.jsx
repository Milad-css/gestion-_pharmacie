import { useEffect, useRef, useState } from 'react'
import api from '../../api/axios'

const empty = { category_id: '', nom: '', description: '', prix: '', stock: '', date_expiration: '', actif: true }

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState(null)
  const fileRef = useRef()

  const fetchProducts = () =>
    api.get(`/products?page=${page}&per_page=10`).then(({ data }) => { setProducts(data.data); setMeta(data) })

  useEffect(() => { fetchProducts() }, [page])
  useEffect(() => { api.get('/categories').then(({ data }) => setCategories(data)) }, [])

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => { if (v !== '') fd.append(k, v) })
      if (fileRef.current?.files[0]) fd.append('image', fileRef.current.files[0])
      if (editing) {
        fd.append('_method', 'PUT')
        await api.post(`/products/${editing}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      } else {
        await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      }
      setForm(empty); setEditing(null)
      if (fileRef.current) fileRef.current.value = ''
      fetchProducts()
    } finally { setSaving(false) }
  }

  const del = async (id) => {
    if (!confirm('Supprimer ce produit ?')) return
    await api.delete(`/products/${id}`); fetchProducts()
  }

  const startEdit = (p) => {
    setEditing(p.id)
    setForm({ category_id: p.category_id || '', nom: p.nom, description: p.description || '', prix: p.prix, stock: p.stock, date_expiration: p.date_expiration || '', actif: p.actif })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Produits</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{editing ? 'Modifier' : 'Nouveau produit'}</h2>
          <form onSubmit={save} className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3">
            {[['Nom *', 'nom', 'text', true], ['Prix (DA) *', 'prix', 'number', true], ['Stock', 'stock', 'number', false], ['Date expiration', 'date_expiration', 'date', false]].map(([label, field, type, req]) => (
              <div key={field}>
                <label className="text-sm font-medium text-gray-700">{label}</label>
                <input type={type} required={req} value={form[field]} onChange={set(field)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            ))}
            <div>
              <label className="text-sm font-medium text-gray-700">Catégorie</label>
              <select value={form.category_id} onChange={set('category_id')}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="">Aucune</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea value={form.description} onChange={set('description')} rows={2}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Image</label>
              <input type="file" accept="image/*" ref={fileRef}
                className="mt-1 w-full text-sm text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-emerald-50 file:text-emerald-700" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="actif" checked={form.actif} onChange={set('actif')} className="rounded" />
              <label htmlFor="actif" className="text-sm font-medium text-gray-700">Actif</label>
            </div>
            <div className="flex gap-2 pt-1">
              <button type="submit" disabled={saving}
                className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50">
                {saving ? '...' : editing ? 'Modifier' : 'Ajouter'}
              </button>
              {editing && (
                <button type="button" onClick={() => { setEditing(null); setForm(empty) }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Liste{meta ? ` (${meta.total})` : ''}</h2>
          <div className="space-y-2">
            {products.map((p) => (
              <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {p.image
                    ? <img src={`http://localhost:8000/storage/${p.image}`} className="w-full h-full object-cover" alt="" />
                    : <svg className="w-6 h-6 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{p.nom}</p>
                  <p className="text-xs text-gray-500">{p.category?.nom} · Stock: {p.stock}</p>
                </div>
                <p className="text-sm font-bold text-gray-900">{Number(p.prix).toFixed(2)} DA</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${p.actif ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                  {p.actif ? 'Actif' : 'Inactif'}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(p)} className="text-xs text-blue-600 hover:underline">Modifier</button>
                  <button onClick={() => del(p.id)} className="text-xs text-red-500 hover:underline">Supprimer</button>
                </div>
              </div>
            ))}
          </div>
          {meta && meta.last_page > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium ${page === p ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:border-emerald-500'}`}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
