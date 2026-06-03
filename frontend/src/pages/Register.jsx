import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

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

  const inputClass = "w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-all placeholder-slate-400"

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex-col items-center justify-center p-12">
        <div className="max-w-xs text-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-900/50">
            <span className="text-white text-sm font-black tracking-tighter">Rx</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">PharmaCie</h2>
          <p className="text-slate-400 text-sm">Créez votre compte et accédez à tous nos produits pharmaceutiques</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-10 bg-slate-50 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16M4 12h16" />
              </svg>
            </div>
            <span className="font-bold text-slate-900 text-xl">PharmaCie</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-1">Créer un compte</h1>
          <p className="text-slate-500 text-sm mb-8">Remplissez le formulaire pour commencer</p>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl mb-6 flex items-center gap-2.5">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.general}
            </div>
          )}

          <form onSubmit={handle} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Nom complet</label>
                <input type="text" value={form.name} onChange={set('name')} placeholder="Jean Dupont" className={inputClass} />
                {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name[0]}</p>}
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input type="email" value={form.email} onChange={set('email')} placeholder="votre@email.com" className={inputClass} />
                {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email[0]}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Mot de passe</label>
                <input type="password" value={form.password} onChange={set('password')} placeholder="••••••••" className={inputClass} />
                {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password[0]}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Confirmer</label>
                <input type="password" value={form.password_confirmation} onChange={set('password_confirmation')} placeholder="••••••••" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Téléphone</label>
                <input type="text" value={form.telephone} onChange={set('telephone')} placeholder="0600000000" className={inputClass} />
                {errors.telephone && <p className="text-red-500 text-xs mt-1.5">{errors.telephone[0]}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Adresse</label>
                <input type="text" value={form.adresse} onChange={set('adresse')} placeholder="Votre adresse" className={inputClass} />
                {errors.adresse && <p className="text-red-500 text-xs mt-1.5">{errors.adresse[0]}</p>}
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors mt-2">
              {loading ? 'Création du compte...' : "Créer mon compte"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
