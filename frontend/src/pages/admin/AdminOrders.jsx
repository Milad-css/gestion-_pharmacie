import { useEffect, useState } from 'react'
import api from '../../api/axios'

const STATUS = {
  en_attente: { label: 'En attente', dot: 'bg-amber-400',   badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  confirmee:  { label: 'Confirmée',  dot: 'bg-blue-400',    badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  livree:     { label: 'Livrée',     dot: 'bg-emerald-400', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  annulee:    { label: 'Annulée',    dot: 'bg-red-400',     badge: 'bg-red-50 text-red-600 border-red-200' },
}

function ActionButtons({ order, onUpdate }) {
  const { statut } = order

  if (statut === 'livree' || statut === 'annulee') {
    return (
      <span className="text-xs text-slate-400 italic">
        {statut === 'livree' ? 'Commande livrée' : 'Commande annulée'}
      </span>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {statut === 'en_attente' && (
        <button onClick={() => onUpdate(order.id, 'confirmee')}
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Confirmer
        </button>
      )}
      {statut === 'confirmee' && (
        <button onClick={() => onUpdate(order.id, 'livree')}
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Marquer livrée
        </button>
      )}
      <button onClick={() => onUpdate(order.id, 'annulee')}
        className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition-colors bg-white">
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
  const counts = orders.reduce((acc, o) => { acc[o.statut] = (acc[o.statut] || 0) + 1; return acc }, {})

  if (loading) return (
    <div className="flex justify-center p-24">
      <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const filters = [
    { val: 'tous',       label: 'Toutes' },
    { val: 'en_attente', label: 'En attente' },
    { val: 'confirmee',  label: 'Confirmées' },
    { val: 'livree',     label: 'Livrées' },
    { val: 'annulee',    label: 'Annulées' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Commandes</h1>
          <p className="text-slate-500 text-sm mt-1">{orders.length} commande(s) au total</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map(({ val, label }) => {
          const count = val === 'tous' ? orders.length : (counts[val] || 0)
          return (
            <button key={val} onClick={() => setFilter(val)}
              className={`flex items-center gap-2 text-sm px-4 py-2 rounded-xl font-medium border transition-all ${
                filter === val
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}>
              {label}
              <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold ${filter === val ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <svg className="w-10 h-10 mx-auto mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm font-medium">Aucune commande pour ce filtre.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const s = STATUS[order.statut]
            const isOpen = open === order.id
            return (
              <div key={order.id} className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden hover:border-slate-200 transition-colors">
                <button onClick={() => setOpen(isOpen ? null : order.id)}
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
                        {order.user?.name} · {new Date(order.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${s.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      {s.label}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{Number(order.total).toFixed(2)} DA</span>
                    <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100 px-5 pb-5">
                    <div className="mt-4 mb-4 p-4 bg-slate-50 rounded-xl text-sm text-slate-600 space-y-1.5">
                      <p><span className="font-semibold text-slate-800">Client :</span> {order.user?.name} ({order.user?.email})</p>
                      {order.adresse && <p><span className="font-semibold text-slate-800">Adresse :</span> {order.adresse}</p>}
                      {order.telephone && <p><span className="font-semibold text-slate-800">Téléphone :</span> {order.telephone}</p>}
                      {order.notes && <p><span className="font-semibold text-slate-800">Notes :</span> {order.notes}</p>}
                    </div>

                    <div className="space-y-2 mb-5">
                      {order.items?.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-slate-700">{item.product?.nom} <span className="text-slate-400">× {item.quantite}</span></span>
                          <span className="font-semibold text-slate-900">{(item.prix_unitaire * item.quantite).toFixed(2)} DA</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-100 pt-3 mt-2">
                        <span>Total</span>
                        <span>{Number(order.total).toFixed(2)} DA</span>
                      </div>
                    </div>

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
