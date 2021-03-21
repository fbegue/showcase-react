import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import { useTransition, animated } from "react-spring";
import _ from "lodash";

import {familyColors} from '../families'
//import {NODES_STATE_VAR} from './alasql/withApolloProvider'
//import {useDB, useNormalizedApi} from './db'
//import useAsync from "./useAsync";

//todo:
// import alasqlAPI from "./alasql/index";
 import {Context} from "../storage/Store";
//import MoreVertIcon from '@material-ui/icons/MoreVert';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import {Control,Highlighter} from '../index'
import CloudIcon from "@material-ui/icons/Cloud";
import Chip from '@material-ui/core/Chip';

const drawerWidth = "15em";

const styles = theme => ( {
  drawer: {
    width: drawerWidth,
    minWidth: drawerWidth,
    flex: 1,
    // height: '9em',
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

function GenresDisplay(props) {

  // useEffect(() => {
  //   console.log("componentDidMount | Sidebar");
  //   // Update the document title using the browser API
  //   //testing:
  //   // document.title = `You clicked ${count} times`;
  //   return function cleanup() {
  //     console.log("componentWillUnmount | Sidebar");
  //   };
  // });

//todo: not sure how/if this works
  const { classes } = props;

//---------------------------------------

  const [globalState, dispatch] = useContext(Context);
  //let control = Control.useContainer()
  //const globalUI = useReactiveVar(GLOBAL_UI_VAR);
  //console.log("$globalUI",globalUI);

  function getNodeHeight(node,i){
    return 20
  }

  function getNodes(){
    //console.log('Sidebar | getNodes | globalState.node)',globalState.node);
    //todo: make sure to guarantee order every time

    //console.log("getNodes",globalState.node.filter(n => n.data.length > 0))
    props.genres.forEach(n =>{n.height =20})
    return  props.genres
        .map((data, i) => ({ ...data, y: (height += data.height) - data.height }))
  }

  let height = 0
  const transitions = useTransition(
      //rows.map(data => ({ ...data, y: (height += data.height) - data.height })),
      getNodes(),
      d => d.id,
      {
        from: { height: 0, opacity: 0 },
        leave: { height: 0, opacity: 0 },
        enter: ({ y, height }) => ({ y, height, opacity: 1 }),
        update: ({ y, height }) => ({ y, height })
      }
  )

  return (
      <div className={classes.drawer}>
        <div>
          <List>
            {transitions.map(({item, props: {y, ...rest}, key}, index) => (
                <animated.div
                    key={key}
                    className="card"
                    // style={{ zIndex: data.length - index, transform: y.interpolate(y => `translate3d(0,${y}px,0)`), ...rest }}
                    style={{transform: y.interpolate(y => `translate3d(0,${y}px,0)`), ...rest}}
                >
                  {/*<Node item={item}/>*/}
                  {/*<NodeTransGroup item={item}/>*/}
                 <div> {item.name}</div>
                </animated.div>
            ))}
          </List>
        </div>
      </div>
  );
}

GenresDisplay.propTypes = {
  classes: PropTypes.object.isRequired,
};

GenresDisplay.defaultProps = {
  onFilterChange: () => {},
};

export default withStyles(styles)(GenresDisplay);
