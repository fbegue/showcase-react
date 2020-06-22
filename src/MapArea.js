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

function MapArea(props) {
  let normalizedApi = useNormalizedApi()
  let db = useDB();
  const { classes } = props;

  const setSelect = (g) => {
    //console.log(g);
    g.selected = !g.selected;

    //todo: action on select
    // normalizedApi.updatePlaylist(g)
  };

  return (
      <div>
        <div id="vmap" style={{width:"600px",height:"400px"}}></div>
        <List>
          {props.states['OH'].map((play, index) => (
              <ListItem
                  button
                  key={play.id}
                  onClick={() => setSelect(play)}
              >
                <Typography
                    variant="subtitle1"
                    color={play.selected ? 'secondary' : 'textPrimary'}
                >
                  {play.displayName}
                  {/*- <span style={{fontSize:"10px"}}>{play.owner.display_name}</span>*/}
                </Typography>
              </ListItem>
          ))}
        </List>
      </div>
  );
}

MapArea.propTypes = {
  classes: PropTypes.object.isRequired,
};

MapArea.defaultProps = {
  onFilterChange: () => {},
};

export default withStyles(styles)(MapArea);
