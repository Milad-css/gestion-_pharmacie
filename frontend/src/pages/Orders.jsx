import { useEffect, useState } from 'react'
import api from '../api/axios'

const STATUS = {
  en_attente: { label: 'En attente',  dot: 'bg-amber-400',   badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  confirmee:  { label: 'Confirmée',   dot: 'bg-blue-400',    badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  livree:     { label: 'Livrée',      dot: 'bg-emerald-400', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  annulee:    { label: 'Annulée',     dot: 'bg-red-400',     badge: 'bg-red-50 text-red-600 border-red-200' },
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(null)

  useEffect(() => {
    api.get('/orders').then(({ data }) => setOrders(data)).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex justify-center p-24">
      <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (orders.length === 0) return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-9 h-9 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">Aucune commande</h2>
      <p className="text-slate-500 text-sm">Vous n'avez pas encore passé de commande.</p>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Mes commandes</h1>
      <div className="space-y-3">
        {orders.map((order) => {
          const s = STATUS[order.statut]
          return (
            <div key={order.id} className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden hover:border-slate-200 transition-colors">
              <button onClick={() => setOpen(open === order.id ? null : order.id)}
                className="w-full flex items-center justify-between p-5 text-left">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-slate-100">
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Commande #{order.id}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(order.created_at).toLocaleDateString('fr-DZ', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${s.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                    {s.label}
                  </span>
                  <span className="font-bold text-slate-900 text-sm">{Number(order.total).toFixed(2)} DH</span>
                  <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open === order.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {open === order.id && (
                <div className="border-t border-slate-100 mx-5 mb-5">
                  <div className="mt-4 p-4 bg-slate-50 rounded-xl text-sm text-slate-600 space-y-1.5 mb-4">
                    {order.adresse && (
                      <p className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {order.adresse}
                      </p>
                    )}
                    {order.telephone && (
                      <p className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {order.telephone}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-slate-700">{item.product?.nom} <span className="text-slate-400">× {item.quantite}</span></span>
                        <span className="font-semibold text-slate-900">{(item.prix_unitaire * item.quantite).toFixed(2)} DH</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-100 pt-3 mt-3">
                      <span>Total</span>
                      <span>{Number(order.total).toFixed(2)} DH</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
