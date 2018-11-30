//Worker used to render faster the chart
importScripts("./maths.js");

self.onmessage = event => {
	let cols = [];
	let distance = [];
	let ordonnee = [];
	let elevation = [];
	for (let i = 1; i < event.data.features[0].geometry.coordinates.length-1 ; i++) {
		distance.push(calculateDistance2(event.data.features[0].geometry.coordinates.slice(0, i)));
		ordonnee.push(event.data.features[0].geometry.coordinates[i][2]);
	}

	cols.push(distance);
	cols.push(ordonnee);
  	self.postMessage(cols);
}
