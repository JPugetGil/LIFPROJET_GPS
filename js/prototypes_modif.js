//Prototypes for Array

// let tab = [..]; 
// tab.max() return tab's max
Array.prototype.max = function() {
    return Math.max.apply(null, this);
};

// let tab = [..]; 
// tab.min() return tab's min
Array.prototype.min = function() {
    return Math.min.apply(null, this);
};