import { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ nom: '', description: '' })
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  const fetchData = () => api.get('/categories').then(({ data }) => setCategories(data))
  useEffect(() => { fetchData() }, [])

  const save = (e) => {
    e.preventDefault()
    setSaving(true)
    const request = editing
      ? api.put(`/categories/${editing}`, form)
      : api.post('/categories', form)
    request
      .then(() => { setForm({ nom: '', description: '' }); setEditing(null); fetchData() })
      .finally(() => setSaving(false))
  }

  const del = (id) => {
    if (!confirm('Supprimer cette catégorie ?')) return
    api.delete(`/categories/${id}`).then(() => fetchData())
  }

  const startEdit = (c) => { setEditing(c.id); setForm({ nom: c.nom, description: c.description || '' }) }

  const inputClass = "mt-1.5 w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50 transition-all"

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Catégories</h1>
        <p className="text-slate-500 text-sm mt-1">Organisez votre catalogue de produits</p>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6">
            <h2 className="text-base font-bold text-slate-900 mb-5">
              {editing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
            </h2>
            <form onSubmit={save} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Nom de la catégorie</label>
                <input required value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  placeholder="Ex: Antibiotiques" className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                  placeholder="Description optionnelle..." className={inputClass} />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="submit" disabled={saving}
                  className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                  {saving ? '...' : editing ? 'Enregistrer' : 'Ajouter'}
                </button>
                {editing && (
                  <button type="button" onClick={() => { setEditing(null); setForm({ nom: '', description: '' }) }}
                    className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                    Annuler
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-slate-900">Liste des catégories</h2>
            <span className="text-sm text-slate-400 font-medium">{categories.length} catégorie(s)</span>
          </div>
          <div className="space-y-2">
            {categories.map((c) => (
              <div key={c.id} className="bg-white border border-slate-100 shadow-sm rounded-xl p-4 flex items-center justify-between hover:border-slate-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{c.nom}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{c.products_count} produit(s)</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => startEdit(c)}
                    className="px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                    Modifier
                  </button>
                  <button onClick={() => del(c.id)}
                    className="px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-sm">
                Aucune catégorie créée pour l'instant.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
