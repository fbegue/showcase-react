import * as alasql from 'alasql';
import _ from "lodash";
import tables from './tables'
import alasqlAPI from "./index";

//the user has made these artist selections in the tabs
//noder will provide us a union on these to sets


// var user = {
// 	// artists: [{id:1},{id:3}],
// 	// //artists from albums
// 	// albums:  [{id:1},{id:2}],
// 	artists: [],
// 	//artists from albums
// 	albums:  [],
// 	node:[]
// }

var art_gen = [{id:1,genres:[{id:1,name:'pop'}]},{id:2,genres:[{id:3,name:'rock'}]},{id:3,genres:[{id:2,name:'rap'}]}];

//testing:
//bj
art_gen.push({id:"07d5etnpjriczFBB8pxmRe",genres:[{id:1,name:'pop'},{id: 5, name: "indie pop"}]});



//we have 3 events:
//popArtist will be filtered in once we add {id:1} from artists
//we'll see rockArtist once we add {id:2} from albums
//we never see country b/c none of our input to noder has a country genre

var eventsCollection = [{artist_id:1,name:"popArtist",genres:[{id:1,name:'pop'}]}
	,{artist_id:2,name:"countryArtist",genres:[{id:4,name:'country'}]}
	,{artist_id:3,name:"rockArtist",genres:[{id:3,name:'rock'}]}
]


//todo: this is called twice in succession
// because getJoin action on node and events call it

//produce an array which is the combination of all selected table values across all contexts
function noder(action){
	//todo: am I messing this up somehow?
	// console.log("$context", tables["users"][action.user]);
	console.log("$context", tables["users"]["dacandyman01"]["artists"]);

	var art = tables["users"]["dacandyman01"]["artists"].filter(r =>{
	// var art = tables["users"][action.user]["artists"].filter(r =>{
		return r.tableData.selected = true;
	})

	//todo: skipping for now
	//var alb = tables["users"][action.user]["albums"]
	var alb  = [];

	console.log("a",art);
	console.log("b",alb);

	//todo: not sure what I'm doing wrong here
	//instead split into two steps
	// r = alasql('SELECT id from ? a union select id from ? b join ? art_gen on art_gen.id = b.id',[art,alb, art_gen]);
	var r1 = alasql('SELECT id from ? a union select id from ? b',[art,alb]);
	console.log("r1",r1);
	//todo: thought outer join would make empty genres rows
	//- something else I'm thinking of or no?
	var r2 = alasql('SELECT * from ? a join ? art_gen on art_gen.id = a.id',[r1,art_gen]);
	r2.forEach(r =>{if(!(r.genres)){r.genres = []}})
	console.log("r2",r2);

	console.log(action.type,r2);
	return r2;
}

function getJoin(action){
	var r = {};
	switch (action.type) {
		case 'artists':
			console.log([tables[action.user][action.type]]);
			r = alasql('SELECT * from ? t join ? art_gen on art_gen.id = t.id', [tables[action.user][action.type], art_gen]);
			console.log(action.type,r);
			return r;
		case 'albums':
			r = alasql('SELECT * from ? t join ? art_gen on art_gen.id = t.id', [tables[action.user][action.type], art_gen]);
			console.log(action.type,r);
			return r;
		case 'node':
			return noder(action)
		case 'events':
			var n = noder(action)
			console.log("$noder",n);

			//todo: sqly stuff
			//----------------------------
			var genres = [];
			n.forEach(r =>{
				r.genres.forEach(g =>{
					genres.push(g)
				})
			})
			var jstr = function(ob){
				return JSON.parse(JSON.stringify(ob))
			};
			console.log("$genres",genres);
			//todo: yeah don't do this
			//besides sql stuff, we need to figure out how to preserve these references

			var events = JSON.parse(JSON.stringify(tables['events']))
			console.log("$events",jstr(events));
			//look at every genre of every event
			//if it has at least one genre that's in our list, keep it

			//with eventsCollection

			// events = events.filter(e =>{
			// 	for(var x = 0; x < e.genres.length;x++){
			// 		for(var y = 0; y < genres.length;y++){
			// 			if(genres[y].id === e.genres[x].id){
			// 				return true
			// 			}
			// 		}
			// 	}
			// 	return false;
			// })


			events = events.filter(e =>{
				// e.performance.forEach(p =>{
				var some = false;
				for(var x = 0; x < e.performance.length;x++){
					var p =  e.performance[x]
					p.id === 74713137 ? console.log("$",p):{};
					some = p.artist.genres.some(g =>{
						for(var y = 0; y < genres.length;y++){
							if(g.id === genres[y].id){
								return true;
							}
						}
						return false
					})
					p.id === 74713137 ? console.log("#$",some):{};
					//if some is true, than stop looking thru the other performances
					if(some){
						console.log("#$",some)
						break;
					}
				}
				return some;
			})
			//----------------------------

			console.log("$$events",jstr(events));

			return events;
		default:
			console.log("DEFAULT");
			r = {};
			return r;
	}
};

//state object
var stateOb = {
	artists:"depending on what you click, this global artist store is updated",
	myArtists:"user selections of artists",
	node: "this is watching all of the user selections and making inferences based on that"
}
const Reducer = (state, action) => {
	switch (action.type) {
		case 'init':
			console.log('action', action);
			if(action.context === 'events') {
				//register globally

				//todo: childKey nonsense

				action.payload.forEach(function(e){
					e.childrenKey = "performance"
					//testing:
					if(e.id === 39495498 ){
						e.performance[0].artist.genres = [{id:1,name:"rock"}]
					}
					// e.performance.forEach(p =>{
					// 	p.childrenKey = "genres"
					// })
				});
				tables[action.context] = tables[action.context].concat(action.payload);
				return {
					...state,
					events: tables[action.context]
				};
			}
			else if(action.context === 'artists'){

				//register with global artists
				tables[action.context] = tables[action.context].concat(action.payload);

				//register for user
				//todo: set up id only relations for user
				//just the whole thing for now
				//var ids = _.map(artists, function(a){return a.id;});
				tables["users"][action.user][action.context] = action.payload;


				var key = action.user + '_' + action.context;
				console.log("stated",key);
				return {
					...state,
					[key]: tables["users"][action.user][action.context]
					//node:  getJoin({type:"node"}),
				};
			}
			//testing: albums
			else{
				return {
					...state,
					albums: tables["users"][action.user][action.context]
					//node:  getJoin({type:"node"}),
				};
			}
		case 'artists':
			//init
			console.log('action.user context add:',action);
			tables[action.user][action.type].push(action.payload);
			return {
				...state,
				//todo: need to understand implications of this state return
				//all I understand right now is that if I want a scope update, someone
				//needs to return that var in a reducer action
				//so basically right now: if your mutating something that results in a recalc of node,
				//you need to go calculate and return the new value here
				artists:  getJoin(action),
				node:  getJoin({type:"node"}),
				events:getJoin({type:"events"})

			};
		case 'albums':
			tables[action.user][action.type].push(action.payload)
			return {
				...state,
				// posts: state.posts.concat(action.payload)
				albums: getJoin(action),
				node:  getJoin({type:"node"}),
				events:getJoin({type:"events"})
			};
		case 'select':
			if(action.context === 'artists'){

				//make the table record selected
				//efficiency
				//confusing here with action.context instead of type like above?
				// tables["users"][action.user][action.context].forEach(r =>{
				// 	if(r.id === action.payload.id){
				// 		//r.selected = true;
				// 	}
				// })

				//if the record is selected, it'll have record.tableData.checked = true;


				return {
					...state,
					//don't need to update the data itself b/c we handle that in table?
					//we do need to update events tho
					events: getJoin({type:"events"})
					//node:  getJoin({type:"node"}),
				};
			}

			return {
				...state,
				// posts: state.posts.concat(action.payload)
				artists: getJoin(action)
			};
		case 'REMOVE_POST':
			return {
				...state,
				posts: state.posts.filter(post => post.id !== action.payload)
			};
		case 'GET_POSTS':
			return {
				...state,
				posts: getJoin(action)
			};
		default:
			console.error("default reducer used by accident!");
			return state;
	}
};

export default Reducer;