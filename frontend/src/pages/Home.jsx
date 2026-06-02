import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import ProductImage from '../components/ProductImage'

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
    <div>
      {/* Hero search */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Vos médicaments, en quelques clics</h1>
          <p className="text-slate-400 text-sm mb-7">Parcourez notre catalogue et passez commande facilement</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text" placeholder="Rechercher un produit..."
                value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                className="w-full bg-white rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400 shadow-sm" />
            </div>
            <select value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setPage(1) }}
              className="bg-white rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm min-w-44">
              <option value="">Toutes les catégories</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-slate-500 font-medium">Aucun produit trouvé.</p>
            <p className="text-slate-400 text-sm mt-1">Essayez avec d'autres termes de recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
                <div className="relative overflow-hidden">
                  <ProductImage image={p.image} category={p.category} name={p.nom} className="h-44" />
                  {p.stock === 0 && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                      <span className="bg-slate-800/80 text-white text-xs font-semibold px-3 py-1 rounded-full">Rupture</span>
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  {p.category?.nom && (
                    <span className="inline-block text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full mb-2 w-fit">{p.category.nom}</span>
                  )}
                  <Link to={`/products/${p.id}`} className="font-semibold text-slate-900 hover:text-indigo-600 text-sm leading-snug mb-1 transition-colors">{p.nom}</Link>
                  <p className="text-xs text-slate-400 line-clamp-2 flex-1 mt-1">{p.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-bold text-slate-900">{Number(p.prix).toFixed(2)} <span className="text-sm font-medium text-slate-500">DA</span></span>
                    {p.stock > 0 && (
                      <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{p.stock} en stock</span>
                    )}
                  </div>
                  {user && p.stock > 0 && (
                    <button onClick={() => handleAdd(p.id)} disabled={adding === p.id}
                      className="mt-3 w-full bg-indigo-600 text-white text-sm py-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium">
                      {adding === p.id ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Ajout...
                        </span>
                      ) : 'Ajouter au panier'}
                    </button>
                  )}
                  {!user && (
                    <Link to="/login" className="mt-3 block text-center bg-slate-100 text-slate-600 text-sm py-2.5 rounded-xl hover:bg-slate-200 transition-colors font-medium">
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
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === p ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-600'}`}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
