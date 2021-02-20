import all_genres from "./alasql/all_genres";

let familyColors= {};

familyColors["pop"] = 'rgba(255,246,134,1)';
familyColors["pop2"] = 'rgba(255,246,134,.6)';

//EDM / DANCE
//#d52633
familyColors["electro house"] = 'rgb(213,38,51,1)';
familyColors["electro house2"] = 'rgb(213,38,51,.7)';

//ROCK
//#dcb250
familyColors["rock"] = 'rgba(220,178,80,1)';
familyColors["rock2"] = 'rgba(220,178,80,.7)';
//HARDCORE
familyColors["punk"] = 'rgba(220,178,80,1)';
familyColors["punk2"] = 'rgba(220,178,80,1)';
//GOLDEN AGE
familyColors["folk"] = 'rgba(220,178,80,1)';
familyColors["folk2"] = 'rgba(220,178,80,1)';

//#6c9
familyColors["r&b"] = 'rgba(102,204,153,1)';
familyColors["r&b2"] = 'rgba(102,204,153,.7)';
//#bdcc66
familyColors["country"] = 'rgba(189,204,102,1)';
familyColors["country2"] = 'rgba(189,204,102,.7)';
//#d8802f
familyColors["metal"] = 'rgba(216,128,47,1)';
familyColors["metal2"] = 'rgba(216,128,47,.7)';

//BLUE NOTE
//#4364b3
familyColors["blues"] = 'rgba(67,100,179,1)';
familyColors["blues2"] = 'rgba(67,100,179,.7)';
familyColors["jazz"] = 'rgba(67,100,179,1)';
familyColors["jazz2"] = 'rgba(67,100,179,.7)';

//#8e3761
familyColors["hip hop"] = 'rgb(142,55,97,1)';
familyColors["hip hop2"] = 'rgb(142,55,97,.7)';

//#6e48af
familyColors["reggae"] = 'rgb(110,72,175,1)'
familyColors["reggae2"] = 'rgb(110,72,175,.7)';

familyColors["latin"] = '#008000';
familyColors["latin2"] = '#008000';
familyColors["world"] = '#ffc0cb';
familyColors["world2"] = '#ffc0cb';
familyColors["classical"] = '#808080';
familyColors["classical2"] = '#808080';
familyColors["unknown"] =  '#00000036';
familyColors["unknown2"] =  '#00000036';

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

// var familyStyles = {
// 	root: {
// 		// background: 'black',
// 		// borderRadius: "16px",
// 		// margin:"2px",
// 		backgroundColor:'grey'
// 	},
// 	hipHop: {
// 		backgroundColor: familyColors['hip hop']
// 	},
// 	hipHop2: {
// 		backgroundColor: familyColors['hip hop2'],
// 		borderColor:'black'
// 	},
// 	country: {
// 		backgroundColor: familyColors['country'],
// 		borderColor:'black'
// 	},
// 	country2: {
// 		backgroundColor: familyColors['country2']
// 	},
// 	electroHouse: {
// 		backgroundColor: familyColors['electro house'],
// 		borderColor:'black'
// 	},
// 	electroHouse2: {
// 		backgroundColor: familyColors['electro house2']
// 	},
// 	rhythmBlues: {
// 		backgroundColor: familyColors["r&b"],
// 		borderColor:'black'
// 	},
// 	rhythmBlues2: {
// 		backgroundColor: familyColors["r&b2"]
// 	},
// 	pop: {
// 		backgroundColor: familyColors['pop'],
// 		color:'white',
// 		borderColor:'black'
// 	},
// 	pop2: {
// 		backgroundColor: familyColors['pop2'],
// 	},
// 	rock: {
// 		backgroundColor: familyColors['rock'],
// 		borderColor:'black'
// 	},
// 	rock2: {
// 		backgroundColor: familyColors['rock2']
// 	},
// 	latin: {
// 		backgroundColor: familyColors["latin"],
// 		borderColor:'black'
// 	},
// 	latin2: {
// 		backgroundColor: familyColors["latin2"]
// 	},
// 	folk: {
// 		backgroundColor: familyColors["folk"]
// 	},
// 	folk2: {
// 		backgroundColor: familyColors["folk2"]
// 	},
// 	metal: {
// 		backgroundColor: familyColors["metal"]
// 	},
// 	metal2: {
// 		backgroundColor: familyColors["metal2"]
// 	},
// 	blues: {
// 		backgroundColor: familyColors["blues"]
// 	},
// 	blues2: {
// 		backgroundColor: familyColors["blues2"]
// 	},
// 	reggae: {
// 		backgroundColor: familyColors["reggae"]
// 	},
// 	reggae2: {
// 		backgroundColor: familyColors["reggae2"]
// 	},
// 	world: {
// 		backgroundColor: familyColors["world"]
// 	},
// 	world2: {
// 		backgroundColor: familyColors["world2"]
// 	},
// 	jazz: {
// 		backgroundColor: familyColors["jazz"]
// 	},
// 	2: {
// 		backgroundColor: familyColors["jazz2"]
// 	},
// 	punk: {
// 		backgroundColor: familyColors["punk"]
// 	},
// 	punk2: {
// 		backgroundColor: familyColors["punk2"]
// 	},
// 	classical: {
// 		backgroundColor: familyColors["classical"]
// 	},
// 	classical2: {
// 		backgroundColor: familyColors["classical2"]
// 	},
// 	unknown:{
// 		backgroundColor: familyColors["unknown"]
// 	},
// 	unknown2:{
// 		backgroundColor: familyColors["unknown2"]
// 	}
// };


var familyStyles = {
	root: {
		// background: 'black',
		// borderRadius: "16px",
		// margin:"2px",
		backgroundColor: 'grey'
	}
};

Object.keys(familyColors).forEach((k,i,arr) =>{
	// console.log(k[k.length-1]);

		if(k[k.length-1] === '2'){
			familyStyles[k] = {
				//color of chip
				backgroundColor:familyColors[k],
				//border if variant = outlined
				borderColor:'black'}
		}else{
			familyStyles[k] = {
				//color of chip
				backgroundColor:familyColors[k],
				//border if variant = outlined
				borderColor:'black',
				//text color on chip
				color:'white',}

		}

});


// console.log("$familyStyles",familyStyles);
// console.log("$familyGenre_map",familyGenre_map);
// console.log("$genreFam_map",genreFam_map);
//------------------------------------------

export {
	families,familyColors,familyGenre_map,genreFam_map, familyStyles,familyNormal
}
