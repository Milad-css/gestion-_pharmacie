import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Profile() {
  const { user, logout } = useAuth()
  const [form, setForm] = useState({ name: user.name, telephone: user.telephone || '', adresse: user.adresse || '', password: '', password_confirmation: '' })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handle = (e) => {
    e.preventDefault()
    setSuccess(''); setError('')
    setSaving(true)
    const payload = { name: form.name, telephone: form.telephone, adresse: form.adresse }
    if (form.password) { payload.password = form.password; payload.password_confirmation = form.password_confirmation }
    api.put('/profile', payload)
      .then(() => {
        setSuccess('Profil mis à jour avec succès.')
        setForm({ ...form, password: '', password_confirmation: '' })
      })
      .catch((err) => setError(err.response?.data?.message || 'Erreur.'))
      .finally(() => setSaving(false))
  }

  const inputClass = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50 transition-all"

  const avatarColors = ['bg-indigo-600', 'bg-violet-600', 'bg-teal-600', 'bg-rose-600']
  const colorIndex = user.name.charCodeAt(0) % avatarColors.length

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Mon profil</h1>

      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
        {/* Profile header */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 px-8 py-8">
          <div className="flex items-center gap-5">
            <div className={`w-16 h-16 rounded-2xl ${avatarColors[colorIndex]} flex items-center justify-center text-2xl font-bold text-white shadow-lg`}>
              {user.name[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <p className="text-slate-400 text-sm mt-0.5">{user.email}</p>
              <span className="inline-block mt-2 text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full capitalize">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm p-4 rounded-xl mb-6 flex items-center gap-2.5">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {success}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl mb-6 flex items-center gap-2.5">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handle} className="space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Informations personnelles</h3>
              <div className="space-y-4">
                {[['Nom complet', 'name', 'text'], ['Téléphone', 'telephone', 'text'], ['Adresse', 'adresse', 'text']].map(([label, field, type]) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                    <input type={type} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} className={inputClass} />
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Changer le mot de passe</h3>
              <div className="space-y-4">
                {[['Nouveau mot de passe', 'password'], ['Confirmer le mot de passe', 'password_confirmation']].map(([label, field]) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                    <input type="password" value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      placeholder="Laisser vide pour ne pas changer" className={inputClass} />
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" disabled={saving}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors">
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
