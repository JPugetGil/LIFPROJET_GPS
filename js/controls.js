L.Control.Mode = L.Control.extend({
    _listeners: [],
	initalize: options => {
		L.setOptions(this, options);
	},
    onAdd: map => {
        let button = L.DomUtil.create("button", "btn btn-dark btn-sm btn-block");
        button.type = "button";
        button.alt = "Bouton";
        button.title = "Déplacer Carte";
        button.appendChild(L.DomUtil.create("i", "fas fa-arrows-alt"));

        return button;
    },
    onRemove: map => {
        //
    },
    removeListeners: () => {

    }
});

L.control.mode = options => new L.Control.Mode(options);
