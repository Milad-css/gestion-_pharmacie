import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
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
        setSuccess('Profil mis à jour.')
        setForm({ ...form, password: '', password_confirmation: '' })
      })
      .catch((err) => setError(err.response?.data?.message || 'Erreur.'))
      .finally(() => setSaving(false))
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mon profil</h1>
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xl font-bold">
            {user.name[0].toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium capitalize">{user.role}</span>
          </div>
        </div>
        {success && <p className="bg-emerald-50 text-emerald-700 text-sm p-3 rounded-lg mb-4">{success}</p>}
        {error && <p className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</p>}
        <form onSubmit={handle} className="space-y-4">
          {[['Nom', 'name'], ['Téléphone', 'telephone'], ['Adresse', 'adresse']].map(([label, field]) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          ))}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Changer le mot de passe (optionnel)</p>
            {[['Nouveau mot de passe', 'password'], ['Confirmer', 'password_confirmation']].map(([label, field]) => (
              <div key={field} className="mb-3">
                <label className="block text-sm text-gray-600 mb-1">{label}</label>
                <input type="password" value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            ))}
          </div>
          <button type="submit" disabled={saving}
            className="w-full bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50">
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </form>
      </div>
    </div>
  )
}
