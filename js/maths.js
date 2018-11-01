// Mathematical Functions //

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

// Return the mean of all numbers in an array
// Param : tab -> an array of numbers
// Return : number
function moyenneDunTableau(tab){
	let somme = 0.0;
	for (let i=0; i<tab.length; i++){
		somme += tab[i];
	}
	return (somme/tab.length);
}

// Return a zoom abling us to see all points given in parameters
// Param : tabLatitude -> all latitudes
// Param : tabLongitude -> all longitudes
// Param : moyenneLatitude -> mean of all latitudes
// Param : moyenneLongitude -> mean of all longitudes
// Return : a number corresponding to a zoom
function plusGrandModule(tabLatitude, tabLongitude, moyenneLatitude, moyenneLongitude){
	let module = 0;
	for(let i=0; i < tabLatitude.length; i++) {
		if(Math.sqrt((tabLatitude[i]-moyenneLatitude)*(tabLatitude[i]-moyenneLongitude)+(tabLongitude[i]-moyenneLongitude)*(tabLongitude[i]-moyenneLongitude)) > module){
			module = Math.sqrt((tabLatitude[i]-moyenneLatitude)*(tabLatitude[i]-moyenneLongitude)+(tabLongitude[i]-moyenneLongitude)*(tabLongitude[i]-moyenneLongitude));
		}
	}
	return module;
}

// Convert a time in seconds to a time in hours
// Param : sec -> time in seconds
// Return : a time in hours
function secondsToHours(sec) {
	let hrs = Math.floor(sec/3600);
	let min = Math.floor((sec%3600)/60);
	sec = sec % 60;

	if(sec<10) {
		sec = "0" + sec;
	}

	if(min<10) {
		min = "0" + min;
	}

	return hrs + ":" + min + ":" + sec;
}

function getLengthAfterDot(number) {
	let stringified = number.toString();
	return stringified.slice(stringified.indexOf('.') +1, stringified.length).length;
}

function isBetween(x, min, max) {
	return x >= min && x <= max;
}

function pointsInInterval(coordinates, latitude, longitude, interval) {
	let points = [];
	let precision = getLengthAfterDot(interval);
	let lats = [
		Number( (latitude - interval).toFixed(precision) ),
		Number( (latitude + interval).toFixed(precision) )

	];
	let lngs = [
		Number( (longitude - interval).toFixed(precision) ),
		Number( (longitude + interval).toFixed(precision) )
	];
	coordinates.forEach(coord => {
		if (isBetween(coord[1], lats[0], lats[1]) && isBetween(coord[0], lngs[0], lngs[1])) {
			points.push(coord);
		}
	});
	return points;
}

/*
function indexesOfPoint(tab, latitude, longitude) {
	let lat = [0, 0, 0];
	let long = [0, 0, 0];
	lat[0] = Number(latitude.toFixed(3));
	lat[1] = Number(latitude.toFixed(6));
	lat[2] = Number(latitude.toFixed(3)) + 0.001;
	long[0] = Number(longitude.toFixed(3));
	long[1] = Number(longitude.toFixed(6));
	long[2] = Number(longitude.toFixed(3)) + 0.001;
	console.log(lat);
	console.log(long);
	return tab.reduce( (acc, coord, index) => {
		console.log(coord);
		let inside = lat[0] <= coord[0] && lat[1] >= coord[0] && long[0] <= coord[1] && long[1] >= coord[1];
		if (inside) {
			return acc.push(index);
		} else {
			return acc;
		}
	}, []);
}*/