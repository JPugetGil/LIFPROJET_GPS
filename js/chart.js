//Worker used to render faster the chart

self.onmessage = event => {
	let cols = [];
	event.data.forEach(current => {
		if (current.shown) {
			let abscisse = [];
			let ordonnee = [];
			for (let i = 0; i < current.features[0].geometry.coordinates.length ; i++) {
				abscisse.push(i+1);
				ordonnee.push(current.features[0].geometry.coordinates[i][2]);
			}

			cols.push(abscisse);
			cols.push(ordonnee);
		}
	});
  self.postMessage(cols);
}
