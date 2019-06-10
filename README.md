# SoftGestion
Interface facilitant la manipulation de répertoires ayant du contenu évolutif.

## Installation
### Environnements d’exécution
**Serveur:**
[NodeJS](https://nodejs.org/en/)  et  [PM2](https://pm2.io/runtime/) doivent être installés et disponibles depuis l'invite de commande.

**Client:** 
	L'application fonctionne sur n'importe quel navigateur moderne.
	Cependant, l'interface propose des liens permettent d'accéder directement aux répertoires Windows. Ce qui n'est nativement pas possible pour le navigateur. Pour résoudre le problème, il faut installer l'extension  [Local Explorer](https://chrome.google.com/webstore/detail/local-explorer-file-manag/eokekhgpaakbkfkmjjcbffibkencdfkl) pour Google Chrome. Une autre solution, si vous souhaitez utiliser un autre navigateur, est de changer les paramètres de sécurité pour l'adresse en question.

### Installation et démarrage

    # Téléchargement
    $ npx degit PeufOne/softgestion softgestion
    
    # Installation des modules
    $ npm i
    
    # Démarrage du serveur de production
    $ npm run prod
    
    # Monitoring
    $ pm2 monit
    
    # Plus de manipulation disponible dans la doc de pm2...
    
   
### Configuration du serveur
Le port  de production configuré par défaut est le  ***3000*** mais il peut être changé dans le fichier ***config.js***.

    module.exports = {
		PORT: dev ? 3001 : 3000
	}

### Configuration du client
Tant que les chemins de vos répertoires ne seront pas configurés, vous serez automatiquement redirigé sur la page d’administration...
![Capture d'écran Gestion des chemins
](public/images/Paths_Gestion.GIF)
1. Cliquez sur l'onglet *Gestion des chemins*
2. Renseignez les quatre champs (Attention, les chemins que vous indiquer doivent exister sur votre réseau et être accessible par le serveur)
3. Cliquez sur *Sauvegarder*
4. Vous pouvez désormais vous rendre sur la page d’accueil

NOTE: Pour que le serveur puisse envoyer un visuel des PDF contenu dans vos dossiers, il est nécessaire de redémarrer le serveur après avoir défini vos chemins.

L'application est maintenant entièrement disponible.

## Utilisation
Importez vos dossiers:
![Capture d'écran Gestion des chemins
](public/images/Create_Master.GIF)
1. Cliquez sur le clickboard

TODO: Ecrire la suite du tuto...