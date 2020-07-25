import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Sidebar from './Sidebar';
import FilterBar from './FilterBar';
import NestedList from './NestedList';
import MapArea from './MapArea';
import './App.css'

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';



//import $ from "jquery"
//import {$} from './libraries/jquery.min'
//import useScript from './useScript';
//import Script from 'react-load-script'

import { Helmet } from "react-helmet";

import TodoDetail from './TodoDetail';
import brace from 'brace';
import AceEditor from 'react-ace';
import ContainerDimensions from 'react-container-dimensions';
//import useAsync from './useAsync';
import { useDB, useNormalizedApi } from './db'

import {getUserPlaylists } from './testdata/getUserPlaylists.js'

import 'brace/mode/json';
import 'brace/theme/monokai';
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import InboxIcon from "@material-ui/core/SvgIcon/SvgIcon";
import ListItemText from "@material-ui/core/ListItemText";

//import NestedListRecurse  from "./NestedList2"
// var NestedListRecurse = require("./NestedList2").default

//import TreeView  from "./NestedList3"
import EventsList from './EventsList'
import { BrowserRouter } from 'react-router-dom'
import SimpleTabs from "./SimpleTabs";

const drawerWidth = 360;

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    appBar: {

    },
    toolbar: theme.mixins.toolbar,
    contentAndToolbar: {
        flex: 3,
        minWidth: 320,
        boxSizing: 'border-box'
    },
    content: {
        padding: theme.spacing.unit * 3,
        height: 'calc(100vh - 64px)',
        boxSizing: 'border-box',
    },
    storeInspectors: {
        height: '70%',
        display: 'flex',
        justifyContent: 'space-between',
        overflowX: 'auto'
    },
    storeInspector: {
        flex: 1,
        margin: 8,
        boxSizing: 'border-box'
    },
    storeInspectorHeader: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#252620',
        color: 'rgba(255, 255, 255, .8)',
        height: 48
    },
    todoDetail: {
        height: 170
    }
});

const filterQueries = {
    'active': 'ACTIVE_TODOS',
    'all': 'ALL_TODOS',
    'completed': 'COMPLETED_TODOS'
}

// https://github.com/ArnonEilat/countries/tree/master/static/jqvmap
var initMap = function(){
    console.log("initMap");
    // console.log(window.jQuery);
    // console.log(window.JQVMap);

    var $ = window.jQuery;
    console.log($('#vmap'));
    $.JQVMap = window.JQVMap;
    $('#vmap').vectorMap({
        map: 'usa_en',
        backgroundColor: null,
        borderColor: 'black',
        color: 'lightgrey',
        selectedColor:  'darkgrey',
        hoverColor: 'darkgrey',
        enableZoom: false,
        showTooltip: false,
        multiSelectRegion:true,
        colors: {
            oh: 'lightblue',
            ut: 'lightblue',
            ca: 'lightblue'
        },
        onRegionClick: function(event, code, region){
            //the event comes from vmap silly :)
            //event.preventDefault();

            console.log("hey!",code + "|" + region);
        },
        onRegionSelect: function(event, code, region){
            console.log("onRegionSelect!",code);
            // $scope.vmapSelection.push(code)
            // console.log($scope.vmapSelection);
            // $scope.digestIt();
        },
        onRegionDeselect: function(event, code, region){
            console.log("onRegionDeselect!",code );
            // let i = $scope.vmapSelection.indexOf(code)
            // $scope.vmapSelection.splice(i,1);
            // console.log($scope.vmapSelection);
            // $scope.digestIt();
        }
        // showLabels:true,
        // hoverColor: 'lightgrey',
        // multiSelectRegion:true,
        // selectedRegions: ['CA','NY'],
    });
}

//todo: wait for external scripts w/ async
//being loaded by index.html <scripts>
//pretty sure this is good only b/c setTimeout won't execute until the page is loaded?

//tried to use effect in a custom hook (useScript.js) but couldn't ever get the order right
//only runs once w/ no dependencies
// https://css-tricks.com/run-useeffect-only-once/

// var urls = ['https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js',
//     'https://cdnjs.cloudflare.com/ajax/libs/jqvmap/1.5.1/jquery.vmap.min.js',
//     'https://cdnjs.cloudflare.com/ajax/libs/jqvmap/1.5.1/maps/jquery.vmap.usa.js']
// useScript(urls,callback)
// useScript('https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js',callback);

//tried helmet as well, same deal
// https://codesandbox.io/s/l9qmrwxqzq?file=/src/index.js:61-99


setTimeout(e =>{  initMap();},2000);

function App(props) {

    const { classes } = props;
    let [filter, setFilter] = useState('active');
    let [selectedTodoId, setSelectedTodoId] = useState();

    let normalizedApi = useNormalizedApi()
    let db = useDB();

    // let [fetchTodosRequest, fetchTodos] = useAsync(normalizedApi.fetchTodos)
    // //let [fetchTodosRequest, fetchTodos] = useAsync(normalizedApi.fetchTodos)
    //
    // useEffect(() => {
    //     fetchTodos(filter)
    // }, [filter])
    //
    // let todos = db.executeStoredQuery(filterQueries[filter]);

    let pqry = db.getStoredQuery('ALL_PLAYLISTS');
    let playlists = db.executeQuery(pqry);
    let pqry2 = db.getStoredQuery('ALL_ARTISTS');
    let artists = db.executeQuery(pqry2);
    let pqry3 = db.getStoredQuery('ALL_GENRES');
    let genres = db.executeQuery(pqry3);
    let pqry4 = db.getStoredQuery('ALL_EVENTS');
    let events = db.executeQuery(pqry4);

    //todo: sets up nested list
    events.forEach(function(e){
        e.childrenKey = "performance"
        // e.performance.forEach(p =>{
        //   p.childrenKey = "genres"
        // })
    });


    //todo: a) this is ugly as shit but I wonder if I really need anything more complicated?
    //b) I had to add songkick_ids to getArtistGenres, but I guess we should be expecting those
    //back anyways?

    //filter events based on selected genres
    //events have an array of performances, each performance has a single artist
    //object with an id. we need to only keep events for which at least one performance's
    //artist has a genre that is selected.

    //the db's artists have an array of genre_ids. so determine acceptable artists
    //ids by filtering them based on the selected genres. then filter events
    //based on whether they have one of those artists in a performance

    if(genres.length){
        //selected genres's ids
        var selected = genres.filter(g =>{return g.selected});
        var ids = selected.map(g => g.id);

        //artists who have one of the selected genres
        var eartists = artists.filter(a => {
            var ret = false;
            for (var x = 0; x < a.genres.length; x++) {
                if (ids.indexOf(a.genres[x]) !== -1) {  ret = true;break;}
            }
            return ret
        });

        var eids = eartists.map(g => g.id_songkick);

        events = events.filter(e => {
            var ret = false;
            for(var x = 0; x < e.performance.length; x++){
                var id = e.performance[x].artist.id;
                if(eids.indexOf(id) !== -1){ret = true;break;}
            }
            return ret;
        });

        console.log("updated events",events);
    }

    console.log("events",events);

    //testing: example metro catalog
    var states = {"OH":[
    {"displayName":"Columbus", "id":9480},
    {"displayName":"Cleveland", "id":14700},
    {"displayName":"Cincinnati", "id":22040},
    {"displayName":"Dayton", "id":3673}]}

    //{"displayName": "Salt Lake City", "id":13560}
    //{"displayName":"SF Bay Area", "id":26330}

   // let todoIds = JSON.stringify(todos.map(t => t.id));

    // useEffect(() => {
    //     setSelectedTodoId(todos[0] && todos[0].id)
    // }, [todoIds])

    return (
        <div>

            <MapArea states={states}/>
        <div className={classes.root} style={{display:"flex",flexDirection:"row"}}>

            <div>
                <Sidebar
                    playlists={playlists}
                    // fetchTodosRequest={fetchTodosRequest}
                    filter={filter}
                    onFilterChange={setFilter}
                    selectedTodo={selectedTodoId}
                    onSelectedTodoChange={setSelectedTodoId}
                />
            </div>
            <div>
                <SimpleTabs></SimpleTabs>
            </div>

            <div>
                <NestedList
                    artists={artists}
                    genres={genres}
                />
            </div>
            <div>
                <EventsList data={events} />
            </div>

            {/*todo: list of nested lists?*/}
            {/*yeah no this isn't working very well - could be for an easy reason but idk */}
            {/*like i can in no way actually click on anything in here*/}
            {/*just seems like its not going to be THAT easy :)*/}
            {/*google: list of nestedList material ui*/}
            {/*https://stackoverflow.com/questions/48607844/multilevel-nested-list-in-material-ui-next*/}
            <div>
                {/*==============default=============================*/}
                {/*<List>*/}
                {/*  {events.map((event, index) => (*/}
                {/*      <ListItem*/}
                {/*          button*/}
                {/*          key={event.id}*/}
                {/*          onClick={(e) => props.onSelectedTodoChange(event.id)}*/}
                {/*      >*/}
                {/*        <Typography*/}
                {/*            variant="subtitle1"*/}
                {/*            color={props.selectedTodo === event.id ? 'secondary' : 'textPrimary'}*/}
                {/*        >*/}
                {/*          {event.displayName} - <span style={{fontSize:"10px"}}>{event.start.date}</span>*/}
                {/*        </Typography>*/}
                {/*      </ListItem>*/}
                {/*  ))}*/}
                {/*</List>*/}
                {/*==============default=============================*/}

            </div>

            <div className={classes.contentAndToolbar}>
                {/*<AppBar position="relative" className={classes.appBar}>*/}
                {/*  <Toolbar>*/}
                {/*    <Typography variant="h6" color="inherit" noWrap>*/}
                {/*      Todo App*/}
                {/*    </Typography>*/}
                {/*  </Toolbar>*/}
                {/*</AppBar>*/}
                {/*<div className={classes.content}>*/}
                {/*  <div className={classes.todoDetail}>*/}
                {/*    <TodoDetail id={selectedTodoId}/>*/}
                {/*  </div>*/}
                {/*  <div className={classes.storeInspectors}>*/}
                {/*    <div className={classes.storeInspector}>*/}
                {/*    <ContainerDimensions>*/}
                {/*        { ({ height, width }) => (*/}
                {/*            <React.Fragment>*/}
                {/*              <div className={classes.storeInspectorHeader}>*/}
                {/*                Entity Store*/}
                {/*              </div>*/}
                {/*              <AceEditor*/}
                {/*                value={JSON.stringify(db.entities, 2, 2)}*/}
                {/*                mode="json"*/}
                {/*                theme="monokai"*/}
                {/*                width={width}*/}
                {/*                height={320}*/}
                {/*                readOnly*/}
                {/*                name="entities-json"*/}
                {/*                editorProps={{$blockScrolling: true}}*/}
                {/*              />*/}
                {/*            </React.Fragment>*/}
                {/*        ) }*/}
                {/*    </ContainerDimensions>*/}
                {/*    </div>*/}
                {/*    <div className={classes.storeInspector}>*/}
                {/*      <ContainerDimensions>*/}
                {/*          { ({ height, width }) => (*/}
                {/*            <React.Fragment>*/}
                {/*              <div className={classes.storeInspectorHeader}>*/}
                {/*                Query Store*/}
                {/*              </div>*/}
                {/*              <AceEditor*/}
                {/*                value={JSON.stringify(db.storedQueries, 2, 2)}*/}
                {/*                mode="json"*/}
                {/*                theme="monokai"*/}
                {/*                width={width}*/}
                {/*                height={320}*/}
                {/*                readOnly*/}
                {/*                name="stored-queries-json"*/}
                {/*                editorProps={{$blockScrolling: true}}*/}
                {/*              />*/}
                {/*            </React.Fragment>*/}
                {/*          ) }*/}
                {/*      </ContainerDimensions>*/}
                {/*    </div>*/}
                {/*  </div>*/}
                {/*</div>*/}
            </div>
        </div>
        </div>
    );
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
