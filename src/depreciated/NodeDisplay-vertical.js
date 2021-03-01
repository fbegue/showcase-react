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
import _ from "lodash";

import {familyColors} from './families'
//import {NODES_STATE_VAR} from './alasql/withApolloProvider'


import {useDB, useNormalizedApi} from './db'
//import useAsync from "./useAsync";

//todo:
//import alasqlAPI from "./alasql/index";
import Store, {Context} from "./storage/Store";
//import { GLOBAL_STATE_VAR,GLOBAL_UI_VAR} from './alasql/withApolloProvider';
import {useQuery,useReactiveVar} from "@apollo/react-hooks";
//import Profile from './components/Profile'

import Player,{} from './Player'
import Map from "./Map";
//import alasql from "alasql";

//testing:
import testData from './data'
import './styles.css'
import { CSSTransitionGroup } from 'react-transition-group' // ES6
import girl from './assets/girl.png'
import airplane from './assets/airplane.png'
//import MoreVertIcon from '@material-ui/icons/MoreVert';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import {Control,Highlighter} from './index'
import CloudIcon from "@material-ui/icons/Cloud";
import Chip from '@material-ui/core/Chip';

const drawerWidth = "15em";

const styles = theme => ( {
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

function NodeDisplay(props) {

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
    //console.log("getNodeHeight",node);

    //todo: determine height based on # of genres I guess?
    //note: so the big lesson here is . . .i have no idea.
    //needs to be multiples of 50? who fucking know

    function round50(x) { return Math.ceil(x/50)*50; }

    if(node.name === "agg"){return 150}
    // if(node.name === "playlists"){return 50}
    // if(node.name === "artists"){return 50}
    // return 100
    return 220
  }

  function getNodes(){
    //console.log('Sidebar | getNodes | globalState.node)',globalState.node);
    //todo: make sure to guarantee order every time

    //console.log("getNodes",globalState.node.filter(n => n.data.length > 0))
    globalState.node.forEach(n =>{n.height = getNodeHeight(n)})
    return globalState.node.filter(n => n.data.length > 0)
        // .map((data, i) => ({ ...data, y: getNodeHeight(data,i) }))
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

  const NodeSingle = React.memo(function NodeSingle(props){
    //todo: I couldn't pass 'key' as a prop here? wtf

    // useEffect(() => {
    //   console.log("componentDidMount | NodeSingle");
    //
    //   return function cleanup() {
    //     console.log("componentWillUnmount | NodeSingle");
    //   };
    // });

   // console.log("NodeSingle",props);
    let highlighter = Highlighter.useContainer()

    function getDynamicStyle(item,i){
      //what family does the item belong to? if that family
      //have been hovered over, we'll see it here
      //have negative margins for overlap effect (except every 3)
      //console.log(i);
     // console.log(highlighter.hoverState);
      //console.log(highlighter.hoverState[0] === item.familyAgg);
      var ret = null;
      highlighter.hoverState[0] === item.familyAgg ? ret= {
        marginLeft: i % 3 === 0 ? "0em":"-1em",
        border: "3px solid " +  familyColors[item.familyAgg],
        lineHeight: "8px"
      }:ret = {
        marginLeft: i % 3 === 0 ? "0em":"-1em",
        border: "3px solid transparent",
        lineHeight: "8px"};
      return ret
    }

    return (

        <div key={props.useKey} style={getDynamicStyle(props.item,props.it)} >
          {props.item.images && <img style={{height:"7em",width:"7em"}} src={props.item.images[0].url}/>}
          {props.item.more && <div style={{height:"7em",width:"7em"}}>{props.item.more}</div>}
        </div>
    )
  });

  function NodeBasic(props){

    // console.log("NodeBasic",props);
    // console.log(nodes);

    useEffect(() => {
      console.log("componentDidMount | NodeBasic");

      return function cleanup() {
        console.log("componentWillUnmount | NodeBasic");
      };
    });


    //todo: not super confident about this - how does it help?
    //I guess I always had a view of 'this playlist means this family' but is it really necessary?

    //process all artists in a playlist to produce a family type that best represents the node?
    // function getNodeAgg(item){
    //   return  <ChipsArray  chipData={item.data.artist.genres}>
    //   </ChipsArray>
    //  return item.data.map((item,i) => (
    //       <div key={i} style={{marginLeft:".5em"}}>
    //
    //       </div>
    //   ))
    // }

    //todo: calling a function as part of a render which is based on changing state from an external source....
    //writing it all out sounds bad, doesn't it? we do 'variable' styling with material's override functionality when we style chips,
    //but I'm not sure how to go about truly dynamic styles like this right now...
    //specifically: how to prevent redrawing of entire node each time (related to other node redraw issues?)

    // if(!(nodes[props.item.name])){
    //   console.log("set |",props.item.name);
    //   GLOBAL_UI_VAR({...nodes,[props.item.name]:props.item.data})
    // }

    var data = props.item.data;
    if(props.item.data.length > 5){
      console.log("true");
      data = props.item.data.slice(0,5);

      data.push({id:"more",familyAgg:null,more:
            <div style={{backgroundColor:'white',height:"7em",display:"flex",
              flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              <div><MoreHorizIcon fontSize={'small'}/></div>
            </div>
      })
    }
    return (
        <div className="cell">
          <div className="details">
            {/*todo: will need to extract user from here as well and add on*/}
            {/*todo: making arbitrary limit of 6*/}

            <div >
              <Chip label={<div style={{padding:".5em"}}> {props.item.label}  ({props.item.data.length})</div>}/>
            </div>

            <div style={{display:"flex", flexWrap:"wrap" }}>
              {/*{JSON.stringify(items,null,4)}*/}

              {/*testing:*/}
              {data.map((item,i) => (
                  <NodeSingle useKey={`el-${item.id}`} it={i} item={item}></NodeSingle>
              ))}

              {/*{props.item.data.map((item,i) => (*/}
              {/*    <div  key={`el-${item.id}`}  style={getDynamicStyle(item,i)} >*/}
              {/*      <img style={{height:"7em"}}*/}
              {/*             src={item.images[0].url}*/}
              {/*            //note: is it because the images aren't loading on time? no.*/}
              {/*            //src={fakeItems[i].images[0].url}*/}
              {/*      />*/}
              {/*    </div>*/}
              {/*))}*/}

              {/*<div>{nodes[props.item.name].map((item,i) => (*/}
              {/*    <NodeSingle item={item}></NodeSingle>*/}
              {/*))}</div>*/}

            </div>

            {/*{getStuff(props.item)}*/}
          </div>
        </div>
    )
  }

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
                  <NodeBasic item={item}/>
                </animated.div>
            ))}
          </List>
        </div>
      </div>
  );
}

NodeDisplay.propTypes = {
  classes: PropTypes.object.isRequired,
};

NodeDisplay.defaultProps = {
  onFilterChange: () => {},
};

export default withStyles(styles)(NodeDisplay);
