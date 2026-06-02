import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import ProductImage from '../components/ProductImage'

export default function ProductDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [qty, setQty] = useState(1)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => setProduct(data))
      .catch(() => navigate('/'))
  }, [id])

  const handleAdd = () => {
    if (!user) return navigate('/login')
    setAdding(true)
    addToCart(product.id, qty)
      .then(() => { setAdding(false); setAdded(true); setTimeout(() => setAdded(false), 2000) })
      .catch(() => setAdding(false))
  }

  if (!product) return (
    <div className="flex justify-center p-24">
      <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 mb-8 transition-colors font-medium">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Retour
      </button>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/5 flex-shrink-0">
            <ProductImage image={product.image} category={product.category} name={product.nom} className="h-72 md:h-full min-h-72" />
          </div>

          <div className="flex-1 p-8 flex flex-col justify-between">
            <div>
              {product.category?.nom && (
                <span className="inline-block text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-4">{product.category.nom}</span>
              )}
              <h1 className="text-2xl font-bold text-slate-900 mb-3">{product.nom}</h1>
              <p className="text-slate-500 text-sm leading-relaxed mb-5">{product.description}</p>
              {product.date_expiration && (
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Expire le {product.date_expiration}
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 pt-6">
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-bold text-slate-900">{Number(product.prix).toFixed(2)}</span>
                <span className="text-lg text-slate-500 font-medium">DA</span>
              </div>
              <div className={`inline-flex items-center gap-1.5 text-sm font-medium mb-6 px-3 py-1.5 rounded-full ${product.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
              </div>

              {product.stock > 0 && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3.5 py-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors text-lg font-light">−</button>
                    <span className="px-4 py-2.5 text-sm font-semibold text-slate-900 min-w-10 text-center">{qty}</span>
                    <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-3.5 py-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors text-lg font-light">+</button>
                  </div>
                  <button onClick={handleAdd} disabled={adding || added}
                    className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${added ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50'}`}>
                    {adding ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Ajout...
                      </span>
                    ) : added ? '✓ Ajouté au panier' : 'Ajouter au panier'}
                  </button>
                </div>
              )}
              {!user && (
                <button onClick={() => navigate('/login')} className="w-full bg-indigo-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
                  Se connecter pour commander
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
