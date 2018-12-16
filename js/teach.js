function setUpPopovers(geoData) {
    let moveMapDesc = `Les 5 premiers boutons de la colonne sont les boutons de mode. Le mode actif est celui en rouge.<br/>
        Le mode activé par ce bouton empêche de modifier la trace.
        Idéal pour simplement explorer la carte.
        <strong>Cliquez pour l'activer !</strong>`;
    let movePointDesc = `Pour activer le mode, appuyez sur ce bouton.
        Faites un clic droit pour afficher les points près de votre souris.
        Une fois affiché, déplacer votre souris tout en restant appuyé sur un point pour le déplacer.
        <strong>Essayez de déplacer un point!</strong>`;
    let addPointDesc = `Pour activer le mode, appuyez sur ce bouton.
        Ajoutez un point à la fin de la trace en cliquant à l'endroit souhaité.
        <strong>Essayez d'ajouter un point!</strong>`;
    let deletePointDesc = `Pour activer le mode, appuyez sur ce bouton.
        Faites un clic droit pour afficher les points près de votre souris.
        Il vous suffit de cliquer ensuite sur un point affiché pour le supprimer.
        <strong>Essayez de supprimer un point !</strong>`;
    let unlinkDesc = `Enfin, le dernier mode est celui de séparation de traces.
        Faites un clic droit pour afficher les points près de votre souris.
        Vous pourrez ensuite cliquer sur un des points affichés pour séparer la trace à son niveau.
        <strong>Essayez de couper une trace en deux !</strong>`;
    let linkDesc = `A l'inverse, utilisez ce bouton pour lier ensemble deux traces.
        <strong>Essayez de réunir deux traces !</strong>`;
    let undoDesc = `Vous venez de vous tromper ? Aucun problème ! Vous pouvez utiliser ce bouton pour annulez une action.
        <strong>Essayez d'annuler !</strong>`;
    let redoDesc = `Vous vous apercevez que finalement annuler était une erreur ? Aucun souci ! Utilisez ce bouton pour annuler une annulation.
        <strong>Essayez de réitérer une action annulée !</strong>`;
    let sampleDesc = `Cette fonctionnalité vous permet de rééchantilloner votre trace, c'est-à-dire réduire son nombre de points.
        Pour cela, inscrivez dans le champ le nombre de points que vous souhaitez enlever. Puis appuyez sur le bouton juste en dessous ou cliquez sur Entrée.
        <strong>Essayez le rééchantillonnage !</strong>`;
    let infosDesc = `Besoin de connaître la longueur de la trace ou son nombre de points ?
        <strong>Cliquez sur ce bouton!</strong>`;
    let saveDesc = `Vous pouvez télécharger la trace sous forme de fichier '.gpx',
        toutes vos modifications seront présentes dans le nouveau fichier.
        <strong>Lancez le téléchargement !</strong>`;
    let printDesc = `Vous pouvez imprimer le visuel de la page grâce à ce bouton.
        <strong>Lancez l'impression !</strong>`;
    
	document.getElementById("moveMap").setAttribute("data-content", moveMapDesc);
	document.getElementById("movePoint").setAttribute("data-content", movePointDesc);
	document.getElementById("undo").setAttribute("data-content", undoDesc); 
	document.getElementById("redo").setAttribute("data-content", redoDesc); 
	document.getElementById("addPoint").setAttribute("data-content", addPointDesc);
	document.getElementById("deletePoint").setAttribute("data-content", deletePointDesc);
	document.getElementById("link").setAttribute("data-content", linkDesc);
	document.getElementById("unlink").setAttribute("data-content", unlinkDesc);
	document.getElementById("samplingFactor").setAttribute("data-content", sampleDesc);
	document.getElementById("print").setAttribute("data-content", printDesc);
	document.getElementById("saveButton").setAttribute("data-content", saveDesc);
	document.getElementById("infos").setAttribute("data-content", infosDesc);

	return geoData;
}

function activatePopover(id) {
    let realId = '#' + id;
    $(realId).popover('show');
    $(realId).popover('disable');
}

function desactivatePopover(id) {
    let realId = '#' + id;
    $(realId).popover('hide');
    $(realId).popover('disable');
}

function teach(index = 0) {
    let ids = ["moveMap", "movePoint", "addPoint", "deletePoint", "unlink", "link", "undo", "redo", "infos", "samplingFactor", "saveButton", "print"];

    if (index >= ids.length) {
        $('#tutorialEnd').modal({show: false});
        $('#tutorialEnd').modal('show');
        document.getElementById("tutorialEndButton").addEventListener("click", e => {
            document.getElementById("tutorialButton").click();
        });
    } else {
        let id = ids[index];
        activatePopover(id);
        document.getElementById("tutorialButton").addEventListener(id, () => {
            desactivatePopover(id);
            teach(index +1); // Recursion
        });
    }
}