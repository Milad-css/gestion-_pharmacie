import { useEffect, useState } from 'react'
import api from '../../api/axios'

const STATUS = {
  en_attente: { label: 'En attente', badge: 'bg-yellow-100 text-yellow-700' },
  confirmee:  { label: 'Confirmée',  badge: 'bg-blue-100 text-blue-700' },
  livree:     { label: 'Livrée',     badge: 'bg-emerald-100 text-emerald-700' },
  annulee:    { label: 'Annulée',    badge: 'bg-red-100 text-red-600' },
}

function ActionButtons({ order, onUpdate }) {
  const { statut } = order

  if (statut === 'livree' || statut === 'annulee') {
    return (
      <span className="text-xs text-gray-400 italic">
        {statut === 'livree' ? 'Commande livrée' : 'Commande annulée'}
      </span>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {statut === 'en_attente' && (
        <button
          onClick={() => onUpdate(order.id, 'confirmee')}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Confirmer
        </button>
      )}
      {statut === 'confirmee' && (
        <button
          onClick={() => onUpdate(order.id, 'livree')}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Marquer livrée
        </button>
      )}
      <button
        onClick={() => onUpdate(order.id, 'annulee')}
        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium bg-white text-red-600 border border-red-300 hover:bg-red-50 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        Annuler
      </button>
    </div>
  )
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(null)
  const [filter, setFilter] = useState('tous')

  const load = () => {
    api.get('/admin/orders')
      .then(({ data }) => setOrders(data.data))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const updateStatus = (id, statut) => {
    api.put(`/admin/orders/${id}`, { statut }).then(() => load())
  }

  const filtered = filter === 'tous' ? orders : orders.filter(o => o.statut === filter)

  const counts = orders.reduce((acc, o) => {
    acc[o.statut] = (acc[o.statut] || 0) + 1
    return acc
  }, {})

  if (loading) return (
    <div className="flex justify-center p-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Toutes les commandes</h1>
        <span className="text-sm text-gray-500">{orders.length} commande(s) au total</span>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[['tous', 'Toutes', null], ['en_attente', 'En attente', 'yellow'], ['confirmee', 'Confirmées', 'blue'], ['livree', 'Livrées', 'green'], ['annulee', 'Annulées', 'red']].map(([val, label, color]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${
              filter === val
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
            }`}
          >
            {label}
            {val !== 'tous' && counts[val] ? (
              <span className="ml-1.5 bg-white/20 rounded-full px-1.5">{counts[val]}</span>
            ) : val === 'tous' ? (
              <span className="ml-1.5 opacity-60">({orders.length})</span>
            ) : null}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-sm">Aucune commande pour ce filtre.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const s = STATUS[order.statut]
            const isOpen = open === order.id
            return (
              <div key={order.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                {/* Header ligne */}
                <button
                  onClick={() => setOpen(isOpen ? null : order.id)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        Commande #{order.id}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {order.user?.name} &nbsp;·&nbsp;{' '}
                        {new Date(order.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${s.badge}`}>
                      {s.label}
                    </span>
                    <span className="font-bold text-gray-900 text-sm">
                      {Number(order.total).toFixed(2)} DA
                    </span>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Détail */}
                {isOpen && (
                  <div className="border-t border-gray-100 px-5 pb-5">
                    {/* Infos client */}
                    <div className="mt-4 mb-4 p-3 bg-gray-50 rounded-xl text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium text-gray-800">Client :</span> {order.user?.name} ({order.user?.email})</p>
                      {order.adresse && <p><span className="font-medium text-gray-800">Adresse :</span> {order.adresse}</p>}
                      {order.telephone && <p><span className="font-medium text-gray-800">Téléphone :</span> {order.telephone}</p>}
                      {order.notes && <p><span className="font-medium text-gray-800">Notes :</span> {order.notes}</p>}
                    </div>

                    {/* Articles */}
                    <div className="space-y-2 mb-4">
                      {order.items?.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm text-gray-700">
                          <span>{item.product?.nom} <span className="text-gray-400">× {item.quantite}</span></span>
                          <span className="font-medium">{(item.prix_unitaire * item.quantite).toFixed(2)} DA</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm font-bold text-gray-900 border-t border-gray-100 pt-2 mt-2">
                        <span>Total</span>
                        <span>{Number(order.total).toFixed(2)} DA</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <ActionButtons order={order} onUpdate={updateStatus} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
