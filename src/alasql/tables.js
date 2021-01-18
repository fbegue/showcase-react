//these are tables that hold shared information
var tables = {};
tables["playlists"] = [];
tables["artists"] = [];
tables["events"] = [];
tables["tracks"] = [];
// tables["artistSearchSelection"] = [];


//the users tables are about the selections users make
//users has many types (contexts) of objects, but every user only has one of each 'context'
tables["users"] = {};

//todo: cheat init user
tables["users"]["dacandyman01"] = {
	artists: [],
	//artists from albums
	albums:  [],
	tracks:[],
	node:[]
}

//testing: a user which is just the system that holds all non-user sourced selections?
//these will be specifically named collections which we need to maintain (not just filter on b/c they are tables)
//sort of the difference between 'selecting from MY data' (above) and 'selecting from some data' (below)

//so revisisting this - seems like a good idea ...
tables["users"]["selection"] = {
	artistSearch:[]
}

export default tables;