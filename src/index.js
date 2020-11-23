import React, {useContext, useEffect, useState} from "react";
import ReactDOM from "react-dom";
import { DatabaseProvider } from "./db";
import App from './App'

import './index.css'
//
import { createContainer } from "unstated-next"
import {Context} from "./alasql/Store";
import alasqlAPI from "./alasql";


function useControl(initialState = 0) {
    let [id, _setId] = useState(null);
    let [play, _togglePlay] = useState(false);
    //not sure why the examples have this pattern
    //seeeems fine just to just export them here?
    //maybe he was demo'ing side-effects?
    // let [metro, selectMetro] = useState(null);
    let [metro, _selectMetro] = useState(9480);

    let togglePlay = () => _togglePlay(!play)
    let setId = (id) => _setId(id);
    let selectMetro = (id) => {
        //so this is new territory...
        //init thought was that someone is listening for this value to change and then sends new events req?
        //but is that like reacty? idk. for now just going to rely on the events list updating based on its
        //new value set by the req

        //this feels like a slightly different problem - I'm really forcing this 'component' here so I can use hooks,
        //when I really just want to call some javascript.

        //maybe I'm confused bc Tabify shouldn't be working? idk something just feels weird

        //see: TestComp in App.js
        _selectMetro(id);
    }

    return { play,id, togglePlay, setId,metro,selectMetro }
}

let Control  = createContainer(useControl);

const rootElement = document.getElementById("root");
ReactDOM.render(
    <DatabaseProvider>
        <Control.Provider>
            <App />
        </Control.Provider>
    </DatabaseProvider>,
    rootElement
);

export{
    Control
}

//=====================================================
//testing: integration with watermelondb
//import { Database } from '@nozbe/watermelondb'
//import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

//import schema from './model/schema'
// import Post from './model/Post' // ⬅️ You'll import your Models here

// First, create the adapter to the underlying database:

// const adapter = new SQLiteAdapter({
//     schema,
// })

//for web:
//import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs'

// const adapter = new LokiJSAdapter({
//     schema,
//     // These two options are recommended for new projects:
//     useWebWorker: false,
//     useIncrementalIndexedDB: true,
//     //todo:
//     // It's recommended you implement this method:
//     // onIndexedDBVersionChange: () => {
//     //   // database was deleted in another browser tab (user logged out), so we must make sure we delete
//     //   // it in this tab as well
//     //   if (checkIfUserIsLoggedIn()) {
//     //     window.location.reload()
//     //   }
//     // },
// })
//
// // Then, make a Watermelon database from it!
// const database = new Database({
//     adapter,
//     modelClasses: [
//         // Post, // ⬅️ You'll add Models to Watermelon here
//     ],
//     actionsEnabled: true,
// })
//
// //watermelon
// const postsCollection = database.collections.get('posts')
// console.log("$postsCollection",postsCollection);

//=====================================================

