# Improve my GPX :registered:
Ce site web vous permet de visualiser et d'éditer vos traces GPS.
Le lien de l'application web : http://persohemoreg.alwaysdata.net/works/improvemygpx/

## Importer ses traces
Accèder au site en ouvrant le fichier index.html dans votre navigateur web préféré. <br/>
Récupérer vos données de randonnées sous le format de fichier **.gpx**. <br/>
Mettez votre fichier dans le dossier data. :open_file_folder: <br/>
Dans l'interface vous pouvez importer vos fichiers.

## Description des fonctionnalités
* Visualisation de traces GPS
* Ajout/Suppression de points :heavy_plus_sign: / :heavy_minus_sign:
* Déplacement de points :airplane:
* Rééchantillonage des points, c'est-à-dire réduction du nombre de points :heavy_division_sign:
* Annulation/Désannulation d'une action :arrows_clockwise:
* Téléchargement de la trace modifiée :floppy_disk:
* Impression du visuel :fax:

## Compatibilité
Responsive design :computer: :on: :iphone:

### Navigateurs
- [x] Firefox :heavy_check_mark:
- [ ] Brave
- [ ] Chrome
- [ ] Chromium
- [x] Edge :heavy_check_mark:
- [ ] Internet Explorer
- [ ] Opera
- [ ] Safari
- [ ] Tor

## Documentation
* Cahier des charges -> doc/Cahier des Charges.pdf

###
Afin de pouvoir générer le graphe d'altitude lorsque le fichier GPX n'a pas d'altitude, nous utilisons l'API "Microsoft".
Pour que ça fonctionne:
* il faut générer une clé Bing dev disponible à ce lien : https://www.bingmapsportal.com/,
* Une fois la clé générée, allez dans main.js, puis dans la fonction "checkElevation(geoData)",
* Dans la variable link, modifiez KEY et insérez votre Clé : "http://dev.virtualearth.net/REST/v1/Elevation/List?points="+listCoord+"KEY";

## Origine
![Logo UCBL](https://www.univ-lyon1.fr/images/www/logo-lyon1.png) <br/>
La formation de Licence Informatique de l'Université Claude Bernard Lyon 1 contient l'UE LIFProjet. <br/>
Cette UE consiste en la réalisation d'un projet parmi une liste proposée par les enseignants. <br/>
Nous avons choisi le sujet : AMRC4. Edition et visualisation de traces GPS sur le web.

## Participants

### Développeurs
* Jérôme **G**IL 11608911
* Thomas **P**EYROT 11608040
* Anthony **S**CRIVEN 11607550

### Responsables
* Rémy CAZABET
* Alexandre MEYER
