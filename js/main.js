/* see if the search button was clicked
if clicked (add to onclick event) start requesting data
steps to requesting data:
 - first, build URL to each endpoint (if an option was selected)
 - then, compare the names you get back by looping through each array
 - if they match, add them to the results array

now we have to display the data:
    - we want to display the following:
        - name
        - generation
        - move(s)
    - we'll need to go to the pokemon endpoint for this data
        - make request to pokemon endpoint
        - take names in array and compare them to the names from the endpoint

so, function-wise, we'll need:
    - function to request data from url
    - function to display data
*/

window.onload = (e) => {document.querySelector("#searchbtn").addEventListener("click", findPoke)};
const typeUrl = "https://pokeapi.co/api/v2/type/";
const genderUrl = "https://pokeapi.co/api/v2/gender/";
const colorsUrl = "https://pokeapi.co/api/v2/pokemon-color/";
const pokemonUrl = "https://pokeapi.co/api/v2/pokemon/";

let nameArray = [];
let typeArray = [];
let genderArray = [];
let colorArray = [];
let tempArray = [];

let typeResponse = "";
let genderResponse = "";
let colorResponse = "";

let resultString = "";


//function to add to the search onclick
function findPoke(e){

    resultString = "";

    let type = document.getElementById("type").value;
    let gender = document.getElementById("gender").value;
    let color = document.getElementById("color").value;

    //we'll go from most specific to least specific
    //color --> type --> gender
    //inside of dataloaded, which is a very general "find the data and return it" function, we need to compare the data we get from each url

    //updating the urls
    if (type != "none"){
        let url = typeUrl;
        url += type;
        getType(url);
        console.log(url);
    }

    if (gender != "none"){
        let url = genderUrl;
        url += gender;
        console.log(url);
        getGender(url);
    }

    if (color != "none"){
        let url = colorsUrl;
        url += color;
        console.log(url);
        getColor(url);
    }

    compareNames();


    for (let i = 0; i < nameArray.length; i++){
        let url = pokemonUrl;
        url += nameArray[i];
        getPokemon(url);
    }
}


//maybe I should make a different getData function for each attribute, then compare the data from all of those inside of dataFound? no, dataFound is meant to be called inside of getData. instead, I could make a different dataFound function for each attribute and then utilize their calls to getData later on to compare them inside of another function
//actually, it looks like I need to make three of both functions. It's inefficient but I'm not sure how to clean up the efficiency just yet so this will work for now.

function getType(url) {
    //1 - create a new XHR object
    let xhr = new XMLHttpRequest();

    //2 - set the onload handler
    xhr.onload = typeFound;

    //3 - set the onerror handler
    xhr.onerror = dataNotFound;

    //4 - open connection and send the request
    xhr.open("GET", url);
    xhr.send();
}
function getColor(url){
    let xhr = new XMLHttpRequest();
    xhr.onload = colorFound;
    xhr.onerror = dataNotFound;
    xhr.open("GET", url);
    xhr.send();
}
function getGender(url){
    let xhr = new XMLHttpRequest();
    xhr.onload = genderFound;
    xhr.onerror = dataNotFound;
    xhr.open("GET", url);
    xhr.send();
}
function getPokemon(url){
    let xhr = new XMLHttpRequest();
    xhr.onload = displayResults;
    xhr.onerror = dataNotFound;
    xhr.open("GET", url);
    xhr.send();
}


function typeFound(e){
    typeArray = [];
    //color has the value "pokemon_species" with the name of the pokemon
    //type has the value "pokemon" with the name of the pokemon
    //gender has the value "pokemon_species_details" with the name of the pokemon
    let xhr = e.target;

    let obj = JSON.parse(xhr.responseText);


    if (!obj.pokemon || obj.pokemon.length == 0){
        document.querySelector("#status").innerHTML = "No results found!";
        return; //Bail out
    }

    let pokeData = obj.pokemon;

    for (let i=0; i < pokeData.length; i++){
        let info = pokeData[i];
        typeArray.push(info.pokemon.name);
    }

}
function colorFound(e){
    colorArray = [];
    let xhr = e.target;

    let obj = JSON.parse(xhr.responseText);

    if (!obj.pokemon_species || obj.pokemon_species.length == 0){
        document.querySelector("#status").innerHTML = "No results found!";
        return; //Bail out
    }

    let pokeData = obj.pokemon_species;

    for (let i=0; i < pokeData.length; i++){
        let info = pokeData[i];
        colorArray.push(info.name);
    }

}
function genderFound(e){
    genderArray = [];
    let xhr = e.target;

    let obj = JSON.parse(xhr.responseText);

    if (!obj.pokemon_species_details || obj.pokemon_species_details.length == 0){
        document.querySelector("#status").innerHTML = "No results found!";
        return; //Bail out
    }

    let pokeData = obj.pokemon_species_details;

    for (let i=0; i < pokeData.length; i++){
        let info = pokeData[i];
        genderArray.push(info.pokemon_species.name);
    }

}


function dataNotFound(e){
    console.log("An error occurred");
}

function compareNames(){
    nameArray = [];
    tempArray = [];
    //this is where we'll compare the names we get from each of our individal requests (saved to arrays)
    //we'll just loop through the arrays and compare the info, then we'll add the matching names to the nameArray
    //then, we'll call the getPokemon function and set the xhr.onload to displayResults, which we'll use to parse through the information from getPokemon and display our results to the user

    console.log("typeArray: " + typeArray);
    console.log("colorArray: " + colorArray);
    console.log("genderArray: " + genderArray);


    for (let j = 0; j< typeArray.length; j++){
        if (colorArray.includes(typeArray[j])){
            tempArray.push(typeArray[j]);
        }
        
    }
    console.log("tempArray: " + tempArray);

    for (let k = 0; k < genderArray.length; k++){
        if (tempArray.includes(genderArray[k])){
            nameArray.push(genderArray[k]);
        }
    }

    if (!nameArray || nameArray.length == 0){
        document.querySelector("#status").innerHTML = "No results found!";
        return; 
    }
    else {
        document.querySelector("#status").innerHTML = "Displaying results!";
    }
    //}

    console.log("nameArray: " + nameArray);

}

function displayResults(e){
    //this function will display the final results we get from the pokemon endpoint (will utilise the info at that endpoint to display image, stats, type, and whatnot)
    let xhr = e.target;

    let obj = JSON.parse(xhr.responseText);
    //name can be obj.species.name
    //get the obj.sprite.front_default image
    //obj.types.type.name is the type
    //obj.abilities.0.ability.name and obj.abilities.1.ability.name for the abilities
    let name = obj.species.name;
    let image = obj.sprites.front_default;
    let type = obj.types[0].type.name;
    let ability = [];
    //et ability1 = obj.abilities[0].ability.name;

    for (i = 0; i < obj.abilities.length; i++){
        ability.push(obj.abilities[i].ability.name);
        //there should only be two of these for each pokemon
    }

    //now we'll start bulding the result strings for each div inside of the results div
    let line = `<div class='result'><img src='${image}' title= '${name}'/>`;
    line += `<p>Name: ${name}</p>`;
    line += `<p>Type: ${type}</p>`;
    line += `<p>Abilities: ${ability[0]}, ${ability[1]}</p></div>`

    resultString += line;

    document.querySelector("#results").innerHTML = resultString;

}