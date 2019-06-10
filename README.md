# SoftGestion
Interface facilitant la manipulation de répertoires ayant du contenu évolutif.

## Installation
### Environnements d’exécution
- [NodeJS](https://nodejs.org/en/) 
- [PM2](https://pm2.io/runtime/)
Doivent être installés et disponible depuis l'invite de commande (PATH)

### Téléchargement
    npx degit PeufOne/softgestion softgestion
    
### Installation des modules
    npm i
   
### Démarrage du serveur de production
    npm run prod
Le port configuré par défaut est le  ***3000*** mais il peut être changé dans le fichier ***config.js***.

    module.exports = {
		PORT: dev ? 3001 : 3000
	}

### Monitoring
    pm2 monit

## Configuration
![Capture d'écran Gestion des chemins
](public/images/Paths_Gestion.GIF)

## Utilisation