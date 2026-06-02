# Documentation complète — Gestion Pharmacie

---

## 1. Présentation du projet

Application web de gestion d'une pharmacie en ligne.
Elle permet à des clients de commander des médicaments, et à l'administrateur de gérer les produits, les catégories et les commandes.

**Technologies utilisées**

| Côté | Technologies |
|------|-------------|
| Backend | PHP 8, Laravel 13, mysq , Laravel Sanctum |
| Frontend | React 18, Vite, Tailwind CSS, Axios |

---

## 2. Répartition du travail

### Mouhcine — Backend Laravel

**Base de données**
- Création des migrations (6 tables)
- Création des modèles Eloquent avec leurs relations
- Seeder : 2 comptes, 6 catégories, 12 produits

**Authentification**
- `AuthController` : register, login, logout, profile, updateProfile
- Configuration de Laravel Sanctum
- Middleware `AdminMiddleware`

**Contrôleurs**
- `CategoryController` : CRUD des catégories
- `CartController` : gestion du panier
- `ProductController` : CRUD produits avec upload d'image
- `OrderController` : passage de commande avec transaction DB

**Configuration API**
- Fichier `routes/api.php` : 25 routes organisées
- Configuration CORS

---

### Milad — Frontend React

**Configuration**
- Mise en place React + Vite + Tailwind CSS
- Configuration Axios avec token automatique
- Hook `useAuth` : connexion, inscription, déconnexion
- Hook `useCart` : panier synchronisé entre les composants

**Pages Client**
- Page `Login` : formulaire + redirection selon le rôle
- Page `Register` : inscription + gestion des erreurs
- Page `Home` : catalogue, recherche, filtre, pagination
- Page `ProductDetail` : détail produit + sélecteur de quantité
- Page `Cart` : panier + formulaire de commande
- Page `Orders` : liste des commandes avec accordéon
- Page `Profile` : modification du profil et mot de passe

**Composants**
- `Navbar` : liens selon le rôle de l'utilisateur
- `ProtectedRoute` et `AdminRoute` : protection des pages

**Pages Admin**
- `Dashboard` : statistiques (produits, catégories, commandes)
- `AdminProducts` : CRUD complet avec upload d'image
- `AdminCategories` : CRUD des catégories
- `AdminOrders` : gestion des statuts de commandes

**Documentation**
- Rédaction de la documentation technique
- Schéma UML et rapport final

---

## 3. Base de données

### Tables et colonnes

**users**
```
id | name | email | password | role (admin/client) | telephone | adresse
```

**categories**
```
id | nom | description
```

**products**
```
id | category_id | nom | description | prix | stock | image | date_expiration | actif
```

**orders**
```
id | user_id | total | statut | adresse | telephone | notes
statut : en_attente / confirmee / livree / annulee
```

**order_items**
```
id | order_id | product_id | quantite | prix_unitaire
```

**cart_items**
```
id | user_id | product_id | quantite
```

### Relations entre les tables

```
User       →  hasMany  →  Orders
User       →  hasMany  →  CartItems
Category   →  hasMany  →  Products
Order      →  hasMany  →  OrderItems
OrderItem  →  belongsTo → Product
CartItem   →  belongsTo → Product
```

---

## 4. Routes API

### Routes publiques (pas besoin d'être connecté)

| Méthode | URL | Action |
|---------|-----|--------|
| POST | /api/register | Créer un compte |
| POST | /api/login | Se connecter |
| GET | /api/products | Liste des produits |
| GET | /api/products/{id} | Détail d'un produit |
| GET | /api/categories | Liste des catégories |
| GET | /api/categories/{id} | Détail d'une catégorie |

### Routes client (doit être connecté)

| Méthode | URL | Action |
|---------|-----|--------|
| POST | /api/logout | Se déconnecter |
| GET | /api/profile | Voir son profil |
| PUT | /api/profile | Modifier son profil |
| GET | /api/cart | Voir son panier |
| POST | /api/cart | Ajouter au panier |
| PUT | /api/cart/{id} | Modifier la quantité |
| DELETE | /api/cart/{id} | Retirer un article |
| DELETE | /api/cart | Vider le panier |
| POST | /api/orders | Passer une commande |
| GET | /api/orders | Mes commandes |
| GET | /api/orders/{id} | Détail d'une commande |

### Routes admin (doit être admin)

| Méthode | URL | Action |
|---------|-----|--------|
| POST | /api/categories | Créer une catégorie |
| PUT | /api/categories/{id} | Modifier une catégorie |
| DELETE | /api/categories/{id} | Supprimer une catégorie |
| POST | /api/products | Créer un produit |
| POST | /api/products/{id} | Modifier un produit |
| DELETE | /api/products/{id} | Supprimer un produit |
| GET | /api/admin/orders | Toutes les commandes |
| PUT | /api/admin/orders/{id} | Changer le statut |

---

## 5. Contrôleurs Backend

### AuthController

**register()** — Inscription
- Valide les champs (nom, email unique, mot de passe min 8 caractères)
- Crée le compte et génère un token
- Retourne `{ user, token }`

**login()** — Connexion
- Vérifie email et mot de passe
- Génère un token Sanctum
- Retourne `{ user, token }`

**logout()** — Déconnexion
- Supprime le token actuel

**profile()** — Profil
- Retourne les données de l'utilisateur connecté

**updateProfile()** — Modifier le profil
- Met à jour nom, téléphone, adresse
- Change le mot de passe si fourni

---

### CategoryController

**index()** — Liste
- Retourne toutes les catégories avec le nombre de produits

**store()** — Créer
- Valide et crée une catégorie

**update()** — Modifier
- Valide et modifie une catégorie

**destroy()** — Supprimer
- Supprime une catégorie

---

### ProductController

**index()** — Liste
- Retourne les produits actifs, paginés (20 par page)
- Filtres : `category_id`, `search` (recherche par nom)

**store()** — Créer
- Valide les champs + image (max 2 Mo)
- Stocke l'image dans `storage/app/public/products/`

**update()** — Modifier
- Même logique, supprime l'ancienne image si remplacée

**destroy()** — Supprimer
- Supprime le produit et son image

---

### CartController

**index()** — Voir le panier
- Retourne `{ items, total }` avec les produits associés

**add()** — Ajouter
- Si le produit est déjà dans le panier → augmente la quantité
- Sinon → crée un nouvel article

**update()** — Modifier la quantité
- Vérifie que l'article appartient à l'utilisateur (403 sinon)

**remove()** — Supprimer un article
**clear()** — Vider tout le panier

---

### OrderController

**store()** — Passer une commande
1. Vérifie que le panier n'est pas vide
2. Vérifie le stock de chaque produit
3. Dans une transaction base de données :
   - Crée la commande avec le total calculé
   - Crée une ligne par produit (`prix_unitaire` sauvegardé)
   - Décrémente le stock
   - Vide le panier

**adminIndex()** — Toutes les commandes (admin)
**updateStatus()** — Changer le statut (admin)

---

### AdminMiddleware

Vérifie que l'utilisateur a le rôle `admin`.
Retourne une erreur 403 sinon.

---

## 6. Frontend React

### Configuration Axios (`src/api/axios.js`)

Chaque requête vers l'API ajoute automatiquement le token d'authentification.

```js
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { Accept: 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = 'Bearer ' + token
  return config
})

export default api
```

---

### Hook useAuth (`src/hooks/useAuth.js`)

Gère la connexion, l'inscription et la déconnexion.

**Comment ça marche :**
- Le token et les données utilisateur sont stockés dans `localStorage`
- Quand on se connecte ou déconnecte, un événement `auth-change` est envoyé
- Tous les composants qui utilisent `useAuth()` reçoivent cet événement et se mettent à jour

```js
import { useState, useEffect } from 'react'
import api from '../api/axios'

export function useAuth() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))

  useEffect(() => {
    function sync() {
      setUser(JSON.parse(localStorage.getItem('user')))
    }
    window.addEventListener('auth-change', sync)
    return () => window.removeEventListener('auth-change', sync)
  }, [])

  function login(email, password) {
    return api.post('/login', { email, password })
      .then(({ data }) => {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        window.dispatchEvent(new Event('auth-change'))
        return data.user
      })
  }

  function register(payload) {
    return api.post('/register', payload)
      .then(({ data }) => {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        window.dispatchEvent(new Event('auth-change'))
        return data.user
      })
  }

  function logout() {
    api.post('/logout').catch(() => {})
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.dispatchEvent(new Event('auth-change'))
  }

  return { user, login, register, logout }
}
```

**Ce que retourne useAuth :**
| Valeur | Description |
|--------|-------------|
| `user` | Objet utilisateur, ou `null` si non connecté |
| `login(email, password)` | Fonction de connexion, retourne une Promise |
| `register(payload)` | Fonction d'inscription, retourne une Promise |
| `logout()` | Fonction de déconnexion |

---

### Hook useCart (`src/hooks/useCart.js`)

Gère le panier de l'utilisateur.

**Comment ça marche :**
- `fetchCart()` appelle GET /cart et met à jour l'état local
- Après chaque modification (ajout, suppression…), un événement `cart-change` est envoyé
- La Navbar et la page Panier utilisent `useCart()` séparément mais restent synchronisées grâce à cet événement

```js
import { useState, useEffect } from 'react'
import api from '../api/axios'

export function useCart() {
  const [cart, setCart] = useState({ items: [], total: 0 })

  function fetchCart() {
    if (!localStorage.getItem('user')) {
      setCart({ items: [], total: 0 })
      return
    }
    api.get('/cart')
      .then(({ data }) => setCart(data))
      .catch(() => setCart({ items: [], total: 0 }))
  }

  useEffect(() => {
    fetchCart()
    window.addEventListener('auth-change', fetchCart)
    window.addEventListener('cart-change', fetchCart)
    return () => {
      window.removeEventListener('auth-change', fetchCart)
      window.removeEventListener('cart-change', fetchCart)
    }
  }, [])

  function addToCart(productId, quantite) {
    return api.post('/cart', { product_id: productId, quantite: quantite || 1 })
      .then(() => {
        fetchCart()
        window.dispatchEvent(new Event('cart-change'))
      })
  }

  function updateItem(id, quantite) {
    return api.put('/cart/' + id, { quantite: quantite })
      .then(() => {
        fetchCart()
        window.dispatchEvent(new Event('cart-change'))
      })
  }

  function removeItem(id) {
    return api.delete('/cart/' + id)
      .then(() => {
        fetchCart()
        window.dispatchEvent(new Event('cart-change'))
      })
  }

  function clearCart() {
    return api.delete('/cart')
      .then(() => {
        setCart({ items: [], total: 0 })
        window.dispatchEvent(new Event('cart-change'))
      })
  }

  const itemCount = cart.items.reduce((total, item) => total + item.quantite, 0)

  return { cart, itemCount, addToCart, updateItem, removeItem, clearCart }
}
```

**Ce que retourne useCart :**
| Valeur | Description |
|--------|-------------|
| `cart` | `{ items: [], total: 0 }` |
| `itemCount` | Nombre total d'articles (pour le badge Navbar) |
| `addToCart(productId, quantite)` | Ajouter un produit |
| `updateItem(id, quantite)` | Modifier la quantité |
| `removeItem(id)` | Supprimer un article |
| `clearCart()` | Vider le panier |

---

### Composants

**Navbar** (`src/components/Navbar.jsx`)
- Utilise `useAuth()` pour afficher le nom de l'utilisateur et le lien Admin
- Utilise `useCart()` pour afficher le nombre d'articles dans le badge panier
- Liens différents selon : non connecté / client / admin

**ProtectedRoute / AdminRoute** (`src/components/ProtectedRoute.jsx`)
- `ProtectedRoute` : redirige vers /login si l'utilisateur n'est pas connecté
- `AdminRoute` : redirige vers /login si non connecté, vers / si non admin

```jsx
export function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

export function AdminRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />
  return children
}
```

---

### Pages client

**Login** — Connexion
```js
const handle = (e) => {
  e.preventDefault()
  setLoading(true)
  login(form.email, form.password)
    .then((user) => navigate(user.role === 'admin' ? '/admin' : '/'))
    .catch((err) => setError(err.response?.data?.message || 'Identifiants incorrects.'))
    .finally(() => setLoading(false))
}
```

**Register** — Inscription
```js
const handle = (e) => {
  e.preventDefault()
  setLoading(true)
  register(form)
    .then(() => navigate('/'))
    .catch((err) => setErrors(err.response?.data?.errors || {}))
    .finally(() => setLoading(false))
}
```

**Home** — Catalogue
- Liste des produits paginée (20 par page)
- Barre de recherche + filtre par catégorie
- Bouton "Ajouter au panier" si l'utilisateur est connecté

**ProductDetail** — Détail d'un produit
- Affiche les informations complètes du produit
- Sélecteur de quantité (min 1, max stock disponible)
- Bouton "Ajouter au panier"

**Cart** — Panier
- Liste des articles avec modification de quantité et suppression
- Formulaire : adresse, téléphone, notes
- Total calculé et bouton "Confirmer la commande"

**Orders** — Mes commandes
- Liste de toutes les commandes de l'utilisateur
- Accordéon : cliquer pour voir le détail (articles, adresse, téléphone)
- Badge coloré selon le statut

**Profile** — Mon profil
- Modifier nom, téléphone, adresse
- Changer le mot de passe (optionnel)

---

### Pages admin

**Dashboard** — Tableau de bord
- 4 statistiques : nb produits, catégories, commandes, commandes en attente
- Liens rapides vers les 3 sections admin

**AdminProducts** — Gestion des produits
- Formulaire : créer ou modifier un produit avec upload d'image
- Liste paginée avec aperçu image, stock, statut actif/inactif
- Boutons Modifier et Supprimer

**AdminCategories** — Gestion des catégories
- Formulaire : créer ou modifier une catégorie
- Liste avec compteur de produits par catégorie

**AdminOrders** — Gestion des commandes
- Toutes les commandes avec filtre par statut
- Accordéon avec détail de chaque commande (client, articles, adresse)
- Boutons pour changer le statut : Confirmer → Livrer → Annuler

---

## 7. Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@pharmacie.com | password |
| Client | client@test.com | password |

---

## 8. Lancer le projet

**Backend (port 8000)**
```bash
cd backend
composer install
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

**Frontend (port 5173)**
```bash
cd frontend
npm install
npm run dev
```

Ouvrir : http://localhost:5173
