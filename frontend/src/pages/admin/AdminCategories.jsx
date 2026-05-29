import { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ nom: '', description: '' })
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  const fetch = () => api.get('/categories').then(({ data }) => setCategories(data))
  useEffect(() => { fetch() }, [])

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      editing ? await api.put(`/categories/${editing}`, form) : await api.post('/categories', form)
      setForm({ nom: '', description: '' }); setEditing(null); fetch()
    } finally { setSaving(false) }
  }

  const del = async (id) => {
    if (!confirm('Supprimer cette catégorie ?')) return
    await api.delete(`/categories/${id}`); fetch()
  }

  const startEdit = (c) => { setEditing(c.id); setForm({ nom: c.nom, description: c.description || '' }) }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Catégories</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{editing ? 'Modifier' : 'Nouvelle catégorie'}</h2>
          <form onSubmit={save} className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Nom</label>
              <input required value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={saving}
                className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50">
                {saving ? '...' : editing ? 'Modifier' : 'Ajouter'}
              </button>
              {editing && (
                <button type="button" onClick={() => { setEditing(null); setForm({ nom: '', description: '' }) }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Liste ({categories.length})</h2>
          <div className="space-y-2">
            {categories.map((c) => (
              <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{c.nom}</p>
                  <p className="text-xs text-gray-500">{c.products_count} produit(s)</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(c)} className="text-xs text-blue-600 hover:underline">Modifier</button>
                  <button onClick={() => del(c.id)} className="text-xs text-red-500 hover:underline">Supprimer</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
