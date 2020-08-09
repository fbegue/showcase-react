//these are tables that hold shared information
var tables = {};
tables["playlists"] = [];
tables["artists"] = [];
tables["events"] = [];
tables["artistSearchSelection"] = [];


//the users tables are about the selections users make
//users has many types (contexts) of objects, but every user only has one of each 'context'
tables["users"] = {};

//todo: cheat init user
tables["users"]["dacandyman01"] = {
	artists: [],
	//artists from albums
	albums:  [],
	node:[]
}

export default tables;