import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    login(form.email, form.password)
      .then((user) => navigate(user.role === 'admin' ? '/admin' : '/'))
      .catch((err) => setError(err.response?.data?.message || 'Identifiants incorrects.'))
      .finally(() => setLoading(false))
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex-col items-center justify-center p-12">
        <div className="max-w-sm text-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-900/50">
            <span className="text-white text-sm font-black tracking-tighter">Rx</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">PharmaCie</h2>
          <p className="text-slate-400">Votre pharmacie en ligne de confiance</p>
          <div className="mt-10 space-y-3 text-left">
            {['Médicaments disponibles 24h/24', 'Livraison rapide à domicile', 'Commandes sécurisées'].map((f) => (
              <div key={f} className="flex items-center gap-3 text-slate-300 text-sm">
                <div className="w-5 h-5 bg-indigo-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-10 justify-center">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16M4 12h16" />
              </svg>
            </div>
            <span className="font-bold text-slate-900 text-xl">PharmaCie</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-1">Bon retour !</h1>
          <p className="text-slate-500 text-sm mb-8">Connectez-vous à votre compte pour continuer</p>

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
              <label className="block text-sm font-medium text-slate-700 mb-2">Adresse email</label>
              <input type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="votre@email.com"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-all placeholder-slate-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Mot de passe</label>
              <input type="password" required value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-all placeholder-slate-400" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors mt-2">
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold">S'inscrire gratuitement</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
