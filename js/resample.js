/*import('./prototypes_modif.js').then(module => {
    module.arrayModif();
});*/

let number = undefined;

self.onmessage = event => {
    if (number === undefined) {
        number = event.data;
    } else {
        let path = event.data;
        let tolerence = 0.00001;
        let tabDistance = [];
        let totalDistance = calculateDistance(path);
        while(number>0){
            tabDistance = [];
            for (let i=0; i<path.features[0].geometry.coordinates.length-2; i++){
                tabDistance.push(DistanceBetween2Points(path.features[0].geometry.coordinates[i],path.features[0].geometry.coordinates[i+1]));
            }
            if(tabDistance.min() < totalDistance*tolerence){
                path.features[0].geometry.coordinates.splice(tabDistance.indexOf(tabDistance.min()),1);
                number--;
            } else {
                tolerence += 0.0000002;
            }
        }
        self.postMessage(path);
    }
}

// Convert a number in degrees to radians
// Param : degrees -> number in degrees
// Return : a number in radians
function Deg2Rad(degrees) {
	return degrees * (Math.PI/180);
}

// Calculate the distance between 2 points from the latitude and the longitude of these points
// Param : 2 points -> 2 tables with latitude, longitude and altitude
// Return : the distance between these 2 points
function DistanceBetween2Points(point1, point2) {
	return 6367445*Math.acos(Math.sin(Deg2Rad(point1[1]))*Math.sin(Deg2Rad(point2[1]))+Math.cos(Deg2Rad(point1[1]))*Math.cos(Deg2Rad(point2[1]))*Math.cos(Deg2Rad(point1[0])-Deg2Rad(point2[0])))/1000;
}

// Calculate the global distance of the trace
// Param : a trace
// Return : the global distance
function calculateDistance(trace) {
	let distance = 0;
	//console.log(DistanceBetween2Points(trace.features[0].geometry.coordinates[0],trace.features[0].geometry.coordinates[1]));;
	for(let i = 0; i<trace.features[0].geometry.coordinates.length-1; i++) {
		distance += DistanceBetween2Points(trace.features[0].geometry.coordinates[i],trace.features[0].geometry.coordinates[i+1]);
	}
	return distance.toFixed(2);
}

Array.prototype.max = function() {
    return Math.max.apply(null, this);
};

Array.prototype.min = function() {
    return Math.min.apply(null, this);
};
