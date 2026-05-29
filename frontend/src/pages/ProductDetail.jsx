import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function ProductDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [qty, setQty] = useState(1)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => setProduct(data))
      .catch(() => navigate('/'))
  }, [id])

  const handleAdd = async () => {
    if (!user) return navigate('/login')
    setAdding(true)
    try { await addToCart(product.id, qty) } finally { setAdding(false) }
  }

  if (!product) return <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div></div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="text-sm text-emerald-600 hover:underline mb-6 flex items-center gap-1">
        &larr; Retour
      </button>
      <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2 h-64 bg-emerald-50 rounded-xl flex items-center justify-center">
          {product.image ? (
            <img src={`http://localhost:8000/storage/${product.image}`} alt={product.nom} className="h-full w-full object-cover rounded-xl" />
          ) : (
            <svg className="w-24 h-24 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          )}
        </div>
        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <p className="text-sm text-emerald-600 font-medium mb-1">{product.category?.nom}</p>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.nom}</h1>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">{product.description}</p>
            {product.date_expiration && (
              <p className="text-xs text-gray-400 mb-2">Exp: {product.date_expiration}</p>
            )}
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 mb-4">{Number(product.prix).toFixed(2)} DA</p>
            <p className={`text-sm font-medium mb-4 ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
            </p>
            {product.stock > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-gray-600 hover:text-gray-900">−</button>
                  <span className="px-4 py-2 text-sm font-medium">{qty}</span>
                  <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-3 py-2 text-gray-600 hover:text-gray-900">+</button>
                </div>
                <button onClick={handleAdd} disabled={adding}
                  className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50">
                  {adding ? '...' : 'Ajouter au panier'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
