function setUpPopovers(geoData) {
    let moveMapDesc = `Ce bouton vous permet de revenir dans un mode où vous ne pouvez pas modifier la trace.
        Idéal pour simplement explorer la carte.
        <strong>Essayez !</strong>`;
    let movePointDesc = `Pour activer le mode, appuyez sur ce bouton.
        Faites un clic droit pour afficher les points près de votre souris.
        Une fois affiché, déplacer votre souris tout en restant appuyé sur un point pour le déplacer.
        <strong>Essayez !</strong>`;
    let undoDesc = `Vous pouvez utiliser ce bouton pour annulez une action.
        <strong>Essayez !</strong>`;
    let redoDesc = `Si vous avez annulé une action et souhaitez finalement y revenir,
        vous pouvez utiliser ce bouton.
        <strong>Essayez !</strong>`;
    let addPointDesc = `Pour activer le mode, appuyez sur ce bouton.
        Ajoutez un point à la fin de la trace en cliquant à l'endroit souhaité.
        <strong>Essayez !</strong>`;
    let deletePointDesc = `Pour activer le mode, appuyez sur ce bouton.
        Faites un clic droit pour afficher les points près de votre souris.
        Il vous suffit de cliquer ensuite sur un point affiché pour le supprimer.
        <strong>Essayez !</strong>`;
    let linkDesc = `Utilisez ce bouton pour lier ensemble deux traces.
        <strong>Essayez !</strong>`;
    let unlinkDesc = `Utilisez ce bouton pour séparer une trace en deux.
        Faites un clic droit pour afficher les points près de votre souris.
        Vous pourrez ensuite cliquer sur un des points affichés pour séparer la trace à son niveau.
        <strong>Essayez !</strong>`;
    let sampleDesc = `Cette fonctionnalité vous permet de rééchantilloner votre trace, c'est-à-dire réduire son nombre de points.
        Pour cela, inscrivez dans le champ le nombre de points que vous souhaitez enlever. Puis appuyez sur le bouton juste en dessous ou clickez sur Entrée.
        <strong>Essayez !</strong>`;
    let printDesc = `Vous pouvez imprimer le visuel de la page grâce à ce bouton.
        <strong>Essayez !</strong>`;
    let saveDesc = `Vous pouvez télécharger la trace sous forme de fichier '.gpx',
        toutes vos modifications seront présentes dans le nouveau fichier.
        <strong>Essayez !</strong>`;
    let infosDesc = `Afficher/désaffiche des informations sur la trace.
        <strong>Essayez !</strong>`;

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

function teach(id = "infos") {
    if (id === "") {
        $('#tutorialEnd').modal({show: false});
        $('#tutorialEnd').modal('show');
        document.getElementById("tutorialEndButton").addEventListener("click", e => {
            document.getElementById("tutorialButton").click();
        });
    } else {
        // Next id to activate
        let nextId;
        switch (id) {
            case "infos":
                nextId = "movePoint";
                break;
            case "movePoint":
                nextId = "addPoint";
                break;
            case "addPoint":
                nextId = "deletePoint";
                break;
            case "deletePoint":
                nextId = "moveMap";
                break;
            case "moveMap":
                nextId = "unlink";
                break;
            case "unlink":
                nextId = "link";
                break;
            case "link":
                nextId = "samplingFactor";
                break;
            case "samplingFactor":
                nextId = "undo";
                break;
            case "undo":
                nextId = "redo";
                break;
            case "redo":
                nextId = "saveButton";
                break;
            case "saveButton":
                nextId = "print";
                break;
            case "print":
                nextId = "";
                break;
            default:
                nextId = "";
        }

        // Current execution
        activatePopover(id);
        document.getElementById("tutorialButton").addEventListener(id, () => {
            desactivatePopover(id);
            teachPart(nextId);
        });
    }
}