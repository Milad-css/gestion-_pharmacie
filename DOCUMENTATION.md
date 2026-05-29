# Documentation — Gestion Pharmacie

## Structure du projet

```
gestion _pharmacie/
├── backend/        (Laravel 13 — API REST)
└── frontend/       (React + Vite + Tailwind CSS)
```

---

## ETAPE 1 — Base de données (Migrations)

Chaque migration crée une table dans la base SQLite.

### `create_users_table`
Table des utilisateurs (fournie par Laravel par défaut).

### `create_personal_access_tokens_table`
Table des tokens Sanctum pour l'authentification par token Bearer.

### `create_categories_table`
```
id | nom | description | created_at | updated_at
```
Catégories des médicaments (ex: Analgésiques, Antibiotiques…).

### `create_products_table`
```
id | category_id | nom | description | prix | stock | image | date_expiration | actif | timestamps
```
- `category_id` : clé étrangère vers categories (nullable)
- `prix` : decimal(10,2)
- `stock` : entier, default 0
- `actif` : booléen, default true
- `date_expiration` : date nullable

### `create_orders_table`
```
id | user_id | total | statut | adresse | telephone | notes | timestamps
```
- `statut` : enum ['en_attente', 'confirmee', 'livree', 'annulee']
- `user_id` : clé étrangère vers users (cascade delete)

### `create_order_items_table`
```
id | order_id | product_id | quantite | prix_unitaire | timestamps
```
Lignes de chaque commande. `prix_unitaire` sauvegardé au moment de la commande.

### `create_cart_items_table`
```
id | user_id | product_id | quantite | timestamps
```
Panier temporaire de chaque utilisateur.

### `add_role_to_users_table`
Ajoute 3 colonnes à la table users :
- `role` : enum ['admin', 'client'], default 'client'
- `telephone` : string nullable
- `adresse` : string nullable

---

## ETAPE 2 — Modèles Eloquent

### `User`
- **fillable** : name, email, password, role, telephone, adresse
- **hidden** : password, remember_token
- **trait** : `HasApiTokens` (Sanctum)
- **isAdmin()** : retourne true si role === 'admin'
- **orders()** : hasMany Order
- **cartItems()** : hasMany CartItem

### `Category`
- **fillable** : nom, description
- **products()** : hasMany Product

### `Product`
- **fillable** : category_id, nom, description, prix, stock, image, date_expiration, actif
- **casts** : prix → decimal:2, actif → boolean, date_expiration → date
- **category()** : belongsTo Category
- **cartItems()** : hasMany CartItem
- **orderItems()** : hasMany OrderItem

### `Order`
- **fillable** : user_id, total, statut, adresse, telephone, notes
- **casts** : total → decimal:2
- **user()** : belongsTo User
- **items()** : hasMany OrderItem

### `OrderItem`
- **fillable** : order_id, product_id, quantite, prix_unitaire
- **order()** : belongsTo Order
- **product()** : belongsTo Product

### `CartItem`
- **fillable** : user_id, product_id, quantite
- **user()** : belongsTo User
- **product()** : belongsTo Product

---

## ETAPE 3 — Routes API (`routes/api.php`)

### Routes publiques (sans authentification)
| Méthode | URL | Description |
|---------|-----|-------------|
| POST | /api/register | Inscription |
| POST | /api/login | Connexion |
| GET | /api/categories | Liste des catégories |
| GET | /api/categories/{id} | Détail d'une catégorie |
| GET | /api/products | Liste des produits (filtrable) |
| GET | /api/products/{id} | Détail d'un produit |

### Routes authentifiées (middleware `auth:sanctum`)
| Méthode | URL | Description |
|---------|-----|-------------|
| POST | /api/logout | Déconnexion |
| GET | /api/profile | Profil connecté |
| PUT | /api/profile | Modifier le profil |
| GET | /api/cart | Voir le panier |
| POST | /api/cart | Ajouter au panier |
| PUT | /api/cart/{id} | Modifier la quantité |
| DELETE | /api/cart/{id} | Supprimer un article |
| DELETE | /api/cart | Vider le panier |
| GET | /api/orders | Mes commandes |
| POST | /api/orders | Passer une commande |
| GET | /api/orders/{id} | Détail d'une commande |

### Routes admin (middleware `auth:sanctum` + `admin`)
| Méthode | URL | Description |
|---------|-----|-------------|
| POST | /api/categories | Créer une catégorie |
| PUT | /api/categories/{id} | Modifier une catégorie |
| DELETE | /api/categories/{id} | Supprimer une catégorie |
| POST | /api/products | Créer un produit |
| POST | /api/products/{id} | Modifier un produit (avec image) |
| DELETE | /api/products/{id} | Supprimer un produit |
| GET | /api/admin/orders | Toutes les commandes |
| PUT | /api/admin/orders/{id} | Changer le statut |

---

## ETAPE 4 — Contrôleurs

### `AuthController`

**register()**
- Valide : name, email (unique), password (min:8, confirmé), telephone, adresse
- Crée l'utilisateur, génère un token Sanctum
- Retourne `{ user, token }` — HTTP 201

**login()**
- Valide : email, password
- Cherche l'utilisateur, vérifie le mot de passe avec `Hash::check()`
- Si incorrect → lève `ValidationException`
- Génère un token et retourne `{ user, token }`

**logout()**
- Supprime le token actuel via `currentAccessToken()->delete()`
- Retourne un message de confirmation

**profile()**
- Retourne l'utilisateur connecté (`$request->user()`)

**updateProfile()**
- Valide et met à jour : name, telephone, adresse, password (optionnel)
- Hash le mot de passe si fourni
- Retourne l'utilisateur mis à jour

---

### `CategoryController`

**index()**
- Retourne toutes les catégories avec le compte de produits (`withCount('products')`)

**show(Category $category)**
- Retourne la catégorie avec ses produits chargés (`load('products')`)

**store()**
- Valide : nom (requis), description (nullable)
- Crée et retourne la catégorie — HTTP 201

**update()**
- Valide et met à jour les champs fournis

**destroy()**
- Supprime la catégorie — HTTP 204

---

### `ProductController`

**index()**
- Filtre par `actif = true`
- Paramètres optionnels : `category_id`, `search` (LIKE sur le nom)
- Retourne les produits paginés (20 par page) avec leur catégorie

**show(Product $product)**
- Retourne le produit avec sa catégorie

**store()**
- Valide tous les champs dont `image` (max 2048 Ko)
- Stocke l'image dans `storage/app/public/products/` si fournie
- Crée le produit — HTTP 201

**update()**
- Même logique que store() mais pour modification
- Supprime l'ancienne image si une nouvelle est fournie

**destroy()**
- Supprime l'image du disque si elle existe
- Supprime le produit — HTTP 204

---

### `CartController`

**index()**
- Charge les articles du panier avec produit + catégorie
- Calcule le total : `sum(prix * quantite)`
- Retourne `{ items, total }`

**add()**
- Si le produit est déjà dans le panier → incrémente la quantité
- Sinon → crée un nouvel article
- Retourne l'article — HTTP 201

**update(CartItem $cartItem)**
- Vérifie que l'article appartient à l'utilisateur connecté (403 sinon)
- Met à jour la quantité

**remove(CartItem $cartItem)**
- Vérifie appartenance, supprime l'article — HTTP 204

**clear()**
- Supprime tous les articles du panier de l'utilisateur — HTTP 204

---

### `OrderController`

**index()**
- Retourne toutes les commandes de l'utilisateur connecté avec articles + produits

**show(Order $order)**
- Accessible par le propriétaire ou un admin (403 sinon)

**store()**
- Récupère le panier de l'utilisateur
- Vérifie que le panier n'est pas vide (422)
- Vérifie le stock disponible pour chaque produit (422 si insuffisant)
- Dans une **transaction DB** :
  1. Calcule le total
  2. Crée la commande
  3. Crée les OrderItems (avec `prix_unitaire` snapshot)
  4. Décrémente le stock de chaque produit
  5. Vide le panier
- Retourne la commande — HTTP 201

**adminIndex()**
- Toutes les commandes paginées avec utilisateur + articles (réservé admin)

**updateStatus()**
- Valide le nouveau statut
- Met à jour et retourne la commande

---

## ETAPE 5 — Middleware `AdminMiddleware`

Vérifie que l'utilisateur connecté a le rôle `admin`.
Retourne HTTP 403 sinon.
Enregistré sous l'alias `admin` dans `bootstrap/app.php`.

---

## ETAPE 6 — Configuration

### CORS (`config/cors.php`)
- Autorise les origines : `http://localhost:5173`, `http://localhost:3000`
- Couvre tous les paths `/api/*` et `/sanctum/csrf-cookie`

### Storage
- Lien symbolique `public/storage → storage/app/public`
- Permet d'accéder aux images via `http://localhost:8000/storage/products/...`

---

## ETAPE 7 — Seeder (`DatabaseSeeder`)

Crée les données initiales :

**Utilisateurs**
- Admin : `admin@pharmacie.com` / `password`
- Client : `client@test.com` / `password`

**6 catégories**
Analgésiques, Antibiotiques, Vitamines & Compléments, Dermatologie, Cardiologie, Diabétologie

**12 produits**
Un à trois produits par catégorie avec prix, stock et date d'expiration.

---

## ETAPE 8 — Frontend React

### `src/api/axios.js`
Instance axios configurée :
- `baseURL` : `http://localhost:8000/api`
- Intercepteur de requête : ajoute automatiquement `Authorization: Bearer <token>` depuis localStorage

### `src/context/AuthContext.jsx`
Contexte global d'authentification :
- **État** : `user`, `loading`
- **Au démarrage** : si token en localStorage → appel `/profile` pour récupérer l'utilisateur
- **login()** : POST /login, stocke le token, met à jour `user`
- **register()** : POST /register, idem
- **logout()** : POST /logout, supprime le token, réinitialise `user`

### `src/context/CartContext.jsx`
Contexte global du panier :
- Se synchronise automatiquement avec le backend quand `user` change
- **addToCart(productId, qty)** : POST /cart + re-fetch
- **updateItem(id, qty)** : PUT /cart/{id} + re-fetch
- **removeItem(id)** : DELETE /cart/{id} + re-fetch
- **clearCart()** : DELETE /cart
- **itemCount** : total des articles (pour le badge navbar)

### `src/components/Navbar.jsx`
- Liens selon l'état de connexion (client vs admin vs non connecté)
- Badge panier avec `itemCount` du CartContext

### `src/components/ProtectedRoute.jsx`
- **ProtectedRoute** : redirige vers /login si non connecté
- **AdminRoute** : redirige vers /login si non connecté, vers / si non admin

---

### Pages

#### `pages/Login.jsx`
- Formulaire email + mot de passe
- Appelle `login()` du AuthContext
- Redirige vers `/admin` si admin, `/` sinon

#### `pages/Register.jsx`
- Formulaire d'inscription complet
- Gère les erreurs de validation champ par champ

#### `pages/Home.jsx`
- Catalogue paginé (20 produits/page)
- Barre de recherche (filtre sur `nom`)
- Sélecteur de catégorie
- Bouton "Ajouter au panier" (visible seulement si connecté)

#### `pages/ProductDetail.jsx`
- Affiche tous les détails du produit
- Sélecteur de quantité (min 1, max stock)
- Bouton "Ajouter au panier"

#### `pages/Cart.jsx`
- Liste des articles avec modification de quantité et suppression
- Formulaire de commande (adresse, téléphone, notes)
- Calcul et affichage du total
- Soumet la commande via POST /orders

#### `pages/Orders.jsx`
- Liste des commandes de l'utilisateur
- Accordéon : cliquer pour voir le détail (articles, adresse, téléphone)
- Badge de statut coloré

#### `pages/Profile.jsx`
- Modifier nom, téléphone, adresse
- Changer le mot de passe (optionnel)
- Feedback visuel de succès/erreur

#### `pages/admin/Dashboard.jsx`
- Statistiques : nb produits, catégories, commandes, commandes en attente
- Liens rapides vers les 3 sections admin

#### `pages/admin/AdminProducts.jsx`
- Formulaire CRUD avec upload d'image
- Liste paginée avec aperçu image, stock, statut actif
- Modification inline (pré-remplit le formulaire)

#### `pages/admin/AdminCategories.jsx`
- Formulaire CRUD simple
- Liste avec compteur de produits par catégorie

#### `pages/admin/AdminOrders.jsx`
- Toutes les commandes (paginées)
- Accordéon avec détail de chaque commande
- Boutons de changement de statut en un clic

---

## Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@pharmacie.com | password |
| Client | client@test.com | password |

## Lancer le projet

```bash
# Backend (port 8000)
cd backend
php artisan serve

# Frontend (port 5173)
cd frontend
npm run dev
```

Accéder à : http://localhost:5173
