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
import Store, {Context} from "./alasql/Store";
import { GLOBAL_STATE_VAR,GLOBAL_UI_VAR} from './alasql/withApolloProvider';
import {useQuery,useReactiveVar} from "@apollo/react-hooks";
import Profile from './components/Profile'

import Player,{} from './Player'
import Map from "./Map";
//import alasql from "alasql";

//testing:
import testData from './data'
import './styles.css'
import {Control} from './index'
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

  const setSelectNode = (g) => {
    //console.log(g);
    g.selected = !g.selected;
    //todo:
    //normalizedApi.updatePlaylist(g)
  };

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

  //testing: apollo reactive
  //  const globalState = useReactiveVar(GLOBAL_STATE_VAR);
  //  console.log("$globalState",globalState);

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

    //todo: determine height based on # of genres I guess?
    //note: so the big lesson here is . . .i have no idea.
    //needs to be multiples of 50? who fucking know

    function round50(x) { return Math.ceil(x/50)*50; }

    if(node.name === "agg"){return 150}
    // if(node.name === "playlists"){return 50}
    // if(node.name === "artists"){return 50}
    return 100
  }

  //anytime  globalState.node is updated, we will redraw these
  // let height = 0
  function getNodes(){
    //todo: make sure to guarantee order every time

    //console.log("getNodes",globalState.node.filter(n => n.data.length > 0))
    globalState.node.forEach(n =>{n.height = getNodeHeight(n)})
    return globalState.node.filter(n => n.data.length > 0)
        // .map((data, i) => ({ ...data, y: getNodeHeight(data,i) }))
        .map((data, i) => ({ ...data, y: (height += data.height) - data.height }))
  }

  const [rows, set] = useState([testData[0]])
  var i =0;
  function add(){
    i = i + 1;
    console.log(i);
    set([...rows,testData[i]])
  }
  function remove(){
    set([rows[0]])
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

  let control = Control.useContainer()

  function NodeBasic(props){

    // function getItems(data){
    //   return data.forEach(n =>{getDim(n)})
    // }


    return (
        <div className="cell">
          <div className="details" style={{backgroundImage: props.item.css}}>
            {props.item.data.name}
            <div style={{display:"flex"}} >
              {props.item.data.map((item,i) => (
                  <div style={{marginLeft:"-1em"}}>
                    <img style={{height:"5em"}} src={item.images[0].url}/>
                    {/*<div>{item.id}</div>*/}
                  </div>
                  //todo: these were probably fine but fuck'em for now
                  // <div className="cell">
                  //   <div className="details" style={{backgroundImage: item.css}}>
                  //     <img style={{height:"100%"}} src={item.images[0].url}/>
                  //     <div>{item.id}</div>
                  //   </div>
                  // </div>
              ))}
            </div>
          </div>
        </div>
    )
  }

  function Node(props){

    function getDim(n){
      n.width = 50;
      n.height = 150;
    }


    const [hist, setHist] = useState(null);
    const [items, setItems] = useState([]);

    var ex = {"external_urls":{"spotify":"https://open.spotify.com/artist/07d5etnpjriczFBB8pxmRe"},"followers":{"href":null,"total":320048},"genres":[{"id":6,"name":"hip hop","family_id":4,"family_name":"hip hop"},{"id":23,"name":"rap","family_id":4,"family_name":"hip hop"},{"id":50,"name":"neo soul","family_id":5,"family_name":"r&b"},{"id":162,"name":"underground hip hop","family_id":4,"family_name":"hip hop"},{"id":643,"name":"alternative r&b","family_id":5,"family_name":"r&b"},{"id":1118,"name":"chicago rap","family_id":4,"family_name":"hip hop"},{"id":1184,"name":"indie soul","family_id":null,"family_name":null}],"href":"https://api.spotify.com/v1/artists/07d5etnpjriczFBB8pxmRe","id":"07d5etnpjriczFBB8pxmRe","images":[{"height":640,"url":"https://i.scdn.co/image/44b2af225e5a8f0c215965d542e8ab9d00311b5f","width":640},{"height":320,"url":"https://i.scdn.co/image/bf22986c64f734e4afc5f399213ccaaea6b24cdf","width":320},{"height":160,"url":"https://i.scdn.co/image/ad9f49a3937cea57380538a9d84d726163638e05","width":160}],"name":"BJ The Chicago Kid","popularity":69,"type":"artist","uri":"spotify:artist:07d5etnpjriczFBB8pxmRe","familyAgg":"hip hop","followed":true,"source":"saved","tableData":{"id":0,"checked":true},"width":50,"height":150}
    var ex2 = {"external_urls":{"spotify":"https://open.spotify.com/artist/07d5etnpjriczFBB8pxmRe"},"followers":{"href":null,"total":320048},"genres":[{"id":6,"name":"hip hop","family_id":4,"family_name":"hip hop"},{"id":23,"name":"rap","family_id":4,"family_name":"hip hop"},{"id":50,"name":"neo soul","family_id":5,"family_name":"r&b"},{"id":162,"name":"underground hip hop","family_id":4,"family_name":"hip hop"},{"id":643,"name":"alternative r&b","family_id":5,"family_name":"r&b"},{"id":1118,"name":"chicago rap","family_id":4,"family_name":"hip hop"},{"id":1184,"name":"indie soul","family_id":null,"family_name":null}],
      "href":"https://api.spotify.com/v1/artists/07d5etnpjriczFBB8pxmRe",
      // "id":"07d5etnpjriczFBB8pxmRe",
      //fake it
      "id":"97d5etnpjriczFBB8pxmRe",
      "images":[{"height":640,"url":"https://i.scdn.co/image/44b2af225e5a8f0c215965d542e8ab9d00311b5f","width":640},{"height":320,"url":"https://i.scdn.co/image/bf22986c64f734e4afc5f399213ccaaea6b24cdf","width":320},{"height":160,"url":"https://i.scdn.co/image/ad9f49a3937cea57380538a9d84d726163638e05","width":160}],"name":"BJ The Chicago Kid","popularity":69,"type":"artist","uri":"spotify:artist:07d5etnpjriczFBB8pxmRe","familyAgg":"hip hop","followed":true,"source":"saved","tableData":{"id":0,"checked":true},"width":50,"height":150}


    //todo: where does this happen
    getDim(ex); getDim(ex2);


    useEffect(() => {
      console.log("componentDidMount-Node");
      //setItems(ex.concat(ex2))
      setItems([ex])
      return function cleanup() {
        // console.log("componentWillUnmount");
      };
    },[]);

    function getItems(data){

      //testing:
      //var subset = data.slice(0,3);
      //var subset = items;
      // var subset = data;
      data.forEach(n =>{getDim(n)})

      //todo: very basic looping problem
      //the idea was for this component to maintain its own state. it would update
      //this is a testin ground, but I don't know how to prevent this situation where
      //the component is concerned about this update here
      // setItems([...items,ex2])
      console.log("$sub",data);
      //return data.map((data) => ({ ...data, x: (width += data.width) - data.width }))
      return data.map((data) => ({ ...data, x: (width += data.width) - data.width }))
    }

    let height = 0
    let width = 0
    const transitions = useTransition(
        getItems(props.item.data),
        // getItems(globalState.node[1].data),
        //rows.map(data => ({ ...data, x: (width += data.width)  })),
        (d) => d.id,
        {
          from: { height: 0, opacity: 0 },
          leave: { height: 0, opacity: 0 },
          enter: ({ x, height }) => ({ x, height, opacity: 1 }),
          update: ({ x, height }) => ({ x, height })
        }
    )
    return (
        <div className="cell">
          <div className="details" style={{backgroundImage: props.item.css}}>
            {props.item.name}
            <div className="list" style={{height, width}}>
              {transitions.map(({item, props: {x, ...rest}, key}, index) => (
                  <animated.div
                      key={key}
                      className="card"
                      style={{
                        width: 150,
                        zIndex: data.length,
                        transform: x.interpolate((x) => `translate3d(${x}px,0,0)`),
                        ...rest
                      }}>

                    <div className="cell">
                      <div className="details" style={{backgroundImage: item.css}}>
                        <img style={{height:"100%"}} src={item.images[0].url}/>
                      </div>
                    </div>
                  </animated.div>
              ))}
            </div>
          </div>
        </div>
    )
  }


  //profile
  const globalUI = useReactiveVar(GLOBAL_UI_VAR);
  //console.log("$globalUI",globalUI);

  return (
      <div className={classes.drawer}>
        {/*note: tabs at the top here */}
        {/*<div className={classes.toolbar}>*/}
        {/*  /!*<Tabs*!/*/}
        {/*  /!*    value={tabs.indexOf(props.filter)}*!/*/}
        {/*  /!*    onChange={(e, i) => props.onFilterChange(tabs[i])}*!/*/}
        {/*  /!*    indicatorColor="primary"*!/*/}
        {/*  /!*    textColor="primary"*!/*/}
        {/*  /!*    variant="fullWidth"*!/*/}
        {/*  /!*    className={classes.tabs}*!/*/}
        {/*  /!*    classes={{flexContainer: classes.tabsFlexContainer}}*!/*/}
        {/*  /!*>*!/*/}
        {/*  /!*  /!*<Tab label="Active" classes={{ root: classes.tabRoot }} />*!/*!/*/}
        {/*  /!*  /!*<Tab label="Completed" classes={{ root: classes.tabRoot }} />*!/*!/*/}
        {/*  /!*  <Tab label="All" classes={{ root: classes.tabRoot }}/>*!/*/}
        {/*  /!*</Tabs>*!/*/}
        {/*</div>*/}

        {/*testing*/}
        {/*<Player  id={control.id} play={control.play}/>*/}

        <Profile user={globalUI.user}/>
        <Divider />
        <div>
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

          <List>
            {transitions.map(({item, props: {y, ...rest}, key}, index) => (
                <animated.div
                    key={key}
                    className="card"
                    // style={{ zIndex: data.length - index, transform: y.interpolate(y => `translate3d(0,${y}px,0)`), ...rest }}
                    style={{transform: y.interpolate(y => `translate3d(0,${y}px,0)`), ...rest}}
                >
                  {/*<Node item={item}/>*/}
                  <NodeBasic item={item}/>
                </animated.div>
            ))}
          </List>

          {/*{transitions.map(({ item, props: { y, ...rest }, key }, index) => (*/}
          {/*    <animated.div*/}
          {/*        key={key}*/}
          {/*        class="card"*/}
          {/*        style={{transform: y.interpolate(y => `translate3d(0,${y}px,0)`), ...rest}}*/}
          {/*    >*/}
          {/*      <ListItem*/}
          {/*          button*/}
          {/*          key={item.id}*/}
          {/*          onClick={() => setSelect(item)}*/}
          {/*          style={{border:"1px #00000036 solid", borderRadius:"5px"}}*/}
          {/*      >*/}
          {/*        <Typography*/}
          {/*            variant="subtitle1"*/}
          {/*            color={item.selected ? 'secondary' : 'textPrimary'}*/}
          {/*        >*/}
          {/*          {item.name} - <span style={{fontSize:"10px"}}>{item.data.length}</span>*/}
          {/*          /!*testing: disabled*!/*/}
          {/*          /!*<ChipsArray chipData={item.genres}></ChipsArray>*!/*/}
          {/*        </Typography>*/}
          {/*      </ListItem>*/}
          {/*    </animated.div>*/}
          {/*))}*/}

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
        </div>
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
