import {ApolloClient, gql, InMemoryCache,createHttpLink, makeVar} from "@apollo/client";
import {ApolloProvider} from "@apollo/react-hooks";
import React from "react";
//import fetch from 'isomorphic-fetch'
//import { persistCache } from 'apollo-cache-persist';
import { persistCache } from "apollo3-cache-persist";
import localforage from 'localforage'


//todo: to see where I made changes for apollo testin see: //testing: apollo reactive
//reducer,sidebar,tabify,

// export const cartItemsVar = makeVar([]);
//export const cartItemsVar = makeVar([1]);
let initialState = {
	posts: [],
	artists:[],
	events:[],
	artistSearchSelection:[],
	// node:[{id:1,name:"agg",data:[]}],
	node:[],
	//testing:
	dacandyman01_artists:[],
	dacandyman01_playlists:[],
	error: null
};
//-----------------------------------------------------
//node init

var idmap = {
	agg:0,
	saved:1,
	top:2,
	artistSearch:3,
	playlists:4,
}

//let nodes = [];
var sources = ['top','saved','agg','playlists']
var sources_subset = ['top','saved','playlists']

sources.forEach(s =>{
	initialState.node.push({id:idmap[s],name:s,data:[]})
})

//testing: who are guests?
var guest = {id:123028477,name:"Dan"};
//testing:'main' user
var mainUser = {id:'dacandyman01',name:"Franky"};
//testing:
sources_subset.forEach(s =>{
	//todo: add new id
	initialState.node.push({id:idmap[s] + 99,name:guest.id + "_" + s,data:[]})
})

//-----------------------------------------------------

export const GLOBAL_STATE_VAR = makeVar(initialState);
export const GLOBAL_UI_VAR = makeVar({access_token:false});
// export const GLOBAL_STATE_VAR = makeVar({node:[{id:1,name:"agg",data:[]}]});

export const config = {};


const cacheTest = new InMemoryCache({});

//note: Gatsby issue - need to explicitly define your fetch mechanism
//also might pop up while using apollo-boost so keep an eye out on those imports
//https://stackoverflow.com/questions/64362315/gatsby-webpackerror-invariant-violation-error-with-apolloclient

let apolloClient = {};
let store = {};

async function asyncCall() {

  await localforage.ready().then(() => {
    //store = localforage.createInstance();
    //

    // console.log("clearing apollo cache");
    // localforage.clear();
    localforage.setItem("keyTest", "valueTest");
    // store.setItem("key");

    // localforage.setItem('key', 'value').then(function () {
    //   return localforage.getItem('key');
    // }).then(function (value) {
    //   // we got our value
    // }).catch(function (err) {
    //   // we got an error
    // });

    persistCache({
		cacheTest,
      storage:localforage,
    }).then(() => {
      apolloClient = new ApolloClient({
       // link,
        //uri: 'http://localhost:4000/graphql',
        //uri: "https://graphqlzero.almansi.me/api",
        cache:cacheTest,

        //typeDefs,
      })
    })
  }).catch(() => {
    // ...
  });

  // console.log("store",store);
  // await persistCache({
  //   cache,
  //   storage:store,
  // })
  // apolloClient = new ApolloClient({
  //   link,
  //   uri: 'http://localhost:4000/graphql',
  //   //uri: "https://graphqlzero.almansi.me/api",
  //   cache:cache,
  //   typeDefs,
  // })
}
asyncCall();


// .then(() => {
//   // Continue setting up Apollo as usual.
//   apolloClient = new ApolloClient({
//     link,
//     uri: 'http://localhost:4000/graphql',
//     //uri: "https://graphqlzero.almansi.me/api",
//     cache:cache,
//     typeDefs,
//   })
// })

export {apolloClient,localforage};
const withApolloProvider = (WrappedComponent) => {

	return (props) => (
		<ApolloProvider client={apolloClient}>
			<WrappedComponent {...props} wrappedBy={"withApolloProvider"} />
		</ApolloProvider>
	)
}

export default withApolloProvider
