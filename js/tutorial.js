// Tutorial functions

function launchTutorial() {
    console.log("Début du tutoriel");
    let button = document.getElementById("tutorialButton");
    button.title = "Stop le tutoriel";
    button.onclick = stopTutorial;
}

function stopTutorial() {
    console.log("Fin du tutoriel");
    let button = document.getElementById("tutorialButton");
    button.title = "Lance un tutoriel";
    button.onclick = launchTutorial;
}
