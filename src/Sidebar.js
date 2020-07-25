import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import Typography from '@material-ui/core/Typography';
import AddTodoDialog from './AddTodoDialog';
import HashLoader from 'react-spinners/HashLoader';

import Button from '@material-ui/core/Button';

import {useDB, useNormalizedApi} from './db'
//import useAsync from "./useAsync";



const drawerWidth = 360;

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
  let normalizedApi = useNormalizedApi()
  let db = useDB();

  const { classes } = props;

  let [addTodoDialogOpen, setAddTodoDialogOpen] = useState(false);

  const openAddTodoDialog = () => setAddTodoDialogOpen(true)
  const closeAddTodoDialog = () => setAddTodoDialogOpen(false)

  //let [fetchTodosRequest, fetchTodos] = useAsync(normalizedApi.fetchTodos)
  //let [fetchTodosRequest, fetchTodos] = useAsync(normalizedApi.fetchTodos)



   let [filter, setFilter] = useState('active');

  //todo: set on page load?
  // useEffect(() => {
  //   fetchTodos(filter)
  // }, [filter])

  const filterQueries = {
    'active': 'ACTIVE_TODOS',
    'all': 'ALL_TODOS',
    'completed': 'COMPLETED_TODOS'
  }

 // let todos = db.executeStoredQuery(filterQueries[filter]);
  let tqry = db.getStoredQuery('ALL_TODOS');
  let todos = db.executeQuery(tqry);


  const testTodo = (text) => {
    console.log("test",props);
    console.log(todos);

    // let pqry3 = db.getStoredQuery('ALL_PLAYLISTS');
    // let genres = db.executeQuery(pqry3);
    // var selected = genres.filter(g =>{return g.selected});
    // console.log("sel",selected);

    //todo: move
    // normalizedApi.fetchEvents(text)
    //     .then(() => {
    //       //props.onSuccess()
    //     })
    //     .catch(() => {
    //       //props.onCancel()
    //     })
  };




  const fetchEvents = (text) => {
    console.log("fetchEvents",props);
    normalizedApi.fetchEvents(text)
        .then(() => {
          //props.onSuccess()
        })
        .catch(() => {
          //props.onCancel()
        })
  };


  const fetchPlaylists = (text) => {
    console.log("fetchPlaylists",props);
    normalizedApi.fetchPlaylists(text)
        .then(() => {
          //props.onSuccess()
        })
        .catch(() => {
          //props.onCancel()
        })
  };

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

  const getMySavedTracks = (text) => {
    //console.log("fetchArtistGenres",props);
    normalizedApi.getMySavedTracks()
        .then(() => {
          //props.onSuccess()
        })
        .catch(() => {
          //props.onCancel()
        })
  };

  const showStore = (text) => {
    console.log("showStore",props);
    normalizedApi.showStore(text)
        .then(() => {
          //props.onSuccess()
        })
        .catch(() => {
          //props.onCancel()
        })
  };
  const setSelect = (g) => {
    //console.log(g);
    g.selected = !g.selected;
    normalizedApi.updatePlaylist(g)
  };
  const setSelectNode = (g) => {
    //console.log(g);
    g.selected = !g.selected;
    //todo:
    //normalizedApi.updatePlaylist(g)
  };



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
          {/*<Button onClick={testTodo} color="primary">*/}
          {/*  testTodo*/}
          {/*</Button>*/}
          {/*<Button onClick={fetchEvents} color="primary">*/}
          {/*  fetchEvents*/}
          {/*</Button>*/}
          <Button onClick={fetchPlaylists} color="primary">
            fetchPlaylists
          </Button>
          <Button onClick={getMySavedTracks} color="primary">
            getMySavedTracks
          </Button>
          <Button onClick={fetchArtistGenres} color="primary">
            fetchArtistGenres  ({getSelectedPlays('length')})
          </Button>

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
          {todos.map((node, index) => (
              <ListItem
                  button
                  key={node.id}
                  onClick={() => setSelect(node)}
              >
                <Typography
                    variant="subtitle1"
                    color={node.selected ? 'secondary' : 'textPrimary'}
                >
                  {node.text} - <span style={{fontSize:"10px"}}></span>
                </Typography>
              </ListItem>
          ))}
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
