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

  const save = (e) => {
    e.preventDefault()
    setSaving(true)
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => { if (v !== '') fd.append(k, v) })
    if (fileRef.current?.files[0]) fd.append('image', fileRef.current.files[0])
    if (editing) fd.append('_method', 'PUT')
    const url = editing ? `/products/${editing}` : '/products'
    api.post(url, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then(() => {
        setForm(empty); setEditing(null)
        if (fileRef.current) fileRef.current.value = ''
        fetchProducts()
      })
      .finally(() => setSaving(false))
  }

  const del = (id) => {
    if (!confirm('Supprimer ce produit ?')) return
    api.delete(`/products/${id}`).then(() => fetchProducts())
  }

  const startEdit = (p) => {
    setEditing(p.id)
    setForm({ category_id: p.category_id || '', nom: p.nom, description: p.description || '', prix: p.prix, stock: p.stock, date_expiration: p.date_expiration || '', actif: p.actif })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const inputClass = "mt-1.5 w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50 transition-all"

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Produits</h1>
        <p className="text-slate-500 text-sm mt-1">Gérez votre catalogue de médicaments</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 sticky top-24">
            <h2 className="text-base font-bold text-slate-900 mb-5">
              {editing ? 'Modifier le produit' : 'Nouveau produit'}
            </h2>
            <form onSubmit={save} className="space-y-4">
              {[
                ['Nom du produit', 'nom', 'text', true],
                ['Prix (DH)', 'prix', 'number', true],
                ['Stock', 'stock', 'number', false],
                ['Date d\'expiration', 'date_expiration', 'date', false],
              ].map(([label, field, type, req]) => (
                <div key={field}>
                  <label className="text-sm font-medium text-slate-700">{label}</label>
                  <input type={type} required={req} value={form[field]} onChange={set(field)} className={inputClass} />
                </div>
              ))}
              <div>
                <label className="text-sm font-medium text-slate-700">Catégorie</label>
                <select value={form.category_id} onChange={set('category_id')} className={inputClass}>
                  <option value="">Sans catégorie</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Description</label>
                <textarea value={form.description} onChange={set('description')} rows={2} className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Image</label>
                <input type="file" accept="image/*" ref={fileRef}
                  className="mt-1.5 w-full text-sm text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 file:cursor-pointer cursor-pointer" />
              </div>
              <div className="flex items-center gap-3 py-1">
                <div className="relative inline-flex">
                  <input type="checkbox" id="actif" checked={form.actif} onChange={set('actif')}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                </div>
                <label htmlFor="actif" className="text-sm font-medium text-slate-700 cursor-pointer">Produit actif</label>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="submit" disabled={saving}
                  className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                  {saving ? '...' : editing ? 'Enregistrer' : 'Ajouter'}
                </button>
                {editing && (
                  <button type="button" onClick={() => { setEditing(null); setForm(empty) }}
                    className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                    Annuler
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-slate-900">Liste des produits</h2>
            {meta && <span className="text-sm text-slate-400 font-medium">{meta.total} produit(s)</span>}
          </div>
          <div className="space-y-2">
            {products.map((p) => (
              <div key={p.id} className="bg-white border border-slate-100 shadow-sm rounded-xl p-4 flex items-center gap-4 hover:border-slate-200 transition-colors">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-100">
                  {p.image
                    ? <img src={`http://localhost:8000/storage/${p.image}`} className="w-full h-full object-cover" alt="" />
                    : <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate">{p.nom}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{p.category?.nom || 'Sans catégorie'} · {p.stock} en stock</p>
                </div>
                <p className="text-sm font-bold text-slate-900 flex-shrink-0">{Number(p.prix).toFixed(2)} DH</p>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${p.actif ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {p.actif ? 'Actif' : 'Inactif'}
                </span>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => startEdit(p)}
                    className="px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                    Modifier
                  </button>
                  <button onClick={() => del(p.id)}
                    className="px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>

          {meta && meta.last_page > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === p ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-600'}`}>
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
