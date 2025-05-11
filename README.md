## Sommaire

-   [🚀 Gatsby + Ghost Starter](#-gatsby--ghost-starter)
-   [🛠 Installation](#-installation)
-   [🚀 Utilisation](#-utilisation)
-   [🧪 Variables d'environnement](#-variables-denvironnement)
-   [🌍 Déploiement](#-déploiement)
-   [📁 Structure du projet](#-structure-du-projet)
-   [🧪 Autres commandes utiles](#-autres-commandes-utiles)
-   [🧠 Optimisation SEO](#-optimisation-seo)
-   [📝 Licence](#-licence)

# 🚀 Gatsby + Ghost Starter

Un starter ultra-rapide pour tester **Ghost en mode Headless CMS** avec un front **Gatsby**, prêt à déployer sur **Netlify** ou autres plateformes.

🧪 Ce projet sert à expérimenter un site connecté à Ghost hébergé sur [Pikapods](https://www.pikapods.com/), avec :

-   Une structure Gatsby claire
-   Une gestion de contenu via API Ghost
-   Un déploiement progressif : local → production

---

# 🛠 Installation

```bash
git clone https://github.com/TryGhost/gatsby-starter-ghost.git
cd gatsby-starter-ghost
yarn install
```

# 🚀 Utilisation

▶️ Lancer en local

```bash
gatsby develop
```

# 🧪 Variables d'environnement

Le starter utilise normalement un fichier .ghost.json, mais pour plus de simplicité et sécurité, on utilisera ici un fichier .env basé sur .env.example à la racine du projet. Ce fichier contient les variables nécessaires pour le bon fonctionnement du site en local et en production.

Exemple de .env

```bash
GHOST_API_URL=https://votre-instance.ghost.io
GHOST_CONTENT_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
SITEURL=http://localhost:8000
SITEURL_PROD=https://mon-site-en-prod.netlify.app
```

🚀 Adaptation du code gatsby-config.js
Le code gatsby-config.js est adapté pour le fonctionnement de ce starter avec les variables d’environnement du projet .env, voir ci-dessus.

💡 Utilisez version: "v4.0" si votre instance Ghost est < 5.x.

# 🌍 Déploiement

Ce starter est compatible avec Netlify, sans omettre les autres plateformes comme Vercel, Render, ou Railway.

Netlify
Fichier netlify.toml inclus ✅

Redirections \_redirects et headers \_headers déjà configurés

💡 Pensez à définir les variables d’environnement dans le dashboard Netlify :

GHOST_API_URL
GHOST_CONTENT_API_KEY

# 📁 Structure du projet

Avec la commande `tree -L 1` dans le terminal WSL Ubuntu, voici les principaux dossiers et fichiers :

```bash
├── LICENSE # Licence open-source
├── README.md # Documentation du projet
├── gatsby-browser.js # Config du comportement global de Gatsby côté client
├── gatsby-config.js # Fichier central de configuration Gatsby
├── gatsby-node.js # Hooks de build personnalisés de Gatsby
├── netlify.toml # Configuration du déploiement sur Netlify
├── package.json # Dépendances et scripts du projet
├── package-lock.json # Verrouillage des versions npm
├── plugins/ # Plugins Gatsby personnalisés
│ └── gatsby-plugin-ghost-manifest/
├── renovate.json # Configuration de la mise à jour automatique des deps
├── src/ # Dossier principal du code source front-end
│ ├── components/ # Composants réutilisables React
│ ├── images/ # Images spécifiques au code source
│ ├── pages/ # Pages de l'application (ex : 404.js)
│ ├── styles/ # Fichiers CSS
│ ├── templates/ # Templates de pages dynamiques
│ └── utils/ # Fonctions utilitaires
├── static/ # Contenu statique servi tel quel
│ ├── \_headers # Headers HTTP personnalisés
│ ├── \_redirects # Redirections Netlify
│ ├── favicon.ico/png # Icônes
│ ├── images/ # Images statiques
│ └── robots.txt # Directive SEO pour les moteurs de recherche
├── yarn.lock # Verrouillage des versions yarn
```

# 🧪 Autres commandes utiles

```bash
# Build de production
gatsby build

# Servir la version buildée localement
gatsby serve
```

# 🧠 Optimisation SEO

Dans Ghost Admin, activer "Make this site private" :

Cela désactive le thème par défaut de Ghost, évite le duplicate content et centralise le SEO sur Gatsby

# 📝 Licence

MIT © Ghost Foundation

✨ Auteur de cette version : oliveur.twist.again[@]proton.me

🎯 Personnalisé avec un peu de café !

# 🔗 Liens utiles

-   [Documentation officielle Ghost Content API](https://ghost.org/docs/content-api/)
-   [Gatsby + Ghost Starter (repo original)](https://github.com/TryGhost/gatsby-starter-ghost)
-   [Pikapods](https://www.pikapods.com/)
-   [Netlify](https://www.netlify.com/)
