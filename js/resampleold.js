importScripts("./prototypes_modif.js");
importScripts("./maths.js");
//VERSION 1 of resample
let number = undefined;

self.onmessage = event => {
    if (number === undefined) {
        number = event.data; // Equal to the number of points we want to remove
    } else {
        let path = event.data; // Path where points will be removed
        let tolerence = 0.00001;
        let tabDistance = [];
        let totalDistance = calculateDistance(path);
        let nombreDeDonnees = 0;
        while(number>0){
            tabDistance = [];
            for (let i=0; i<path.features[0].geometry.coordinates.length-2; i++){
                tabDistance.push(DistanceBetween2Points(path.features[0].geometry.coordinates[i],path.features[0].geometry.coordinates[i+1]));
            }
            if(tabDistance.min() < totalDistance*tolerence){
                path.features[0].geometry.coordinates.splice(tabDistance.indexOf(tabDistance.min()),1);
                number--;
                nombreDeDonnees++;
            } else if (tolerence > 0.00025) {
              number = 0;
            } else {
              tolerence += 0.0000002;
            }
        }
        self.postMessage(path);
    }
};
