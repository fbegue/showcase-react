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
import NestedListEvents from './NestedListEvents';
import './App.css'



import TodoDetail from './TodoDetail';
import brace from 'brace';
import AceEditor from 'react-ace';
import ContainerDimensions from 'react-container-dimensions';
import useAsync from './useAsync';
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
import MenuBar from './MenuBar'
import { BrowserRouter } from 'react-router-dom'


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

function App(props) {
  const { classes } = props;
  let [filter, setFilter] = useState('active');
  let [selectedTodoId, setSelectedTodoId] = useState();

  let normalizedApi = useNormalizedApi()
  let db = useDB();

  let [fetchTodosRequest, fetchTodos] = useAsync(normalizedApi.fetchTodos)
  //let [fetchTodosRequest, fetchTodos] = useAsync(normalizedApi.fetchTodos)

  useEffect(() => {
    fetchTodos(filter)
  }, [filter])

  let todos = db.executeStoredQuery(filterQueries[filter]);

  let pqry = db.getStoredQuery('ALL');
  let playlists = db.executeQuery(pqry);
  let pqry2 = db.getStoredQuery('ALL_ARTISTS');
  let artists = db.executeQuery(pqry2);

  let pqry3 = db.getStoredQuery('ALL_GENRES');
  let genres = db.executeQuery(pqry3);


  let pqry4 = db.getStoredQuery('ALL_EVENTS');
  let events = db.executeQuery(pqry4);
  events.forEach(function(e){e.childrenKey = "performance"});
  console.log("$events",events);


  //testing:
  //let performances = [{id:1,displayName:"display1"},{id:2,displayName:"display2"},{id:3,displayName:"display3"}]

  let todoIds = JSON.stringify(todos.map(t => t.id))

  useEffect(() => {
    setSelectedTodoId(todos[0] && todos[0].id)
  }, [todoIds])

  return (
      <div className={classes.root}>

        {/*<Sidebar*/}
        {/*todos={todos}*/}
        {/*fetchTodosRequest={fetchTodosRequest}*/}
        {/*filter={filter}*/}
        {/*onFilterChange={setFilter}*/}
        {/*selectedTodo={selectedTodoId}*/}
        {/*onSelectedTodoChange={setSelectedTodoId}*/}
        {/*/>*/}
        <div style={{marginLeft:"10em"}}>
        <Sidebar
            playlists={playlists}
            fetchTodosRequest={fetchTodosRequest}
            filter={filter}
            onFilterChange={setFilter}
            selectedTodo={selectedTodoId}
            onSelectedTodoChange={setSelectedTodoId}
        />
        </div>
        {/*<NestedList*/}
        {/*artists={artists}*/}
        {/*genres={genres}*/}
        {/*/>*/}
        <div>
          {/*<BrowserRouter>*/}
          <MenuBar data={events} />
        </div>
        {/*</BrowserRouter>*/}
        {/*todo: list of nested lists?*/}
        {/*yeah no this isn't working very well - could be for an easy reason but idk */}
        {/*like i can in no way actually click on anything in here*/}
        {/*just seems like its not going to be THAT easy :)*/}
        {/*google: list of nestedList material ui*/}
        {/*https://stackoverflow.com/questions/48607844/multilevel-nested-list-in-material-ui-next*/}
        <div>
          {/*<List>*/}
          {/*{events.map((event, index) => (*/}
          {/*<ListItem*/}
          {/*button*/}
          {/*key={event.id}*/}
          {/*onClick={(e) => props.onSelectedTodoChange(event.id)}*/}
          {/*>*/}
          {/*<Typography*/}
          {/*variant="subtitle1"*/}
          {/*color={props.selectedTodo === event.id ? 'secondary' : 'textPrimary'}*/}
          {/*>*/}
          {/*{event.displayName} - <span style={{fontSize:"10px"}}>{event.start.date}</span>*/}
          {/*</Typography>*/}
          {/*<div className={"nestedListEvents"} >*/}
          {/*/!*<NestedListEvents*!/*/}
          {/*/!*    // performances={event.performance}*!/*/}
          {/*/!*    // testing:*!/*/}
          {/*/!*    performances={performances}*!/*/}
          {/*/>*/}
          {/*</div>*/}
          {/*</ListItem>*/}
          {/*))}*/}
          {/*</List>*/}

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
  );
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
