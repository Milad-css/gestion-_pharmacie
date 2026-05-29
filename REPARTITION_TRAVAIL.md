# RÉPARTITION DU TRAVAIL
## Projet : Système de Gestion de Pharmacie en Ligne

---

## Membre 1 — [Milad]

### Backend Laravel

- Initialisation du projet Laravel et configuration de l'environnement (`.env`, CORS, Sanctum)
- Création de toutes les **migrations** (tables : users, categories, products, orders, order_items, cart_items)
- Implémentation du **modèle User** avec la méthode `isAdmin()` et les relations
- Implémentation des **modèles Category et Product** avec leurs relations et casts
- Développement du **AuthController** :
  - Inscription (`register`) avec génération de token
  - Connexion (`login`) avec validation des identifiants
  - Déconnexion (`logout`) avec révocation du token
  - Consultation et mise à jour du profil (`profile`, `updateProfile`)
- Développement du **ProductController** :
  - Liste des produits avec pagination, recherche et filtre par catégorie
  - Détail d'un produit
  - Création avec upload d'image
  - Modification avec remplacement d'image
  - Suppression avec nettoyage du fichier image
- Développement du **CategoryController** (CRUD complet)
- Configuration des **routes API** (publiques, authentifiées, admin)
- Mise en place du **middleware AdminMiddleware**

### Frontend React

- Initialisation du projet React avec Vite et configuration de Tailwind CSS
- Création du fichier **`axios.js`** (intercepteur Bearer Token, URL de base)
- Développement de l'**AuthContext** (login, logout, register, vérification au chargement)
- Développement des pages :
  - **Home** : grille de produits, recherche, filtre par catégorie, pagination
  - **Login** : formulaire avec gestion des erreurs
  - **Register** : formulaire complet avec confirmation de mot de passe
  - **ProductDetail** : affichage détaillé, sélecteur de quantité, bouton ajout panier
  - **Profile** : affichage et modification du profil, changement de mot de passe
- Développement du composant **Navbar** (navigation, badge panier, liens conditionnels selon rôle)
- Développement des pages admin :
  - **AdminDashboard** : statistiques (produits, catégories, commandes, en attente)
  - **AdminProducts** : formulaire création/édition, liste avec image et actions
  - **AdminCategories** : formulaire création/édition, liste avec compteur de produits

---

## Membre 2 — [Prénom de ton ami]

### Backend Laravel

- Développement du **modèle Order** avec ses relations et casts (statut, total)
- Développement du **modèle OrderItem** et **CartItem** avec leurs relations
- Développement du **CartController** :
  - Consultation du panier avec calcul du total
  - Ajout d'un article (incrémentation si déjà présent)
  - Modification de quantité
  - Suppression d'un article avec vérification de propriété
  - Vidage complet du panier
- Développement de l'**OrderController** :
  - Liste des commandes du client connecté
  - Détail d'une commande (vérification propriétaire ou admin)
  - Création de commande depuis le panier :
    - Vérification du stock pour chaque article
    - Transaction base de données (atomicité)
    - Décrémentation des stocks
    - Vidage automatique du panier
    - Figement du prix unitaire dans `order_items`
  - Liste globale des commandes (admin)
  - Mise à jour du statut de commande (admin)
- Rédaction des **seeders** pour les données de test

### Frontend React

- Développement du **CartContext** (fetchCart, addToCart, updateItem, removeItem, clearCart, itemCount)
- Développement du composant **ProtectedRoute** et **AdminRoute** (garde de routes)
- Développement des pages :
  - **Cart** : liste des articles, modification des quantités, suppression, total, formulaire de commande (adresse, téléphone, notes), bouton passer commande
  - **Orders** : historique des commandes, badges de statut colorés, affichage des détails au clic
- Développement de la page admin :
  - **AdminOrders** : liste de toutes les commandes, détails expandables, boutons de changement de statut
- Configuration du **routeur React** (`App.jsx`) avec toutes les routes et leur protection
- Tests et débogage de l'intégration frontend/backend

---

## Synthèse de la répartition

| Domaine | Membre 1 | Membre 2 |
|---------|----------|----------|
| Configuration & initialisation | ✅ | — |
| Base de données (migrations) | ✅ | — |
| Authentification (back + front) | ✅ | — |
| Produits & catégories (back + front) | ✅ | — |
| Panier (back + front) | — | ✅ |
| Commandes (back + front) | — | ✅ |
| Admin - Tableau de bord | ✅ | — |
| Admin - Produits & catégories | ✅ | — |
| Admin - Commandes | — | ✅ |
| Routage et protection des routes | — | ✅ |
| Tests et intégration | Partiel | Partiel |
