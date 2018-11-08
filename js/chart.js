//Worker used to render faster the chart

self.onmessage = event => {
	let xs = {};
	let cols = [];
	event.data.forEach(current => {
		/*if (current.shown) {
			let file = current.file;
			let x = "x" + file;
			xs[file] = x;

			let abscisse = [x];
			let ordonnee = [file];
			for (let i = 0; i < current.features[0].geometry.coordinates.length ; i++) {
				abscisse.push(i+1);
				ordonnee.push(current.features[0].geometry.coordinates[i][2]);
			}

			cols.push(abscisse);
			cols.push(ordonnee);
		}*/
	});
  self.postMessage([xs,cols]);
}
