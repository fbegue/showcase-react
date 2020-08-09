


// var user_f = [ {id:1, context: "myLibArtists",artists:[1,3]}];
// var user_j = [ {id: 2, context: "myLibArtists",artists:[1,2,3]}];

//these are tables that hold the users SELECTIONS


//wanted to get the intersetion between two fields of arrays
//could figure out out to do want I want with one array, not two tho

//example of one array join on single value

// var f = [ {id:1, context: "myLibTracks",artists:1}];
// var j = [ {id: 2, context: "myLibTracks",artists:[1,2,3]}];
// var res2 = alasql('SELECT * from ? f join ? j on f.artists in j.artists',[f,j]);
// console.log("res2",res2);

//todo:
// var fart = alasql('SELECT artists from ? f where context = "myLibTracks"',[user_f]);
// var jart = alasql('SELECT artists from ? j where context = "myLibTracks"',[user_j]);
// console.log("fart",fart);
// console.log("jart",jart);
// var int = _.intersection(fart[0].artists,jart[0].artists)
// console.log('int',int)

//don't know how to join on two arrays when one of them is just numbers
//so put them into object notation

//todo:
// var intr = [];
// int.forEach(i =>{intr.push({id:i})})
// var recs = alasql('SELECT * from ? art_gen join ? intr on art_gen.id = intr.id',[art_gen,intr]);
// var genres = [];
// recs.forEach(r =>genres = genres.concat(r.genres))
// console.log('genres',genres);

//playlists are harder b/c their very nested?
//maybe I just do playlist stuff by hand always

//for every playlist object selected, pull out

var f = [ {id:3, context: "myLibPlayist",artists:[1,3]}];
var j = [ {id: 4, context: "myLibPlayist",artists:[1,2,2,3]}];