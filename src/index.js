import React, {useContext, useEffect, useState} from "react";
import ReactDOM from "react-dom";
import { DatabaseProvider } from "./db";
import App from './App'
import _ from 'lodash'

import './index.css'
//
import { createContainer } from "unstated-next"
import {Context} from "./alasql/Store";
import alasqlAPI from "./alasql";


//todo: should probably break out play control here...

function useControl(initialState = 0) {
    let [id, _setId] = useState(null);
    let [play, _togglePlay] = useState(false);

    //testing: just ohio for now
    var states = {"OH":[
            {"displayName":"Columbus", "id":9480},
            {"displayName":"Cleveland", "id":14700},
            {"displayName":"Cincinnati", "id":22040},
            // {"displayName":"Dayton", "id":3673},
            {"displayName":"Toledo", "id":5649}
        ]};

    let [metro, _selectMetro] = useState([{"displayName":"Columbus", "id":9480}]);
    Date.prototype.addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    };

    // let [startDate, setStartDate] = useState(new Date());
    let [startDate, setStartDate] = useState(new Date());
    //testing:
    let [endDate, setEndDate] = useState(null);
    // let [endDate, setEndDate] = useState(new Date().addDays(30));

    let togglePlay = () => _togglePlay(!play)
    let setId = (id) => _setId(id);
    let selectMetro = (metroSel) => {
        //so this is new territory...
        //init thought was that someone is listening for this value to change and then sends new events req?
        //but is that like reacty? idk. for now just going to rely on the events list updating based on its
        //new value set by the req

        //this feels like a slightly different problem - I'm really forcing this 'component' here so I can use hooks,
        //when I really just want to call some javascript.
        if(_.find(metro, { 'id': metroSel.id })){
            console.log('remove', metroSel);
            _selectMetro(metro.filter((e) =>(e.id !==  metroSel.id)));
        }else{
            console.log('add',metroSel);
            _selectMetro([...metro,metroSel]);
        }

    }

    let [genreSens, setGenreSens] = useState('families');
    let [artistSens, setArtistSens] = useState('artists');

    return { play,id, togglePlay, setId,metro,selectMetro,startDate,endDate,setStartDate,setEndDate,genreSens, setGenreSens,artistSens, setArtistSens}
}

let Control  = createContainer(useControl);

function useHighlighter(initialState = 0) {
    //testing:
    let [hoverState, setHoverState] = useState([]);
    return { hoverState,setHoverState }
}
let Highlighter  = createContainer(useHighlighter);

function useStats(initialState = 0) {
    //note: stats is really tracking active tab...
    let [stats, setStats] = useState({name:"Home"});
    //the default true is context
    const [mode, setMode] = useState(true);
    return { stats,setStats,mode,setMode }
}
let StatControl  = createContainer(useStats);


const rootElement = document.getElementById("root");
ReactDOM.render(
    <DatabaseProvider>
        <Control.Provider>
            <Highlighter.Provider>
                <StatControl.Provider>
                    <App />
                </StatControl.Provider>
            </Highlighter.Provider>
        </Control.Provider>
    </DatabaseProvider>,
    rootElement
);

export{
    Control,Highlighter,StatControl
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

