import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import api from '../api/axios'

export default function Cart() {
  const { cart, updateItem, removeItem, clearCart } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState({ adresse: '', telephone: '', notes: '' })
  const [ordering, setOrdering] = useState(false)
  const [error, setError] = useState('')

  const handleOrder = (e) => {
    e.preventDefault()
    if (!form.adresse || !form.telephone) {
      setError('veuillez remplir tous les champs obligatoires.')
      return;
    }
    setError('')
    setOrdering(true)
    api.post('/orders', form)
      .then(() => navigate('/orders'))
      .catch((err) => setError(err.response?.data?.message || 'Erreur lors de la commande.'))
      .finally(() => setOrdering(false))
  }

  const inputClass = "mt-1.5 w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50 transition-all"

  if (cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-9 h-9 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Votre panier est vide</h2>
        <p className="text-slate-500 text-sm mb-8">Parcourez notre catalogue pour trouver vos médicaments</p>
        <Link to="/" className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
          Parcourir les produits
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Mon panier</h1>
        <button onClick={clearCart} className="text-sm text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Vider le panier
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-3">
          {cart.items.map((item) => (
            <div key={item.id} className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4 flex items-center gap-4 hover:border-slate-200 transition-colors">
              <div className="w-16 h-16 bg-slate-50 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-100">
                {item.product?.image ? (
                  <img src={`http://localhost:8000/storage/${item.product.image}`} className="w-full h-full object-cover" alt="" />
                ) : (
                  <svg className="w-7 h-7 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm truncate">{item.product?.nom}</p>
                <p className="text-indigo-600 text-sm font-medium mt-0.5">{Number(item.product?.prix).toFixed(2)} DH / unité</p>
              </div>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <button onClick={() => updateItem(item.id,item.quantite - 1)} className="px-3 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors">−</button>
                <span className="px-3 py-2 text-sm font-semibold text-slate-900 min-w-8 text-center">{item.quantite}</span>
                <button onClick={() => updateItem(item.id, item.quantite + 1)} className="px-3 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors">+</button>
              </div>
              <p className="text-sm font-bold text-slate-900 w-24 text-right">
                {(Number(item.product.prix) * item.quantite).toFixed(2)} DH
              </p>
              <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors ml-1 p-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="lg:w-80 flex-shrink-0">
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 mb-5">Récapitulatif</h2>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3.5 rounded-xl mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
            <form onSubmit={handleOrder} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Adresse de livraison</label>
                <input value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })}
                  placeholder="Votre adresse complète" className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Téléphone</label>
                <input value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                  placeholder="0600000000" className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Notes (optionnel)</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2}
                  placeholder="Instructions spéciales..." className={inputClass} />
              </div>
              <div className="border-t border-slate-100 pt-4 mt-2">
                <div className="flex justify-between items-center mb-5">
                  <span className="font-semibold text-slate-700">Total</span>
                  <span className="text-xl font-bold text-slate-900">{Number(cart.total).toFixed(2)} <span className="text-base font-medium text-slate-500">DH</span></span>
                </div>
              </div>
              <button type="submit" disabled={ordering}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                {ordering ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Traitement...
                  </span>
                ) : 'Confirmer la commande'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
