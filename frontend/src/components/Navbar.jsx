import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-slate-900 sticky top-0 z-50 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-black tracking-tighter">Rx</span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">PharmaCie</span>
        </Link>

        <div className="flex items-center gap-1">
          <Link to="/" className="text-slate-400 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
            Produits
          </Link>
          {user ? (
            <>
              <Link to="/orders" className="text-slate-400 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                Commandes
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-slate-400 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                  Admin
                </Link>
              )}
              <Link to="/cart" className="relative text-slate-400 hover:text-white hover:bg-slate-800 p-2.5 rounded-lg transition-colors ml-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-indigo-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">
                    {itemCount}
                  </span>
                )}
              </Link>
              <div className="w-px h-5 bg-slate-700 mx-2" />
              <Link to="/profile" className="flex items-center gap-2 text-slate-300 hover:text-white px-2 py-1.5 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
                <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {user.name[0].toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm">{user.name.split(' ')[0]}</span>
              </Link>
              <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 px-3 py-2 rounded-lg hover:bg-slate-800 text-sm transition-colors">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-400 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                Connexion
              </Link>
              <Link to="/register" className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium ml-2 transition-colors">
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
