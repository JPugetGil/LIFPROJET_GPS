//Prototypes for Array

Array.prototype.max = function() {
    console.log("Array modified");
    return Math.max.apply(null, this);
};

Array.prototype.min = function() {
    return Math.min.apply(null, this);
};