import all_genres from "./alasql/all_genres";

let familyColors= {};


// familyColors["pop"] = '#386ffd';
familyColors["pop"] = 'rgba(56, 111, 253, 1)';
familyColors["pop2"] = 'rgba(56, 111, 253,.2)';

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
// familyColors["unknown"] =  'rgba(0,0,0,.14)';
familyColors["unknown"] =  '#00000036';
var families =  ["pop", "electro house", "rock", "hip hop", "r&b", "latin", "folk", "country", "metal", "punk", "blues", "reggae", "world", "jazz", "classical"];

var familyGenre_map = {};
var genreFam_map= {};
//note: to avoid doing replaces on my all_genres source, just going to define a map and use it here
//todo: but I guess that really isn't the issue tho is it? I need these families to be proper objects w/ ids I can register on
//so plan on genres coming in as normal, but when we resolve them on the familyGenre map the normalized ones
var familyNormal = {};
familyNormal["hip hop"] = "hipHop";
familyNormal["electro house"] = "electroHouse";
familyNormal["r&b"] = "rhythmBlues";

all_genres.forEach(function(t){
	t.family.forEach(function(f){
		if(!(familyGenre_map[f])){
			familyGenre_map[f] = [];
		}
		familyGenre_map[f].push(t.name)
	});
	genreFam_map[t.name] = t.family

});

var familyStyles = {
	root: {
		// background: 'black',
		// borderRadius: "16px",
		// margin:"2px",
		backgroundColor:'grey'
	},
	hipHop: {
		backgroundColor: familyColors['hip hop']
	},
	electroHouse: {
		backgroundColor: familyColors['electro house']
	},
	rhythmBlues: {
		backgroundColor: familyColors["r&b"]
	},
	pop: {
		backgroundColor: familyColors['pop'],
		color:'white'
	},
	pop2: {
		backgroundColor: familyColors['pop2'],
	},
	rock: {
		backgroundColor: familyColors['rock']
	},
	latin: {
		backgroundColor: familyColors["latin"]
	},
	folk: {
		backgroundColor: familyColors["folk"]
	},
	metal: {
		backgroundColor: familyColors["metal"]
	},
	blues: {
		backgroundColor: familyColors["blues"]
	},
	reggae: {
		backgroundColor: familyColors["reggae"]
	},
	world: {
		backgroundColor: familyColors["world"]
	},
	jazz: {
		backgroundColor: familyColors["jazz"]
	},
	punk: {
		backgroundColor: familyColors["punk"]
	},
	classical: {
		backgroundColor: familyColors["classical"]
	},
	unknown:{
		backgroundColor: familyColors["unknown"]
	}
};


console.log("$familyGenre_map",familyGenre_map);
console.log("$genreFam_map",genreFam_map);
//------------------------------------------

export {
	families,familyColors,familyGenre_map,genreFam_map, familyStyles,familyNormal
}
