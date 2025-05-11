const fs = require('fs');
const path = require('path');
const ignore = require('ignore');  // Module pour gérer le .gitignore

// Fonction pour lire le fichier .gitignore
const readGitIgnore = () => {
  const gitIgnorePath = path.join(process.cwd(), '.gitignore');
  if (fs.existsSync(gitIgnorePath)) {
    return fs.readFileSync(gitIgnorePath, 'utf-8').split('\n').filter(line => line.trim() !== '');
  }
  return [];
};

// Fonction pour vérifier si un fichier est ignoré
const isIgnored = (filePath, gitIgnorePatterns) => {
  const relativePath = path.relative(process.cwd(), filePath);  // On travaille avec le chemin relatif
  return gitIgnorePatterns.some(pattern => {
    const ig = ignore().add(pattern);
    return ig.ignores(relativePath);
  });
};

// Fonction pour récupérer la structure des répertoires et fichiers
const getStructure = (dir, gitIgnorePatterns, indent = '') => {
  const structure = [];
  const files = fs.readdirSync(dir);

  // Tri des fichiers pour qu'ils soient toujours dans un ordre précis (d'abord les répertoires, ensuite les fichiers)
  files.sort();

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.lstatSync(fullPath);
    
    // Si c'est un fichier ignoré, on passe à l'élément suivant
    if (isIgnored(fullPath, gitIgnorePatterns)) {
      return;
    }

    if (stat.isDirectory()) {
      // Si c'est un répertoire, on l'ajoute et on l'explore récursivement
      structure.push(`${indent}├── ${file}/`);
      structure.push(...getStructure(fullPath, gitIgnorePatterns, `${indent}│   `));
    } else {
      // Si c'est un fichier, on l'ajoute à la structure
      structure.push(`${indent}├── ${file}`);
    }
  });

  return structure;
};

// Fonction pour ajouter des commentaires aux fichiers importants
const addComments = (structure) => {
  const comments = {
    '.ghost.json': 'Clés API Ghost (local + prod)',
    'gatsby-config.js': 'Configuration principale Gatsby',
    'gatsby-node.js': 'Création des pages dynamiques',
    'netlify.toml': 'Configuration Netlify',
    'renovate.json': 'Configuration de Renovate pour les mises à jour des dépendances',
    'src/components': 'Composants UI réutilisables',
    'src/pages': 'Pages statiques (404, etc.)',
    'src/templates': 'Templates dynamiques (posts, tags…)',
    'src/styles': 'Fichiers CSS',
    'src/utils': 'Fonctions utilitaires (GraphQL, RSS…)',
    'static': 'Contenus statiques (favicon, robots.txt…)',
    'plugins': 'Plugin local pour le manifest PWA',
    'README.md': 'Documentation du projet'
  };

  return structure.map(line => {
    const file = line.replace(/^.*\//, ''); // Récupère le nom du fichier ou répertoire sans chemin
    const comment = comments[file];
    if (comment) {
      return `${line}  # ${comment}`;
    }
    return line;
  });
};

// Lire le fichier .gitignore
const gitIgnorePatterns = readGitIgnore();

// Récupérer la structure du projet
const projectDir = process.cwd(); // Répertoire courant
const structure = getStructure(projectDir, gitIgnorePatterns);

// Ajouter les commentaires aux fichiers importants
const structureWithComments = addComments(structure);

// Sauvegarder la structure dans un fichier texte
fs.writeFileSync('structure.txt', structureWithComments.join('\n'), 'utf-8');
console.log('Structure sauvegardée dans structure.txt');
