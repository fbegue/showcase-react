import all_genres from "./alasql/all_genres";

let familyColors= {};
familyColors["pop"] = '#386ffd';
familyColors["electro house"] = 'rgb(214, 196, 36)';
familyColors["rock"] = 'orange';
familyColors["hip hop"] = 'lightblue';
familyColors["r&b"] = '#10a010';
familyColors["latin"] = 'lightgreen';
familyColors["folk"] = '#C5B0D5';
familyColors["country"] = '#D62728';
familyColors["metal"] = '#FF9896';
familyColors["punk"] = '#9467BD';
familyColors["blues"] = '#8C564B';
familyColors["reggae"] = 'tan';
familyColors["world"] = 'pink';
familyColors["jazz"] = '#a87373';
familyColors["classical"] = 'grey';
var families =  ["pop", "electro house", "rock", "hip hop", "r&b", "latin", "folk", "country", "metal", "punk", "blues", "reggae", "world", "jazz", "classical"];

var familyGenre_map = {};
var genreFam_map= {};
//note: to avoid doing replaces on my all_genres source, just going to define a map and use it here
//todo: but I guess that really isn't the issue tho is it? I need these families to be proper objects w/ ids I can register on
var familyNormal = {};
familyNormal["hip hop"] = "hipHop"
//and so on..

all_genres.forEach(function(t){
	t.family.forEach(function(f){
		if(!(familyGenre_map[f])){
			familyGenre_map[f] = [];
		}
		familyGenre_map[f].push(t.name)
	});
	genreFam_map[t.name] = t.family

});
// console.log("familyGenre_map",familyGenre_map);
// console.log("genreFam_map",genreFam_map);
//------------------------------------------

export {
	families,familyColors,familyGenre_map,genreFam_map
}
