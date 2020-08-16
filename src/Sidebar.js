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
import { useTransition, animated } from "react-spring";
import AddTodoDialog from './AddTodoDialog';
import _ from "lodash";

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

  //todo: tried to avoid sending the entire globalState.node to pie
  //but this won't resolve in time, which makes sense I suppose
  //I need to find what I'm looking for ... would rather have dealt with an OBJECT (damnit Alex)
  // var aggPointer = _.find(globalState.node,{name:'agg'})
  // console.log("$aggPointer",aggPointer);

  //--------------------------------------------------
  //react-spring
  let data = [
    {
      name: "Rare Wind"
    },
    {
      name: "Saint Petersburg"
    },
    {
      name: "Deep Blue"
    },
    {
      name: "Ripe Malinka"
    },
    {
      name: "Near Moon"
    },
    {
      name: "Wild Apple"
    }
  ];
  // const [rows, set] = useState(data);

  //the y value we're generating here is the height at which the next item will spawn
  //when you know how big each item is ahead of time, it's easy to just say
  //'well whatever the index is * that pre-determined height is where it needs to go'
  //todo: but here tho....
  function getNodeHeight(node,i){
    console.log("getNodeHeight",node);
    //testing: determine height based on # of genres I guess?
    //I really just want it to be automatic I guess ...
    //like how am I supposed to know how big it's going to be?
    const height = 30;
    //testing: disabled
    // const calc = height * node.genres.length * i;
    const calc = height * i + 5
    console.log("height",calc);
    return calc
  }
  const transitions = useTransition(
      globalState.node.map((data, i) => ({ ...data, y: getNodeHeight(data,i) })),
      d => d.id,
      {
        from: { position: "absolute", opacity: 0 },
        leave: { height: 10, opacity: 0 },
        enter: ({ y }) => ({ y,  height: 1000,opacity: 1 }),
        update: ({ y }) => ({ y })
      }
  );


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

          {/*todo: should just be passing 'agg'*/}
          <Pie data={_.find(globalState.node,{name:'agg'})['data'] || []}></Pie>
          {/*<Pie data={globalState.node}></Pie>*/}

          {/*<ListItem*/}
          {/*    button*/}
          {/*    key="abc123"*/}
          {/*    onClick={() => setSelect()}*/}
          {/*    style={{border:"1px #00000036 solid", borderRadius:"5px"}}*/}
          {/*>*/}
          {/*  <Typography*/}
          {/*      variant="subtitle1"*/}
          {/*  >*/}
          {/*    {globalState.node.map((node, index) => (*/}
          {/*        <ChipsArray chipData={node.genres}></ChipsArray>*/}
          {/*    ))}*/}
          {/*  <span style={{fontSize:"10px"}}>test test test</span>*/}
          {/*  </Typography>*/}
          {/*</ListItem>*/}

          {/*todo: couldn't change 'item' to 'node'?*/}
          {/*todo: key seems to just be an index from 0?*/}
          {transitions.map(({ item, props: { y, ...rest }, key }, index) => (
              <animated.div
                  key={key}
                  class="card"
                  style={{
                    transform: y.interpolate(y => `translate3d(0,${y}px,0)`),
                    ...rest
                  }}
              >
                <ListItem
                    button
                    key={item.id}
                    onClick={() => setSelect(item)}
                    style={{border:"1px #00000036 solid", borderRadius:"5px"}}
                >
                  <Typography
                      variant="subtitle1"
                      color={item.selected ? 'secondary' : 'textPrimary'}
                  >
                    {item.name} - <span style={{fontSize:"10px"}}>{item.data.length}</span>
                    {/*testing: disabled*/}
                    {/*<ChipsArray chipData={item.genres}></ChipsArray>*/}
                  </Typography>
                </ListItem>
              </animated.div>
          ))}

          {/*{globalState.node.map((node, index) => (*/}
          {/*    <ListItem*/}
          {/*        button*/}
          {/*        key={node.id}*/}
          {/*        onClick={() => setSelect(node)}*/}
          {/*        style={{border:"1px #00000036 solid", borderRadius:"5px"}}*/}
          {/*    >*/}
          {/*      <Typography*/}
          {/*          variant="subtitle1"*/}
          {/*          color={node.selected ? 'secondary' : 'textPrimary'}*/}
          {/*      >*/}
          {/*        {node.id} - <span style={{fontSize:"10px"}}></span>*/}
          {/*        <ChipsArray chipData={node.genres}></ChipsArray>*/}
          {/*      </Typography>*/}
          {/*    </ListItem>*/}
          {/*))}*/}

          {/*{globalState.node.map( a =>*/}
          {/*    <ChipsArray chipData={a.genres}></ChipsArray>*/}
          {/*)}*/}
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
