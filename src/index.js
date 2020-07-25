import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { DatabaseProvider } from "./db";
import App from './App'
import './index.css'

const rootElement = document.getElementById("root");
ReactDOM.render(
    <DatabaseProvider>
        <App />
    </DatabaseProvider>,
    rootElement
);

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

