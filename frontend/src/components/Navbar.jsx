import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold text-emerald-600">
          PharmaCie
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/" className="text-gray-600 hover:text-emerald-600 text-sm font-medium">
            Produits
          </Link>
          {user ? (
            <>
              <Link to="/orders" className="text-gray-600 hover:text-emerald-600 text-sm font-medium">
                Mes commandes
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-gray-600 hover:text-emerald-600 text-sm font-medium">
                  Admin
                </Link>
              )}
              <Link to="/cart" className="relative text-gray-600 hover:text-emerald-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
              <Link to="/profile" className="text-sm text-gray-700 font-medium">
                {user.name}
              </Link>
              <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-600 hover:text-emerald-600 font-medium">
                Connexion
              </Link>
              <Link to="/register"
                className="bg-emerald-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-emerald-700">
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
