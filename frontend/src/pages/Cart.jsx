import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import api from '../api/axios'

export default function Cart() {
  const { cart, updateItem, removeItem, clearCart } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState({ adresse: '', telephone: '', notes: '' })
  const [ordering, setOrdering] = useState(false)
  const [error, setError] = useState('')

  const handleOrder = (e) => {
    e.preventDefault()
    setError('')
    setOrdering(true)
    api.post('/orders', form)
      .then(() => navigate('/orders'))
      .catch((err) => setError(err.response?.data?.message || 'Erreur lors de la commande.'))
      .finally(() => setOrdering(false))
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p className="text-gray-500 text-lg mb-4">Votre panier est vide.</p>
        <Link to="/" className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700">
          Parcourir les produits
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Mon panier</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-16 h-16 bg-emerald-50 rounded-lg flex-shrink-0 flex items-center justify-center">
                {item.product?.image ? (
                  <img src={`http://localhost:8000/storage/${item.product.image}`} className="w-full h-full object-cover rounded-lg" alt="" />
                ) : (
                  <svg className="w-8 h-8 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">{item.product?.nom}</p>
                <p className="text-emerald-600 text-sm font-semibold">{Number(item.product?.prix).toFixed(2)} DA</p>
              </div>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button onClick={() => updateItem(item.id, Math.max(1, item.quantite - 1))} className="px-2 py-1 text-gray-600">−</button>
                <span className="px-3 py-1 text-sm">{item.quantite}</span>
                <button onClick={() => updateItem(item.id, item.quantite + 1)} className="px-2 py-1 text-gray-600">+</button>
              </div>
              <p className="text-sm font-bold text-gray-900 w-24 text-right">
                {(Number(item.product?.prix) * item.quantite).toFixed(2)} DA
              </p>
              <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 ml-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <button onClick={clearCart} className="text-sm text-red-500 hover:underline">Vider le panier</button>
        </div>

        <div className="lg:w-80">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Passer la commande</h2>
            {error && <p className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</p>}
            <form onSubmit={handleOrder} className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Adresse de livraison</label>
                <input value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Téléphone</label>
                <input value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Notes</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="border-t border-gray-200 pt-3 mt-2">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>{Number(cart.total).toFixed(2)} DA</span>
                </div>
              </div>
              <button type="submit" disabled={ordering}
                className="w-full bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 mt-2">
                {ordering ? 'Commande en cours...' : 'Confirmer la commande'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
