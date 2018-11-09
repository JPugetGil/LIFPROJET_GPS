//Worker used to render faster the chart
importScripts("./maths.js");

self.onmessage = event => {
	let cols = [];
	event.data.forEach(current => {
		if (current.shown) {
			let distance = [];
			let ordonnee = [];
			let elevation = [];
			for (let i = 1; i < current.features[0].geometry.coordinates.length-1 ; i++) {
				distance.push(calculateDistance2(current.features[0].geometry.coordinates.slice(0, i)));
				ordonnee.push(current.features[0].geometry.coordinates[i][2]);
			}

			cols.push(distance);
			cols.push(ordonnee);
		}
	});
  self.postMessage(cols);
}
