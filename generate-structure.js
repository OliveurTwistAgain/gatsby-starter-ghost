// generate-structure.js
// Ce script génère une structure de répertoires et fichiers d'un projet Node.js

const fs = require('fs');
const path = require('path');
const ignore = require('ignore');
const { exec } = require('child_process');

// Fonction pour lire le fichier .gitignore et créer un objet ignore()
const createIgnore = () => {
  const gitIgnorePath = path.join(process.cwd(), '.gitignore');
  const ig = ignore();
  if (fs.existsSync(gitIgnorePath)) {
    const patterns = fs.readFileSync(gitIgnorePath, 'utf-8').split('\n').filter(line => line.trim() !== '');
    ig.add(patterns);
  }
  return ig;
};

// Fonction pour récupérer la structure des répertoires et fichiers avec affichage 'tree'
// gère le dernier élément avec └── et ajuste les indentations verticales
const getStructure = (dir, ig, prefix = '') => {
  let structure = [];
  let entries = fs.readdirSync(dir);

  // Filtrer les fichiers ignorés d'un coup
  entries = entries.filter(name => !ig.ignores(path.relative(process.cwd(), path.join(dir, name))));

  // Trier dossiers puis fichiers
  entries.sort((a, b) => {
    const aIsDir = fs.statSync(path.join(dir, a)).isDirectory();
    const bIsDir = fs.statSync(path.join(dir, b)).isDirectory();
    if (aIsDir && !bIsDir) return -1;
    if (!aIsDir && bIsDir) return 1;
    return a.localeCompare(b);
  });

  entries.forEach((entry, index) => {
    const fullPath = path.join(dir, entry);
    const isDir = fs.statSync(fullPath).isDirectory();

    // Détecter si c'est le dernier élément du dossier
    const isLast = index === entries.length - 1;

    // Choix du symbole : └── si dernier, sinon ├──
    const pointer = isLast ? '└──' : '├──';

    // Ligne courante avec indication dossier (/)
    const line = `${prefix}${pointer} ${entry}${isDir ? '/' : ''}`;
    structure.push(line);

    // Si c’est un dossier, on ajoute récursivement en ajustant le préfixe
    if (isDir) {
      // Pour l'indentation des enfants, on ajoute "    " si dernier, ou "│   " sinon
      const newPrefix = prefix + (isLast ? '    ' : '│   ');
      structure = structure.concat(getStructure(fullPath, ig, newPrefix));
    }
  });

  return structure;
};

// Fonction pour ajouter des commentaires aux fichiers/dossiers importants
const addComments = (structure) => {
  // Clés : nom exact fichier ou dossier, valeurs : commentaire
  const comments = {
    // Fichiers de configuration (racine)
    '.ghost.json': 'Fichier d’export/import de Ghost : inclut les clés API (local + production)',
    'gatsby-config.js': 'Configuration principale de Gatsby : métadonnées du site et plugins',
    'gatsby-node.js': 'Fichier utilisé pour générer dynamiquement les pages via GraphQL',
    'gatsby-browser.js': 'Configuration du comportement côté client (styles globaux, etc.)',
    'netlify.toml': 'Configuration du déploiement sur Netlify (build, redirect, headers)',
    'renovate.json': 'Configuration de Renovate pour automatiser la mise à jour des dépendances',
    'package.json': 'Liste des dépendances, scripts npm et configuration du projet',
    'package-lock.json': 'Verrouillage des versions exactes des dépendances (npm)',
    'yarn.lock': 'Verrouillage des versions exactes des dépendances (yarn)',
    '.editorconfig': 'Règles standardisées pour les éditeurs de texte',
    '.eslintignore': 'Liste des fichiers ou dossiers ignorés par ESLint',
    '.eslintrc.js': 'Configuration ESLint pour maintenir un code propre et cohérent',
    '.gitignore': 'Fichiers/dossiers à exclure du versionnage Git',
    '.nvmrc': 'Version de Node recommandée pour ce projet',
  
    // Dossiers du projet
    'src': 'Répertoire principal du code source',
    'src/components': 'Composants UI réutilisables : navigation, footer, boutons, etc.',
    'src/pages': 'Pages statiques générées automatiquement par Gatsby (404, index, etc.)',
    'src/templates': 'Templates dynamiques pour le contenu généré depuis Ghost (posts, tags…)',
    'src/styles': 'Feuilles de style globales ou spécifiques au projet',
    'src/utils': 'Fonctions utilitaires : fragments GraphQL, RSS, helpers divers',
    'static': 'Fichiers statiques copiés tels quels dans le dossier final (images, favicon, robots.txt)',
    'static/images': 'Images accessibles publiquement (logos, illustrations)',
    'static/images/icons': 'Icônes (SVG/PNG) utilisés dans l’interface ou les réseaux sociaux',
    'plugins': 'Plugins personnalisés utilisés localement (ex. : manifest PWA)',
    '.github': 'Configuration GitHub (templates d’issues, workflows, etc.)',
    '.github/ISSUE_TEMPLATE': 'Modèles d’issues pour structurer les demandes ou rapports',
    'public': 'Dossier généré par Gatsby après compilation (ne pas modifier manuellement)',
    'node_modules': 'Dépendances installées via npm/yarn (non versionnées)',
    
    // Documentation
    'README.md': 'Documentation principale du projet : installation, déploiement, utilisation'
  };

  return structure.map(line => {
    // Extraire le nom du fichier ou dossier sans indentation ni symboles
    // Ex: "├── src/" => "src", "└── README.md" => "README.md"
    const match = line.match(/[├└]── (.+?)(\/)?$/);
    if (!match) return line;

    const name = match[1];
    const comment = comments[name];

    if (comment) {
      return `${line}  # ${comment}`;
    }
    return line;
  });
};

// Création de l'objet ignore pour gérer .gitignore
const ig = createIgnore();

// Récupérer la structure du projet
const projectDir = process.cwd();
const structure = getStructure(projectDir, ig);

// Ajouter les commentaires
const structureWithComments = addComments(structure);

// Sauvegarder la structure dans un fichier texte
const outputFile = 'structure.txt';
fs.writeFileSync(outputFile, structureWithComments.join('\n'), 'utf-8');
console.log(`Structure sauvegardée dans ${outputFile}`);

// Ouvrir le fichier structure.txt dans Bloc-notes (Windows)
// Si tu es sous macOS ou Linux, adapte la commande (open, xdg-open...)
if (process.platform === 'win32') {
  exec(`notepad.exe ${outputFile}`, (err) => {
    if (err) {
      console.error('Impossible d\'ouvrir le fichier avec le Bloc-notes:', err);
    }
  });
}
