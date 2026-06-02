import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

const ICONS = {
  products: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V11" />
    </svg>
  ),
  categories: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  orders: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  pending: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

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
    { key: 'products',   label: 'Produits',      value: stats.products,    to: '/admin/products',   bg: 'bg-blue-600',   light: 'bg-blue-50 text-blue-700' },
    { key: 'categories', label: 'Catégories',     value: stats.categories,  to: '/admin/categories', bg: 'bg-violet-600', light: 'bg-violet-50 text-violet-700' },
    { key: 'orders',     label: 'Commandes',      value: stats.orders,      to: '/admin/orders',     bg: 'bg-indigo-600', light: 'bg-indigo-50 text-indigo-700' },
    { key: 'pending',    label: 'En attente',     value: stats.pending,     to: '/admin/orders',     bg: 'bg-amber-500',  light: 'bg-amber-50 text-amber-700' },
  ]

  const quickLinks = [
    { label: 'Gérer les produits',    sub: 'Ajouter, modifier, supprimer',  to: '/admin/products',   icon: ICONS.products },
    { label: 'Gérer les catégories',  sub: 'Organiser le catalogue',        to: '/admin/categories', icon: ICONS.categories },
    { label: 'Gérer les commandes',   sub: 'Suivre et traiter les commandes', to: '/admin/orders',   icon: ICONS.orders },
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
        <p className="text-slate-500 text-sm mt-1">Vue d'ensemble de votre pharmacie</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((c) => (
          <Link key={c.key} to={c.to}
            className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
            <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200`}>
              {ICONS[c.key]}
            </div>
            <div>
              <span className="text-3xl font-bold text-slate-900">{c.value}</span>
              <p className="text-sm text-slate-500 font-medium mt-0.5">{c.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Actions rapides</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickLinks.map(({ label, sub, to, icon }) => (
          <Link key={to} to={to}
            className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 hover:border-indigo-200 hover:shadow-md transition-all duration-200 group flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all">
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">{label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
            </div>
            <svg className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  )
}
