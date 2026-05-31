# Répartition des tâches — Gestion Pharmacie

---

## Mouhcine — Backend Laravel

### Base de données
- Création des migrations (users, categories, products, orders, order_items, cart_items)
- Ajout du champ `role` à la table users (admin / client)
- Création du Seeder (2 comptes, 6 catégories, 12 produits)

### Modèles Eloquent
- Modèle `User` (rôles, relations, Sanctum)
- Modèle `Category` (relation produits)
- Modèle `Product` (prix, stock, image, expiration)
- Modèle `Order` et `OrderItem`
- Modèle `CartItem`

### Authentification
- `AuthController` : register, login, logout, profile, updateProfile
- Configuration de Laravel Sanctum (tokens Bearer)
- Middleware `AdminMiddleware` (protection des routes admin)

### Contrôleurs
- `CategoryController` : CRUD des catégories
- `CartController` : ajout, modification, suppression, vider le panier
- `ProductController` : CRUD produits avec upload d'image
- `OrderController` : passage de commande (transaction DB, vérification stock)

### Configuration API
- Routes API (`routes/api.php`) : 25 routes organisées (publiques / auth / admin)
- Configuration CORS

---

## Milad — Frontend React

### Configuration
- Mise en place du projet React + Vite + Tailwind CSS
- Configuration Axios avec token automatique (`api/axios.js`)
- Hook `useAuth` : connexion, inscription, déconnexion
- Hook `useCart` : panier synchronisé entre les composants

### Pages Client
- Page `Login` : connexion avec redirection selon le rôle
- Page `Register` : inscription avec validation des erreurs
- Page `Home` : catalogue, recherche, filtre par catégorie, pagination
- Page `ProductDetail` : détail produit, sélecteur de quantité
- Page `Cart` : panier, modification, formulaire de commande
- Page `Orders` : liste des commandes avec accordéon
- Page `Profile` : modification du profil et mot de passe

### Composants
- `Navbar` : liens dynamiques selon connexion / rôle
- `ProtectedRoute` et `AdminRoute` : protection des pages

### Pages Admin
- `Dashboard` : statistiques (produits, catégories, commandes, en attente)
- `AdminProducts` : CRUD complet avec upload d'image et liste paginée
- `AdminCategories` : CRUD des catégories avec compteur de produits
- `AdminOrders` : toutes les commandes, changement de statut en 1 clic

### Documentation
- Rédaction de la documentation technique (`DOCUMENTATION.md`)
- Schéma UML (diagramme de classe et cas d'utilisation)
- Rapport final et présentation PowerPoint

---

## Résumé rapide

| Membre   | Rôle principal              | Fichiers principaux                                                          |
|----------|-----------------------------|------------------------------------------------------------------------------|
| Mouhcine | Backend Laravel             | migrations, models, AuthController, CartController, ProductController, OrderController, routes/api.php |
| Milad    | Frontend React              | axios.js, useAuth, useCart, toutes les pages client et admin, DOCUMENTATION.md |

---

## Comptes de test

| Rôle   | Email                  | Mot de passe |
|--------|------------------------|--------------|
| Admin  | admin@pharmacie.com    | password     |
| Client | client@test.com        | password     |

## Lancer le projet

```bash
# Backend (port 8000)
cd backend
php artisan serve

# Frontend (port 5173)
cd frontend
npm run dev
```
