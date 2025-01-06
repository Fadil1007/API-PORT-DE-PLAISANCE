# Port de Plaisance Russell - API

Ce projet est une application de gestion des catways et des réservations pour le Port de Plaisance Russell. Elle permet d'ajouter, de modifier et de supprimer des catways et des réservations.

## Fonctionnalités

- **Gestion des Catways**
  - Ajouter un catway
  - Modifier un catway
  - Supprimer un catway
  - Lister les catways

- **Gestion des Réservations**
  - Ajouter une réservation
  - Supprimer une réservation
  - Lister les réservations

## Prérequis

- Node.js
- MongoDB

## Installation

1. Clonez le dépôt :

   ```bash
   git clone https://github.com/Fadil1007/API-PORT-DE-PLAISANCE.git
   cd votre-depot

    Installez les dépendances :

    bash

    npm install



Démarrage

    Assurez-vous que MongoDB est en cours d'exécution :



Lancez le serveur Node.js :

    node app.js

Ouvrez votre navigateur et accédez à :


    http://localhost:3000

## Coordonnées utilisateurs pour la connection:
    
    "name": "admin"
    "email": "Raif@gmail.com"
    "password": "Assfad10"

Structure du Projet

    public/ : Contient les fichiers statiques (HTML, CSS, JavaScript).
    routes/ : Contient les fichiers de routage pour les catways, les utilisateurs et les réservations.
    controllers/ : Contient les fichiers de contrôleurs pour gérer la logique métier des catways et des réservations.
    models/ : Contient les modèles Mongoose pour les catways et les réservations.
    middlewares/ : Contient les middlewares pour l'authentification.


Création d'un utilisateur avec le programme Postman qui sert d'insertion de requête rapidement :

Choisissez POST, entrer l'adresse ci-dessous :

    https://api-port-de-plaisance-6zss.onrender.com/users
