import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0, orders: 0, pending: 0 })

  useEffect(() => {
    Promise.all([
      api.get('/products?per_page=1'),
      api.get('/categories'),
      api.get('/admin/orders?per_page=1'),
    ]).then(([p, c, o]) => {
      const pending = o.data.data?.filter(x => x.statut === 'en_attente').length ?? 0
      setStats({ products: p.data.total, categories: c.data.length, orders: o.data.total, pending })
    }).catch(() => {})
  }, [])

  const cards = [
    { label: 'Produits', value: stats.products, to: '/admin/products', color: 'bg-blue-50 text-blue-700' },
    { label: 'Catégories', value: stats.categories, to: '/admin/categories', color: 'bg-purple-50 text-purple-700' },
    { label: 'Commandes', value: stats.orders, to: '/admin/orders', color: 'bg-emerald-50 text-emerald-700' },
    { label: 'En attente', value: stats.pending, to: '/admin/orders', color: 'bg-yellow-50 text-yellow-700' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Tableau de bord</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className={`rounded-2xl p-6 flex flex-col gap-2 hover:opacity-80 transition-opacity ${c.color}`}>
            <span className="text-3xl font-bold">{c.value}</span>
            <span className="text-sm font-medium">{c.label}</span>
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[['Gérer les produits', '/admin/products'], ['Gérer les catégories', '/admin/categories'], ['Gérer les commandes', '/admin/orders']].map(([label, to]) => (
          <Link key={to} to={to} className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-emerald-400 transition-colors text-sm font-medium text-gray-700">
            {label} &rarr;
          </Link>
        ))}
      </div>
    </div>
  )
}
