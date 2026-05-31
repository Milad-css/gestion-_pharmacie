import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '', telephone: '', adresse: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handle = (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    register(form)
      .then(() => navigate('/'))
      .catch((err) => setErrors(err.response?.data?.errors || { general: err.response?.data?.message || 'Erreur.' }))
      .finally(() => setLoading(false))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Créer un compte</h1>
        {errors.general && <p className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{errors.general}</p>}
        <form onSubmit={handle} className="space-y-4">
          {[
            { label: 'Nom complet',            name: 'name',                  type: 'text' },
            { label: 'Email',                  name: 'email',                 type: 'email' },
            { label: 'Mot de passe',           name: 'password',              type: 'password' },
            { label: 'Confirmer le mot de passe', name: 'password_confirmation', type: 'password' },
            { label: 'Téléphone',              name: 'telephone',             type: 'text' },
            { label: 'Adresse',                name: 'adresse',               type: 'text' },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={type}
                value={form[name]}
                onChange={set(name)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name][0]}</p>}
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="w-full bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50">
            {loading ? 'Inscription...' : "S'inscrire"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-emerald-600 hover:underline font-medium">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
