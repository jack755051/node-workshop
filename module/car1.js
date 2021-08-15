let brand = "Nissan";
let owner = "";
let color = "red";
let model = "GTR";
let price = "6,000,000"

function showBrand(){
    return brand;
}
function showColor(){
    return color;
}
function showModel(){
    return model;
} 
function showPrice(){
  return price
}
function setOwner(name){
    owner = name;
}
function showOwner(){
    return owner;
}


module.exports = {
    showBrand,
    showModel,
    showColor,
    showPrice,
    showOwner,
  };


