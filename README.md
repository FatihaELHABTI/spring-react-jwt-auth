# Application d'Authentification JWT - Spring Boot + React

## Description du projet

Cette application est un système d'authentification complet utilisant JSON Web Tokens (JWT) pour sécuriser les communications entre un backend Spring Boot et un frontend React. Elle permet aux utilisateurs de se connecter, d'obtenir un token JWT, et d'accéder à des ressources protégées.

## Captures d'écran

### Page de connexion

![Page de connexion - Utilisateur](https://github.com/FatihaELHABTI/spring-react-jwt-auth/blob/main/imgs/Capture%20d'%C3%A9cran%202025-12-30%20210028.png)

*Interface de connexion avec validation des champs et gestion des erreurs*

### Tableau de bord - Administrateur

![Dashboard Admin](https://github.com/FatihaELHABTI/spring-react-jwt-auth/blob/main/imgs/Capture%20d'%C3%A9cran%202025-12-30%20210054.png)

*Tableau de bord pour l'utilisateur avec le rôle ADMIN*

### Tableau de bord - Utilisateur standard

![Dashboard User](https://github.com/FatihaELHABTI/spring-react-jwt-auth/blob/main/imgs/Capture%20d'%C3%A9cran%202025-12-30%20210014.png)

*Tableau de bord pour l'utilisateur avec le rôle USER*



## Architecture de l'application

### Backend (Spring Boot)

Le backend est construit avec Spring Boot 4.0.1 et utilise Spring Security pour la gestion de la sécurité.

#### Technologies utilisées

- Java 17
- Spring Boot 4.0.1
- Spring Security
- Spring Web MVC
- JSON Web Token (JJWT 0.11.5)
- Maven pour la gestion des dépendances

#### Structure du projet backend

**1. Configuration de sécurité (SecurityConfig.java)**

Cette classe configure la chaîne de filtres de sécurité de l'application.

- Désactive la protection CSRF car l'application utilise JWT
- Configure CORS pour permettre les requêtes depuis React (port 5173)
- Définit les endpoints publics (/api/auth/**) et les endpoints protégés
- Ajoute le filtre JWT avant le filtre d'authentification standard
- Autorise les méthodes HTTP: GET, POST, PUT, DELETE
- Autorise les headers: Authorization et Content-Type

**2. Contrôleur d'authentification (AuthController.java)**

Ce contrôleur expose deux endpoints REST:

- POST /api/auth/login : Authentifie l'utilisateur et génère un token JWT
  - Reçoit les credentials (username et password)
  - Utilise AuthenticationManager pour valider les credentials
  - Génère un token JWT incluant le username et les rôles
  - Retourne le token dans la réponse
  
- GET /api/hello : Endpoint protégé de test
  - Nécessite un token JWT valide
  - Retourne un message de confirmation

**3. Filtre JWT (JwtAuthFilter.java)**

Ce filtre intercepte chaque requête HTTP pour valider le token JWT:

- Extrait le token du header Authorization (format: Bearer TOKEN)
- Valide le token en vérifiant la signature et l'expiration
- Extrait le username du token
- Charge les détails de l'utilisateur depuis UserDetailsService
- Configure le contexte de sécurité Spring si le token est valide
- Laisse passer la requête vers le contrôleur

**4. Service JWT (JwtService.java)**

Ce service gère la génération et la validation des tokens JWT:

- generateToken(): Crée un nouveau token JWT avec:
  - Subject: username
  - Claims personnalisés: rôles de l'utilisateur
  - Date d'émission et date d'expiration
  - Signature HMAC-SHA256 avec la clé secrète
  
- extractUsername(): Extrait le username du token
- isTokenValid(): Vérifie si le token est valide et non expiré
- parse(): Parse et valide la signature du token

**5. Service des utilisateurs (MyUserDetailsService.java)**

Gère les utilisateurs en mémoire pour la démonstration:

- Utilisateur standard: username=user, password=password, rôle=USER
- Administrateur: username=admin, password=admin123, rôle=ADMIN
- Implémente UserDetailsService pour l'intégration avec Spring Security

**6. Modèles de données**

- AuthRequest: Record pour les credentials (username, password)
- AuthResponse: Record pour le token JWT retourné

**7. Configuration application.properties**

- server.port: Port du serveur (8080)
- app.jwt.secret: Clé secrète pour signer les tokens (minimum 32 caractères)
- app.jwt.expiration-ms: Durée de validité du token (3600000 ms = 1 heure)

### Frontend (React + Vite)

Le frontend est une application React moderne utilisant Vite comme outil de build.

#### Technologies utilisées

- React 18
- Vite
- React Router DOM pour la navigation
- Axios pour les requêtes HTTP
- Tailwind CSS pour le styling
- Lucide React pour les icônes
- jwt-decode pour décoder les tokens JWT

#### Structure du projet frontend

**1. Service API (api.js)**

Configure Axios pour communiquer avec le backend:

- baseURL: http://localhost:8080/api
- Intercepteur de requêtes: Ajoute automatiquement le token JWT dans le header Authorization de chaque requête
- Récupère le token depuis localStorage
- Format du header: Authorization: Bearer TOKEN

**2. Composant Login (Login.jsx)**

Page de connexion avec:

- Formulaire avec champs username et password
- Validation des champs (required)
- État de chargement pendant l'authentification
- Gestion des erreurs avec affichage d'un message
- Stockage du token dans localStorage après connexion réussie
- Redirection automatique vers /dashboard après login
- Interface moderne avec fond sombre et carte centrée
- Icônes pour améliorer l'expérience utilisateur

**3. Composant Dashboard (Dashboard.jsx)**

Page principale de l'application protégée:

- Vérification du token JWT au chargement
- Décodage du token pour extraire:
  - Username (depuis le champ 'sub')
  - Rôle de l'utilisateur (depuis le champ 'roles')
- Sidebar de navigation avec:
  - Logo de l'application
  - Liens de navigation (Dashboard, Mon Profil)
  - Bouton de déconnexion
- En-tête avec:
  - Titre de la page
  - Message de bienvenue avec username
  - Avatar avec initiale de l'utilisateur
- Cartes d'information affichant:
  - Statut du serveur (en ligne)
  - Rôle de l'utilisateur (USER ou ADMIN)
  - État de la session (active)
- Zone principale affichant le message du backend
- Bouton de déconnexion qui:
  - Supprime le token de localStorage
  - Redirige vers la page de login

**4. Routage (App.jsx)**

Configure les routes de l'application:

- Route / : Page de connexion
- Route /dashboard : Page du tableau de bord (protégée)

**5. Styling (index.css)**

Utilise Tailwind CSS pour un design moderne et responsive.

## Flux d'authentification

### Étape 1: Connexion de l'utilisateur

1. L'utilisateur saisit ses credentials sur la page de login
2. Le frontend envoie une requête POST à /api/auth/login
3. Le backend valide les credentials avec Spring Security
4. Si valides, le backend génère un token JWT signé
5. Le token est retourné au frontend
6. Le frontend stocke le token dans localStorage
7. L'utilisateur est redirigé vers le dashboard

### Étape 2: Accès aux ressources protégées

1. Le frontend effectue une requête vers un endpoint protégé
2. L'intercepteur Axios ajoute le token dans le header Authorization
3. Le filtre JWT du backend intercepte la requête
4. Le filtre valide le token (signature, expiration)
5. Si valide, le filtre extrait le username et configure le contexte de sécurité
6. Le contrôleur traite la requête et retourne la réponse
7. Le frontend affiche les données reçues

### Étape 3: Déconnexion

1. L'utilisateur clique sur le bouton de déconnexion
2. Le token est supprimé de localStorage
3. L'utilisateur est redirigé vers la page de login

## Structure des tokens JWT

Un token JWT est composé de trois parties séparées par des points:

```
HEADER.PAYLOAD.SIGNATURE
```

### Header

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### Payload (Claims)

```json
{
  "sub": "admin",
  "roles": [
    {
      "authority": "ROLE_ADMIN"
    }
  ],
  "iat": 1234567890,
  "exp": 1234571490
}
```

### Signature

La signature est créée en encodant le header et le payload avec la clé secrète définie dans application.properties.

## Installation et exécution

### Prérequis

- Java 17 ou supérieur
- Maven 3.6 ou supérieur
- Node.js 16 ou supérieur
- npm ou yarn

### Installation du backend

```bash
cd app_jwt_spring_react
mvn clean install
mvn spring-boot:run
```

Le serveur démarre sur http://localhost:8080

### Installation du frontend

```bash
cd frontend
npm install
npm run dev
```

L'application React démarre sur http://localhost:5173

## Comptes de test

### Utilisateur standard

- Username: user
- Password: password
- Rôle: USER

### Administrateur

- Username: admin
- Password: admin123
- Rôle: ADMIN

## Sécurité

### Points importants

- Les mots de passe sont préfixés par {noop} pour indiquer qu'ils ne sont pas encodés (à éviter en production)
- La clé secrète JWT doit être complexe et sécurisée (minimum 32 caractères)
- Les tokens ont une durée de vie limitée (1 heure par défaut)
- CORS est configuré pour accepter uniquement les requêtes depuis localhost:5173
- CSRF est désactivé car l'application utilise JWT (stateless)

### Recommandations pour la production

- Utiliser une base de données pour stocker les utilisateurs
- Encoder les mots de passe avec BCrypt
- Stocker la clé secrète JWT dans des variables d'environnement
- Implémenter un système de refresh tokens
- Ajouter une liste noire pour les tokens révoqués
- Activer HTTPS
- Configurer CORS pour accepter uniquement les domaines autorisés
- Ajouter des logs de sécurité
- Implémenter une limite de tentatives de connexion

## Structure des dossiers

### Backend

```
app_jwt_spring_react/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── ma/enset/app_jwt_spring_react/
│   │   │       ├── config/
│   │   │       │   └── SecurityConfig.java
│   │   │       ├── controller/
│   │   │       │   └── AuthController.java
│   │   │       ├── filter/
│   │   │       │   └── JwtAuthFilter.java
│   │   │       ├── model/
│   │   │       │   ├── AuthRequest.java
│   │   │       │   └── AuthResponse.java
│   │   │       ├── service/
│   │   │       │   ├── JwtService.java
│   │   │       │   └── MyUserDetailsService.java
│   │   │       └── AppJwtSpringReactApplication.java
│   │   └── resources/
│   │       └── application.properties
├── pom.xml
```

### Frontend

```
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   └── Login.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Endpoints de l'API

### Endpoints publics

- POST /api/auth/login
  - Body: {"username": "user", "password": "password"}
  - Response: {"token": "eyJhbGciOiJIUzI1NiJ9..."}

### Endpoints protégés

- GET /api/hello
  - Header: Authorization: Bearer TOKEN
  - Response: {"message": "Bonjour, endpoint protégé OK ✅"}

## Dépannage

### Le backend ne démarre pas

- Vérifier que Java 17 est installé
- Vérifier que le port 8080 n'est pas déjà utilisé
- Vérifier les dépendances Maven

### Le frontend ne se connecte pas au backend

- Vérifier que le backend est démarré
- Vérifier la configuration CORS dans SecurityConfig.java
- Vérifier la baseURL dans api.js
- Ouvrir la console du navigateur pour voir les erreurs

### Token invalide ou expiré

- Vérifier que la clé secrète est identique entre la génération et la validation
- Vérifier que le token n'a pas expiré (durée de vie: 1 heure)
- Se reconnecter pour obtenir un nouveau token

### Erreur CORS

- Vérifier que le port React (5173) est autorisé dans corsConfigurationSource()
- Vérifier que les headers Authorization et Content-Type sont autorisés
- Redémarrer le backend après modification de la configuration CORS

## Extensions possibles

- Ajouter un système de refresh tokens
- Implémenter l'inscription de nouveaux utilisateurs
- Ajouter une gestion complète des profils utilisateurs
- Implémenter des rôles et permissions granulaires
- Ajouter une interface d'administration
- Implémenter la réinitialisation de mot de passe
- Ajouter une vérification par email
- Implémenter l'authentification à deux facteurs (2FA)
- Ajouter des logs et du monitoring
- Implémenter une pagination pour les listes de données

## Licence

Ce projet est à des fins éducatives et de démonstration.
