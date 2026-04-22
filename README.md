# Student Connect v2

Version dynamique de **Student Connect** en **Next.js + Supabase**.

## Ce que contient le projet

- front réadapté en **Next.js App Router**
- base de données **PostgreSQL via Supabase**
- authentification **Supabase Auth**
- annonces dynamiques
- détail d’annonce
- dépôt d’annonce
- favoris
- messagerie simple
- profil utilisateur
- schéma SQL prêt à exécuter

## 1. Créer la base de données

1. Crée un projet sur Supabase.
2. Ouvre **SQL Editor**.
3. Copie-colle le contenu de `sql/schema.sql`.
4. Clique sur **Run**.

Supabase permet de créer les tables soit depuis le Dashboard, soit directement en SQL, et son SQL Editor est prévu pour ça.

## 2. Récupérer les accès

Dans Supabase :

- **Project Settings** → **API**
- copie :
  - `Project URL`
  - `anon public key`

Crée ensuite un fichier `.env.local` à la racine du projet avec :

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 3. Installer et lancer le projet

```bash
npm install
npm run dev
```

Puis ouvre :

```text
http://localhost:3000
```

## 4. Déployer sur Vercel

Vercel gère nativement les projets Next.js, et la méthode officielle est de déployer depuis la racine du projet avec la CLI ou via import Git.

### Méthode simple

- pousse ce dossier sur GitHub
- importe le repo dans Vercel
- ajoute les variables d’environnement :
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- redeploie

## 5. Comment accéder à la BDD

Tu auras **3 façons** d’y accéder :

### A. Depuis l’interface Supabase

- **Table Editor** : voir et modifier les lignes comme un tableur
- **SQL Editor** : lancer des requêtes SQL
- **Authentication > Users** : voir les comptes créés

Supabase expose bien un Table Editor, un SQL Editor et une section Users dans le Dashboard.

### B. Depuis ton application

Le code lit et écrit dans la BDD via le client Supabase :

- annonces : `listings`
- images : `listing_images`
- favoris : `favorites`
- messages : `messages`
- profils : `profiles`

### C. Depuis un client SQL externe

Supabase étant basé sur PostgreSQL, tu peux aussi te connecter avec un client SQL externe si tu veux administrer la base plus finement. Supabase se présente comme une plateforme Postgres avec API, Auth et Storage.

## 6. Structure du projet

```text
app/
components/
lib/
sql/
.env.example
README.md
```

## 7. Important

Je n’ai pas créé le projet Supabase à ta place ici, car il faut tes propres identifiants et ton propre compte. En revanche, **le schéma SQL, le code et le branchement à la base sont prêts**.

## 8. Suite recommandée

Pour aller plus loin :

- upload réel d’images avec Supabase Storage
- édition / suppression d’annonces côté interface
- filtres avancés
- notifications
- chat temps réel
