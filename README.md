# M-LOCATION Application de Géolocalisation et Gestion des Sites et ces Documents



## 📍 À propos du projet

M-Location est une application web de géolocalisation développée avec Laravel (backend) et React (frontend) qui permet de gérer des sites d'une entreprise répartis au Maroc. L'application affiche les sites sur une carte interactive, avec un système avancé de gestion des documents et des accès selon les rôles des utilisateurs.

Quatre rôles principaux sont pris en charge :

- Super admin (Founder) : gestion complète de L'application en ajoutant aussi les compts admin.
- Admin : gestion complète des sites, utilisateurs, documents et accès , les Logs.
- Manager (Super utilisateur) : gestion des accès des utilisateurs aux documents et sites
- Utilisateur : consultation des sites et documents accessibles uniquement

## ✨ Fonctionnalités principales

- Carte interactive affichant les sites géolocalisés de M-AUTOMOTIV au Maroc
- Gestion des documents associés à chaque site, avec contrôle fin des droits d'accès
- Système de rôles et permissions (Admin, Manager, Utilisateur)
- Filtrage dynamique des sites et documents selon les droits d'accès
- API RESTful sécurisée pour la communication backend/frontend
- Authentification sécurisée avec gestion des sessions
- Interface réactive en React.js pour une meilleure expérience utilisateur

## 🚀 Installation

### Prérequis
- PHP 8.1 ou supérieur
- Composer
- MySQL ou PostgreSQL
- Node.js et NPM
- TailWind CSS
- Extensions PHP : BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML

### Étapes d'installation

1. Cloner le dépôt
```bash
git clone https://github.com/aymennnb/geo-manager
cd geo-manager
```

2. Installer les dépendances
```bash
composer install
npm install
npm run build
```

3. Configurer l'environnement
```bash
cp .env.example .env
php artisan key:generate
```

4. Configurer la base de données dans le fichier `.env`
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nom_de_votre_base
DB_USERNAME=utilisateur
DB_PASSWORD=mot_de_passe
```

6. Exécuter les migrations et seeders
```bash
php artisan migrate --seed
```

7. Lancer l'application
```bash
php artisan serve
```

## 🧰 Technologies utilisées

- **Framework:** Laravel 10.x
- **Base de données:** MySQL
- **Frontend:** React
- **Cartographie:** Leaflet js
- **Authentification:** Laravel Sanctum/Passport

## 📞 Contact

Nom du développeur - [@Linkdin](https://www.linkedin.com/in/aymen-nabaoui/) - email@example.com

Lien du projet: [https://geo-manager.m-automoti.ma](https://github.com/aymennnb/geo-manager)
