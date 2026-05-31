import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'

export default function Home() {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [categoryId, setCategoryId] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(null)
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState(null)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ page })
    if (categoryId) params.set('category_id', categoryId)
    if (search) params.set('search', search)
    api.get(`/products?${params}`).then(({ data }) => {
      setProducts(data.data)
      setMeta(data)
    }).finally(() => setLoading(false))
  }, [categoryId, search, page])

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data))
  }, [])

  const handleAdd = (productId) => {
    if (!user) return
    setAdding(productId)
    addToCart(productId)
      .then(() => setAdding(null))
      .catch(() => setAdding(null))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text" placeholder="Rechercher un produit..."
          value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        <select value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setPage(1) }}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
          <option value="">Toutes les catégories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div></div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 py-20">Aucun produit trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="h-44 bg-emerald-50 flex items-center justify-center">
                {p.image ? (
                  <img src={`http://localhost:8000/storage/${p.image}`} alt={p.nom} className="h-full w-full object-cover" />
                ) : (
                  <svg className="w-16 h-16 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                )}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <p className="text-xs text-emerald-600 font-medium mb-1">{p.category?.nom}</p>
                <Link to={`/products/${p.id}`} className="font-semibold text-gray-900 hover:text-emerald-600 text-sm leading-snug mb-1">{p.nom}</Link>
                <p className="text-xs text-gray-500 line-clamp-2 flex-1">{p.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-bold text-gray-900">{Number(p.prix).toFixed(2)} DA</span>
                  <span className={`text-xs font-medium ${p.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {p.stock > 0 ? `${p.stock} en stock` : 'Rupture'}
                  </span>
                </div>
                {user && p.stock > 0 && (
                  <button onClick={() => handleAdd(p.id)} disabled={adding === p.id}
                    className="mt-3 w-full bg-emerald-600 text-white text-sm py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50">
                    {adding === p.id ? '...' : 'Ajouter au panier'}
                  </button>
                )}
                {!user && (
                  <Link to="/login" className="mt-3 block text-center bg-gray-100 text-gray-700 text-sm py-2 rounded-lg hover:bg-gray-200">
                    Connexion pour commander
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {meta && meta.last_page > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-lg text-sm font-medium ${page === p ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:border-emerald-500'}`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
