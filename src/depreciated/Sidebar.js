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
import {familyColors} from './families'
//import {NODES_STATE_VAR} from './alasql/withApolloProvider'


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

function Sidebar(props) {
  /**
   * I have just no idea what I was doing in here
   * looks like at some point I was using a proper 'Drawer' component
   * but then got sidetracked into...something else
   * - exported with drawer-like styles
   * - looks like I took the todos example for react-use-database and shoved it in here
   *
   */

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

  const [globalState, dispatch] = useContext(Context);
  let control = Control.useContainer()

  //todo: getting node.data array mutation to NOT render the entire array each time

  //transitions => useTransition (to display the nodes themselves) evaluates globalState.node and
  //intelligently adds/removes items without re-rendering. but not the node's data
  //i've wasted a lot of time on this...

  //1) first thought it was the way I was handling the data - maybe reducer was destroying references
  //that react needed in order to prevent redraw of unchanged items. did SOMETHING to reducer regarding this
  //but I'm not sure that was ever even a problem

  //2 looked at 'is it just the images' like maybe they kept needing a millisecond to reload and we're being browser cached?
  //don't think this is it either

  //3) tried abstracting and memoing a single data object on the node

  //test data

  var ex = {"external_urls":{"spotify":"https://open.spotify.com/artist/07d5etnpjriczFBB8pxmRe"},"followers":{"href":null,"total":320048},"genres":[{"id":6,"name":"hip hop","family_id":4,"family_name":"hip hop"},{"id":23,"name":"rap","family_id":4,"family_name":"hip hop"},{"id":50,"name":"neo soul","family_id":5,"family_name":"r&b"},{"id":162,"name":"underground hip hop","family_id":4,"family_name":"hip hop"},{"id":643,"name":"alternative r&b","family_id":5,"family_name":"r&b"},{"id":1118,"name":"chicago rap","family_id":4,"family_name":"hip hop"},{"id":1184,"name":"indie soul","family_id":null,"family_name":null}],"href":"https://api.spotify.com/v1/artists/07d5etnpjriczFBB8pxmRe","id":"07d5etnpjriczFBB8pxmRe","images":[{"height":640,"url":"https://i.scdn.co/image/44b2af225e5a8f0c215965d542e8ab9d00311b5f","width":640},{"height":320,"url":"https://i.scdn.co/image/bf22986c64f734e4afc5f399213ccaaea6b24cdf","width":320},{"height":160,"url":"https://i.scdn.co/image/ad9f49a3937cea57380538a9d84d726163638e05","width":160}],"name":"BJ The Chicago Kid","popularity":69,"type":"artist","uri":"spotify:artist:07d5etnpjriczFBB8pxmRe","familyAgg":"hip hop","followed":true,"source":"saved","tableData":{"id":0,"checked":true},"width":50,"height":150}
  var ex2 = {"external_urls":{"spotify":"https://open.spotify.com/artist/07d5etnpjriczFBB8pxmRe"},"followers":{"href":null,"total":320048},"genres":[{"id":6,"name":"hip hop","family_id":4,"family_name":"hip hop"},{"id":23,"name":"rap","family_id":4,"family_name":"hip hop"},{"id":50,"name":"neo soul","family_id":5,"family_name":"r&b"},{"id":162,"name":"underground hip hop","family_id":4,"family_name":"hip hop"},{"id":643,"name":"alternative r&b","family_id":5,"family_name":"r&b"},{"id":1118,"name":"chicago rap","family_id":4,"family_name":"hip hop"},{"id":1184,"name":"indie soul","family_id":null,"family_name":null}],
    "href":"https://api.spotify.com/v1/artists/07d5etnpjriczFBB8pxmRe",
    // "id":"07d5etnpjriczFBB8pxmRe",
    //fake it
    "id":"97d5etnpjriczFBB8pxmRe",
    "images":[{"height":640,"url":"https://i.scdn.co/image/44b2af225e5a8f0c215965d542e8ab9d00311b5f","width":640},
      {"height":320,"url":"https://i.scdn.co/image/bf22986c64f734e4afc5f399213ccaaea6b24cdf","width":320},
      {"height":160,"url":"https://i.scdn.co/image/ad9f49a3937cea57380538a9d84d726163638e05","width":160}],
    "name":"BJ The Chicago Kid","popularity":69,"type":"artist","uri":"spotify:artist:07d5etnpjriczFBB8pxmRe","familyAgg":"hip hop","followed":true,
    "source":"saved","tableData":{"id":0,"checked":true},"width":50,"height":150}

  var fakeItems = [{images:[{url:airplane}]},
    {images:[{url:girl}]}];

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


  //-------------------------------------------------------
  // trying with just basic css transitions, it is even more clear that the issue
  //lies in the rerender that must occur when I am actively using the props.item

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

  function NodeTransGroup(props){
    useEffect(() => {
      console.log("componentDidMount | NodeTransGroup");

      return function cleanup() {
        console.log("componentWillUnmount | NodeTransGroup");
      };
    });

    //const [state, setState] = useState({items:[]});
    //note: if NodeTransGroup ISN'T keeping track of its own state than the transition bit doesn't work!?
    //this is the fuckery - why it it okay for transitions but not here?
    const [state, setState] = useState({items:[]});

    function handleAdd() {
      const newItems = state.items.concat([ex]);
      setState({items: newItems});
    }

    useEffect(() => {
      //note: this is firing twice on every new item add??
      console.log("componentDidMount-NodeTransGroup");

      return function cleanup() {
        // console.log("componentWillUnmount");
      };
    },[]); //[props.item.data]


    return (
        <div className="cell">
          <div className="details" style={{backgroundImage: props.item.css}}>
            {props.item.name}
            <button onClick={handleAdd}>Add Item</button>
            <div style={{display:"flex"}} >
              <CSSTransitionGroup
                  transitionName="example"
                  transitionEnterTimeout={500}
                  transitionLeaveTimeout={300}>
                {/*{state.items.map((item,i) => (*/}
                {/*    <div key={i} style={{marginLeft:"-1em"}}>*/}
                {/*      <img style={{height:"5em"}} src={fakeItems[i].images[0].url}/>*/}
                {/*    </div>*/}
                {/*))}*/}
                {props.item.data.map((item,i) => (
                    <div key={i} style={{marginLeft:"-1em"}}>
                      <img style={{height:"5em"}} src={item.images[0].url}/>
                    </div>
                ))}
              </CSSTransitionGroup>
            </div>
          </div>
        </div>
        //todo: these were probably fine but fuck'em for now
        // <div className="cell">
        //   <div className="details" style={{backgroundImage: item.css}}>
        //     <img style={{height:"100%"}} src={item.images[0].url}/>
        //     <div>{item.id}</div>
        //   </div>
        // </div>
    )
  }

  //note: this was an attempt to get the same react-spring animation working on item adds, but redraws whole thing
  //I was originally thinking that I needed to redo how the reducer works -
  //that it was a lost-reference issue, but don't think I ever came to a conclusion regarding that...

  //also not sure why I call these nodes??
  function Node(props){

    function getDim(n){
      n.width = 50;
      n.height = 150;
    }

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
      //console.log("$sub",data);
      //return data.map((data) => ({ ...data, x: (width += data.width) - data.width }))
      return data.map((data) => ({ ...data, x: (width += data.width) - data.width }))
    }

    //-------------------------------------------
    //local only works perfectly - minus a little glitch that happens only sometimes.
    // I think this makes sense b/c I'm not going to see a re-render of the entire component on every item add
    // ...so I try to prevent Node re-render on props.item change, but instead take
    //care of what needs to happen myself by manipulating my local state based on the value changed?


    getDim(ex); getDim(ex2);

    const [items, setItems] = useState([]);

    function handleAdd(c) {
      const newItems = (c === 1 ?  items.concat([ex]): items.concat([ex2]))
      setItems(newItems);
    }

    useEffect(() => {
      //note: this is firing twice on every new item add??
      console.log("componentDidMount-Node");
      // setItems(props.item.data)

      //maybe if I was reserving the previous values (tested with local one)...nope
      //setItems([...items,ex2])

      return function cleanup() {
        // console.log("componentWillUnmount");
      };
    },[]); //[props.item.data]

    //-------------------------------------------
    //maybe if I was controlling the items fed to getItems in transitions with local state
    //based on the changes that are happening to props.item.data - it would work...nope

    // const [items, setItems] = useState(props.item.data);
    //
    // useEffect(() => {
    //   console.log("componentDidMount-Node");
    //   // setItems(props.item.data)
    //
    //   //maybe if I was reserving the previous values (tested with local one)...nope
    //   //setItems([...items,ex])
    //
    //   return function cleanup() {
    //     // console.log("componentWillUnmount");
    //   };
    // },[]); //[props.item.data]


    //-------------------------------------------

    let height = 0
    let width = 0
    const transitions = useTransition(
        getItems(props.item.data),
        //testing: local only
        //getItems(items),
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
            {/*testing: local only*/}
            {/*<button onClick={() =>{handleAdd(1)}}>Add 1</button>*/}
            {/*<button onClick={() =>{handleAdd(2)}}>Add 2</button>*/}
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

        {/*<Profile user={globalUI.user}/>*/}
        <Divider />
        <div>

          {/*todo: should just be passing 'agg'*/}
          <Pie data={_.find(globalState.node,{name:'agg'})['data'] || []}></Pie>



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
                  {/*<NodeTransGroup item={item}/>*/}

                  <NodeBasic item={item}/>
                </animated.div>
            ))}
          </List>
        </div>
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
