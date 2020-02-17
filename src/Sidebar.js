import React, { useState } from 'react';
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


  const testTodo = (text) => {
    console.log("test",props);

    let pqry3 = db.getStoredQuery('ALL_PLAYLISTS');
    let genres = db.executeQuery(pqry3);
    var selected = genres.filter(g =>{return g.selected});
    console.log("sel",selected);

    //todo: move
    // normalizedApi.fetchEvents(text)
    //     .then(() => {
    //       //props.onSuccess()
    //     })
    //     .catch(() => {
    //       //props.onCancel()
    //     })
  };

  const fetchPlaylists = (text) => {
    console.log("fetchPlaylists",props);

    //todo: not sure exactly how todo manages to have status
    //something to do with fetchTodosRequest on props
    normalizedApi.fetchPlaylists(text)
        .then(() => {
          //props.onSuccess()
        })
        .catch(() => {
          //props.onCancel()
        })
  };

  const fetchArtistGenres = (text) => {
    console.log("fetchArtistGenres",props);

    //todo: not sure exactly how todo manages to have status
    //something to do with fetchTodosRequest on props
    normalizedApi.fetchArtistGenres(text)
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
          <Button onClick={testTodo} color="primary">
            sendplays
          </Button>
          <Button onClick={fetchPlaylists} color="primary">
            fetchPlaylists
          </Button>
          <Button onClick={fetchArtistGenres} color="primary">
            fetchArtistGenres
          </Button>

          <Button onClick={showStore} color="primary">
            showStore
          </Button>

          <div className={classes.addTodoButton}>
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
              {props.playlists.map((play, index) => (
                  <ListItem
                      button
                      key={play.id}
                      onClick={() => setSelect(play)}
                  >
                    <Typography
                        variant="subtitle1"
                        color={play.selected ? 'secondary' : 'textPrimary'}
                    >
                      {play.name} - <span style={{fontSize:"10px"}}>{play.owner.display_name}</span>
                    </Typography>
                  </ListItem>
              ))}
            </List>
      </div>
  );

  // return (
  //   <div className={classes.drawer}>
  //     <div className={classes.toolbar}>
  //       <Tabs
  //         value={tabs.indexOf(props.filter)}
  //         onChange={(e, i) => props.onFilterChange(tabs[i])}
  //         indicatorColor="primary"
  //         textColor="primary"
  //         variant="fullWidth"
  //         className={classes.tabs}
  //         classes={{flexContainer: classes.tabsFlexContainer}}
  //       >
  //         {/*<Tab label="Active" classes={{ root: classes.tabRoot }} />*/}
  //         {/*<Tab label="Completed" classes={{ root: classes.tabRoot }} />*/}
  //         <Tab label="All" classes={{ root: classes.tabRoot }}/>
  //       </Tabs>
  //       <Button onClick={testTodo} color="primary">
  //         testTodo
  //       </Button>
  //       <Button onClick={fetchPlaylists} color="primary">
  //         fetchPlaylists
  //       </Button>
  //       <Button onClick={showStore} color="primary">
  //         showStore
  //       </Button>
  //
  //       <div className={classes.addTodoButton}>
  //         <IconButton onClick={openAddTodoDialog} color="primary" component="span">
  //           <AddIcon />
  //         </IconButton>
  //         <AddTodoDialog
  //           open={addTodoDialogOpen}
  //           onCancel={closeAddTodoDialog}
  //           onSuccess={closeAddTodoDialog}
  //         />
  //       </div>
  //     </div>
  //     <Divider />
  //     {props.fetchTodosRequest.pending && (
  //       <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30%'}}>
  //         <HashLoader size={30} />
  //       </div>
  //     )}
  //     {props.fetchTodosRequest.fulfilled && (
  //       <List>
  //         {props.todos.map((todo, index) => (
  //           <ListItem
  //             button
  //             key={todo.id}
  //             onClick={(e) => props.onSelectedTodoChange(todo.id)}
  //           >
  //           <Typography
  //             variant="subtitle1"
  //             color={props.selectedTodo === todo.id ? 'secondary' : 'textPrimary'}
  //           >
  //             {todo.text}
  //           </Typography>
  //           </ListItem>
  //         ))}
  //       </List>
  //     )}
  //   </div>
  // );
}

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
};

Sidebar.defaultProps = {
  onFilterChange: () => {},
};

export default withStyles(styles)(Sidebar);
