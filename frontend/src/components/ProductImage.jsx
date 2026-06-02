const CATEGORY_THEMES = {
  'analgésiques': {
    gradient: 'from-rose-400 to-pink-600',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16 opacity-90">
        <ellipse cx="32" cy="32" rx="22" ry="10" transform="rotate(-45 32 32)" stroke="white" strokeWidth="4" strokeLinecap="round"/>
        <line x1="17" y1="17" x2="47" y2="47" stroke="white" strokeWidth="4" strokeLinecap="round"/>
        <ellipse cx="32" cy="32" rx="22" ry="10" transform="rotate(-45 32 32)" stroke="white" strokeWidth="4" strokeLinecap="round" strokeDasharray="0 69 1000"/>
      </svg>
    ),
  },
  'antibiotiques': {
    gradient: 'from-blue-500 to-indigo-700',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16 opacity-90">
        <rect x="22" y="10" width="20" height="30" rx="10" stroke="white" strokeWidth="4"/>
        <rect x="22" y="24" width="20" height="2" fill="white"/>
        <circle cx="32" cy="50" r="4" fill="white"/>
        <line x1="32" y1="40" x2="32" y2="46" stroke="white" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    ),
  },
  'vitamines & compléments': {
    gradient: 'from-amber-400 to-orange-500',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16 opacity-90">
        <circle cx="32" cy="32" r="14" stroke="white" strokeWidth="4"/>
        <line x1="32" y1="8" x2="32" y2="14" stroke="white" strokeWidth="4" strokeLinecap="round"/>
        <line x1="32" y1="50" x2="32" y2="56" stroke="white" strokeWidth="4" strokeLinecap="round"/>
        <line x1="8" y1="32" x2="14" y2="32" stroke="white" strokeWidth="4" strokeLinecap="round"/>
        <line x1="50" y1="32" x2="56" y2="32" stroke="white" strokeWidth="4" strokeLinecap="round"/>
        <line x1="15" y1="15" x2="19.2" y2="19.2" stroke="white" strokeWidth="4" strokeLinecap="round"/>
        <line x1="44.8" y1="44.8" x2="49" y2="49" stroke="white" strokeWidth="4" strokeLinecap="round"/>
        <line x1="49" y1="15" x2="44.8" y2="19.2" stroke="white" strokeWidth="4" strokeLinecap="round"/>
        <line x1="19.2" y1="44.8" x2="15" y2="49" stroke="white" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    ),
  },
  'dermatologie': {
    gradient: 'from-teal-400 to-emerald-600',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16 opacity-90">
        <path d="M20 44 C20 44 14 36 14 28 C14 20 22 14 32 14 C42 14 50 20 50 28 C50 36 44 44 44 44" stroke="white" strokeWidth="4" strokeLinecap="round"/>
        <rect x="20" y="42" width="24" height="10" rx="5" stroke="white" strokeWidth="4"/>
        <line x1="26" y1="48" x2="38" y2="48" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    ),
  },
  'cardiologie': {
    gradient: 'from-red-500 to-rose-700',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16 opacity-90">
        <path d="M32 50 C32 50 10 36 10 22 C10 15 16 10 24 10 C28 10 32 13 32 13 C32 13 36 10 40 10 C48 10 54 15 54 22 C54 36 32 50 32 50Z" stroke="white" strokeWidth="4" strokeLinejoin="round"/>
        <polyline points="18,28 24,28 28,20 34,36 38,28 46,28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  'diabétologie': {
    gradient: 'from-violet-500 to-purple-700',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16 opacity-90">
        <path d="M32 10 C32 10 44 22 44 34 C44 42 38.6 48 32 48 C25.4 48 20 42 20 34 C20 22 32 10 32 10Z" stroke="white" strokeWidth="4" strokeLinejoin="round"/>
        <line x1="32" y1="35" x2="32" y2="42" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="32" cy="34" r="3" fill="white"/>
      </svg>
    ),
  },
}

const DEFAULT_THEME = {
  gradient: 'from-slate-400 to-slate-600',
  icon: (
    <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16 opacity-90">
      <rect x="18" y="10" width="28" height="38" rx="4" stroke="white" strokeWidth="4"/>
      <line x1="24" y1="22" x2="40" y2="22" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      <line x1="24" y1="30" x2="40" y2="30" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      <line x1="24" y1="38" x2="33" y2="38" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  ),
}

export default function ProductImage({ image, category, name, className = 'h-44', rounded = '' }) {
  if (image) {
    return (
      <img
        src={`http://localhost:8000/storage/${image}`}
        alt={name}
        className={`w-full ${className} object-cover ${rounded}`}
      />
    )
  }

  const key = category?.nom?.toLowerCase() || ''
  const theme = CATEGORY_THEMES[key] || DEFAULT_THEME
  const initials = name ? name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() : '?'

  return (
    <div className={`w-full ${className} bg-gradient-to-br ${theme.gradient} flex flex-col items-center justify-center gap-2 ${rounded}`}>
      {theme.icon}
      <span className="text-white/70 text-xs font-semibold uppercase tracking-widest">{initials}</span>
    </div>
  )
}
