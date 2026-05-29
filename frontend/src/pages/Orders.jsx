import { useEffect, useState } from 'react'
import api from '../api/axios'

const STATUS_LABELS = {
  en_attente: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700' },
  confirmee:  { label: 'Confirmée',  color: 'bg-blue-100 text-blue-700' },
  livree:     { label: 'Livrée',     color: 'bg-emerald-100 text-emerald-700' },
  annulee:    { label: 'Annulée',    color: 'bg-red-100 text-red-600' },
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(null)

  useEffect(() => {
    api.get('/orders').then(({ data }) => setOrders(data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div></div>

  if (orders.length === 0) return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <p className="text-gray-500 text-lg">Vous n'avez pas encore de commandes.</p>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Mes commandes</h1>
      <div className="space-y-4">
        {orders.map((order) => {
          const s = STATUS_LABELS[order.statut]
          return (
            <div key={order.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <button onClick={() => setOpen(open === order.id ? null : order.id)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50">
                <div>
                  <p className="font-semibold text-gray-900">Commande #{order.id}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{new Date(order.created_at).toLocaleDateString('fr-DZ', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${s.color}`}>{s.label}</span>
                  <span className="font-bold text-gray-900">{Number(order.total).toFixed(2)} DA</span>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform ${open === order.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {open === order.id && (
                <div className="border-t border-gray-200 px-5 pb-5">
                  {order.adresse && <p className="text-sm text-gray-600 mt-3"><span className="font-medium">Adresse:</span> {order.adresse}</p>}
                  {order.telephone && <p className="text-sm text-gray-600 mt-1"><span className="font-medium">Tél:</span> {order.telephone}</p>}
                  <div className="mt-4 space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm text-gray-700">
                        <span>{item.product?.nom} × {item.quantite}</span>
                        <span className="font-medium">{(item.prix_unitaire * item.quantite).toFixed(2)} DA</span>
                      </div>
                    ))}
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
