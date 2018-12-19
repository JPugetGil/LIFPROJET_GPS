importScripts("./prototypes_modif.js");
importScripts("./maths.js");
//VERSION 2 of resample
let number = undefined;

self.onmessage = event => {
    if (number === undefined) {
        number = event.data; // Equal to the number of points we want to remove
    } else {
        let path = event.data; // Path where points will be removed
        let tabDistanceApres = [];
        let tabDistanceAvant = [];
        let tabEcart = [];
        let indexMin = 0;
        for (let i=1; i<path.features[0].geometry.coordinates.length-2; i++){
            tabDistanceApres.push(DistanceBetween2Points(path.features[0].geometry.coordinates[i-1],path.features[0].geometry.coordinates[i+1]));
        }
        for (let i=1; i<path.features[0].geometry.coordinates.length-2; i++){
            tabDistanceAvant.push(DistanceBetween2Points(path.features[0].geometry.coordinates[i-1],path.features[0].geometry.coordinates[i])+DistanceBetween2Points(path.features[0].geometry.coordinates[i],path.features[0].geometry.coordinates[i+1]));
        }
        for (let i=0; i<tabDistanceApres.length; i++){
            tabEcart[i]=tabDistanceAvant[i]-tabDistanceApres[i];
        }
        while(number>0){
            path.features[0].geometry.coordinates.splice(tabEcart.indexOf(tabEcart.min())+1,1);
            indexMin = tabEcart.indexOf(tabEcart.min());
            tabEcart.splice(tabEcart.indexOf(tabEcart.min()),1);
            tabEcart[indexMin-1]=((DistanceBetween2Points(path.features[0].geometry.coordinates[indexMin],path.features[0].geometry.coordinates[indexMin+1])+DistanceBetween2Points(path.features[0].geometry.coordinates[indexMin+1],path.features[0].geometry.coordinates[indexMin+2]))-DistanceBetween2Points(path.features[0].geometry.coordinates[indexMin],path.features[0].geometry.coordinates[indexMin+2]));
            number--;
        }
        self.postMessage(path);
    }
};
