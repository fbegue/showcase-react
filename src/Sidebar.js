import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import Typography from '@material-ui/core/Typography';
import AddTodoDialog from './AddTodoDialog';

import Drawer from '@material-ui/core/Drawer';
import ListItemText from '@material-ui/core/ListItemText';
import HashLoader from 'react-spinners/HashLoader';
import Button from '@material-ui/core/Button';

import ChipsArray from './ChipsArray'
import Pie from './Pie'


import {useDB, useNormalizedApi} from './db'
//import useAsync from "./useAsync";

//todo:
import alasqlAPI from "./alasql/index";
import {Context} from "./alasql/Store";
//import alasql from "alasql";


const drawerWidth = "15em";

const styles = theme => ({
  drawer: {
    width: drawerWidth,
    minWidth: drawerWidth,
    flex: 1,
    height: '100vh',
    borderRight: '1px solid rgba(0, 0, 0, 0.12)'
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: {
    ...theme.mixins.toolbar,
    position: 'relative'
  },
  tabRoot: {
    minWidth: 0,
    height: '100%'
  },
  tabs: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 64,
    top: 0
  },
  addTodoButton: {
    position: 'absolute',
    width: 64,
    height: '100%',
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabsFlexContainer: {
    height: '100%'
  }
});

const tabs = ['active', 'completed', 'all']
//const tabs = ['artists']

function Sidebar(props) {
  /**
   * I have just no idea what I was doing in here
   * looks like at some point I was using a proper 'Drawer' component
   * but then got sidetracked into...something else
   * - exported with drawer-like styles
   * - looks like I took the todos example for react-use-database and shoved it in here
   *
   */


//todo: not sure how/if this works
  const { classes } = props;

//---------------------------------------
// todos stuff

  let [addTodoDialogOpen, setAddTodoDialogOpen] = useState(false);

  const openAddTodoDialog = () => setAddTodoDialogOpen(true)
  const closeAddTodoDialog = () => setAddTodoDialogOpen(false)

//---------------------------------------
//outdated normalizedApi stuff

  let normalizedApi = useNormalizedApi()
  let db = useDB();

  var getSelectedPlays = function(retFlag){
    let pqry3 = db.getStoredQuery('ALL_PLAYLISTS');
    let plays = db.executeQuery(pqry3);
    var selected = plays.filter(g =>{return g.selected});
    //console.log("sel",selected);

    if(retFlag === 'length'){
      return selected.length
    }
    return selected;
  };

  const setSelect = (g) => {
    //console.log(g);
    g.selected = !g.selected;
    normalizedApi.updatePlaylist(g)

  };

  const fetchArtistGenres = (text) => {
    console.log("fetchArtistGenres",props);
    var selected = getSelectedPlays();
    console.log("selected",selected);

    normalizedApi.fetchArtistGenres(selected)
        .then(() => {
          //props.onSuccess()
        })
        .catch(() => {
          //props.onCancel()
        })
  };

  const setSelectNode = (g) => {
    //console.log(g);
    g.selected = !g.selected;
    //todo:
    //normalizedApi.updatePlaylist(g)
  };

  let tqry = db.getStoredQuery('ALL_TODOS');
  let todos = db.executeQuery(tqry);

  //---------------------------------------

  async function getem() {
    ///await fetchEvents();
    await fetchPlaylists()
    await followedArtists()
    await alasqlAPI.fetchEvents()
    return 'done';
  }

  //testing:
  var user = '123028477'

  async function fetchPlaylists()  {
    var playlists  = await alasqlAPI.fetchPlaylists(user)
    //console.log("fetchPlaylists",playlists);
    try{

      // alasql("CREATE TABLE cities (city string, pop number)");
      // alasql("INSERT INTO cities VALUES ('Paris',2249975),('Berlin',3517424),('Madrid',3041579)");
      // var r = alasql("SELECT * from cities");
      //console.log("$r",r);
    }
    catch(e){console.error(e)}
  }
  async function followedArtists() {
    var artists = await alasqlAPI.followedArtists(user)
    //console.log("followedArtists", artists);
  }


  //--------------------------------------------------
  //starting to look at node reporting

  const [globalState, dispatch] = useContext(Context);


  return (
      <div className={classes.drawer}>
        <div className={classes.toolbar}>
          <Tabs
              value={tabs.indexOf(props.filter)}
              onChange={(e, i) => props.onFilterChange(tabs[i])}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              className={classes.tabs}
              classes={{flexContainer: classes.tabsFlexContainer}}
          >
            {/*<Tab label="Active" classes={{ root: classes.tabRoot }} />*/}
            {/*<Tab label="Completed" classes={{ root: classes.tabRoot }} />*/}
            <Tab label="All" classes={{ root: classes.tabRoot }}/>
          </Tabs>
          {/*<Button onClick={getem} color="primary">*/}
          {/*  GETEM*/}
          {/*</Button>*/}
          {/*<Button onClick={testTodo} color="primary">*/}
          {/*  testTodo*/}
          {/*</Button>*/}
          {/*<Button onClick={fetchEvents} color="primary">*/}
          {/*  fetchEvents*/}
          {/*</Button>*/}
          {/*<Button onClick={fetchPlaylists} color="primary">*/}
          {/*  fetchPlaylists*/}
          {/*</Button>*/}
          {/*<Button onClick={followedArtists} color="primary">*/}
          {/*  followedArtists*/}
          {/*</Button>*/}
          {/*<Button onClick={getMySavedTracks} color="primary">*/}
          {/*  getMySavedTracks*/}
          {/*</Button>*/}
          {/*<Button onClick={fetchArtistGenres} color="primary">*/}
          {/*  fetchArtistGenres  ({getSelectedPlays('length')})*/}
          {/*</Button>*/}

          {/*<Button onClick={showStore} color="primary">*/}
          {/*  showStore*/}
          {/*</Button>*/}

          <div style={{marginBottom:"1em"}} className={classes.addTodoButton}>
            <IconButton onClick={openAddTodoDialog} color="primary" component="span">
              <AddIcon />
            </IconButton>
            <AddTodoDialog
                open={addTodoDialogOpen}
                onCancel={closeAddTodoDialog}
                onSuccess={closeAddTodoDialog}
            />
          </div>
        </div>
        <Divider />
        <List>
          {/*todo: idea is to made node more sophisicated (able to report who gave what)*/}
          {/*and then these list items are things like 'Saved Artists' and then genre chips*/}
          {/*{todos.map((node, index) => (*/}
          {/*    <ListItem*/}
          {/*        button*/}
          {/*        key={node.id}*/}
          {/*        onClick={() => setSelect(node)}*/}
          {/*    >*/}
          {/*      <Typography*/}
          {/*          variant="subtitle1"*/}
          {/*          color={node.selected ? 'secondary' : 'textPrimary'}*/}
          {/*      >*/}
          {/*        {node.text} - <span style={{fontSize:"10px"}}></span>*/}
          {/*      </Typography>*/}
          {/*    </ListItem>*/}
          {/*))}*/}
          <Pie data={globalState.node}></Pie>
          {globalState.node.map( a =>
              <ChipsArray chipData={a.genres}></ChipsArray>
          )}
        </List>
        {/*<List>*/}
        {/*  {props.playlists.map((play, index) => (*/}
        {/*      <ListItem*/}
        {/*          button*/}
        {/*          key={play.id}*/}
        {/*          onClick={() => setSelect(play)}*/}
        {/*      >*/}
        {/*        <Typography*/}
        {/*            variant="subtitle1"*/}
        {/*            color={play.selected ? 'secondary' : 'textPrimary'}*/}
        {/*        >*/}
        {/*          {play.name} - <span style={{fontSize:"10px"}}>{play.owner.display_name}</span>*/}
        {/*        </Typography>*/}
        {/*      </ListItem>*/}
        {/*  ))}*/}
        {/*</List>*/}
      </div>
  );
}

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
};

Sidebar.defaultProps = {
  onFilterChange: () => {},
};

export default withStyles(styles)(Sidebar);
