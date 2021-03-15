import React, {useState, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

import 'fontsource-roboto';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
// import Panels from './Panels'
// import MapArea from './MapArea';
import './App.css'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import logo from './assets/sound_found.png'
import Store, {Context} from './storage/Store'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import RedirectPage from './RedirectPage';
//
import Player,{} from './Player'
import {Control} from './index'
import withApolloProvider from './storage/withApolloProvider';
import api from "./api/api";

//
import { GLOBAL_UI_VAR } from './storage/withApolloProvider';
import {useQuery,useReactiveVar} from "@apollo/react-hooks";
import Profile from './components/Profile'

import Map from './Map'

//import $ from "jquery"
//import {$} from './libraries/jquery.min'
//import useScript from './useScript';
//import Script from 'react-load-script'

import { Helmet } from "react-helmet";

import brace from 'brace';
import AceEditor from 'react-ace';
import ContainerDimensions from 'react-container-dimensions';
//import useAsync from './useAsync';
//import { useDB, useNormalizedApi } from './db'

import {getUserPlaylists } from './testdata/getUserPlaylists.js'

import 'brace/mode/json';
import 'brace/theme/monokai';
import Tabify from './Tabify'

import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import InboxIcon from "@material-ui/core/SvgIcon/SvgIcon";
import ListItemText from "@material-ui/core/ListItemText";

//import NestedListRecurse  from "./NestedList2"
// var NestedListRecurse = require("./NestedList2").default

//import TreeView  from "./NestedList3"
import EventsList from './EventsList'
//import alasqlAPI from "./alasql";
//import alasql from "alasql";

import SpotifyWebApi from 'spotify-web-api-js';
import {makeVar} from "@apollo/client";
const spotifyApi = new SpotifyWebApi();


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

// function TestComp(props) {
//     let control = Control.useContainer();
//     //const [state, dispatch] = useContext(Context);
//     useEffect(() => {
//         console.log("componentDidMount");
//
//
//
//
//         //todo: endless loop
//         //confusing b/c I dont' get why this doesn't happen in Tabify then.
//         //like I would get 'you updating the state of a component that relies, so loop'
//         //but I'm missing something here...
//
//         //moving the call outside of store = "invalid attempt to destructure non-iterable instance"
//         //not to sure what that means - when I removed 'store' it was the same error but different place
//         //so maybe something to do with provider lookups?
//
//         //update: now this is going to run one time only at application mount
//         //except we're going to trigger it by setting an initial metro_id value
//         //control.selectMetro(9480)
//
//
//         // alasqlAPI.fetchEvents()
//         //     .then(r =>{
//         //         dispatch({type: 'init', payload: r,context:'events'});
//         //     },err =>{
//         //         console.log(err);
//         //     })
//         return function cleanup() {
//             console.log("componentWillUnmount");
//         };
//     },[]);
//
//     return (
//         <div>
//             <button onClick={() => control.selectMetro(1)}>
//                 Click me: {control.metro}
//             </button>
//         </div>
//     )
// }

class Delayed extends React.Component {

    constructor(props) {
        super(props);
        this.state = {hidden : true};
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({hidden: false});
        }, this.props.waitBeforeShow);
    }

    render() {
        return this.state.hidden ? '' : this.props.children;
    }
}

Delayed.propTypes = {
    waitBeforeShow: PropTypes.number.isRequired
};

function App(props) {

    useEffect(() => {
        console.log("APP | componentDidMount");
        // Update the document title using the browser API
        //testing:
        // document.title = `You clicked ${count} times`;
        return function cleanup() {
            console.log("APP | componentWillUnmount");
        };
    });


    const { classes } = props;
    let [filter, setFilter] = useState('active');
    let [selectedTodoId, setSelectedTodoId] = useState();
    let control = Control.useContainer()

    const globalUI = useReactiveVar(GLOBAL_UI_VAR);
    console.log("APP | globalUI ",globalUI);



    useEffect(() => {
        var newTime = null;
        const interval = setInterval(() => {
            //todo: yeaaaaaaahh
            //so basically: first time interval check = use stored value
            //as soon as we expire for the first time, we switch to using
            //the now forever updated newTime

            var diff = 0;

            if(!(newTime)){
               // console.log('Checking expiryTime...',globalUI.expiryTime);
                diff = Math.abs(new Date() - new Date(globalUI.expiryTime));
            }else{
               // console.log('Checking newTime...',newTime);
                diff = Math.abs(new Date() - new Date(newTime));
            }

            //testing: every 20s
            // var threshold = 3580*1000;
            //when there is 15s left
            var threshold = 15*1000;
            //console.log({diff});

            if(diff < threshold){
                console.log("token is about to expire. refreshing...");
                api.refreshAuth(globalUI.refresh_token)
                    .then(r =>{
                        //console.log("refreshAuth result",r)

                        //only need to refresh the access_token value
                        console.log("previous GLOBAL_UI_VAR",globalUI);
                        const params = JSON.parse(localStorage.getItem('params'));
                        localStorage.setItem('params', JSON.stringify({access_token:r.access_token,refresh_token:params.refresh_token,user:params.user}));
                        const expiryTime = new Date(new Date().getTime() + 3600 * 1000);
                        localStorage.setItem('expiryTime', expiryTime.toISOString());

                        //todo: state set here causes rerender, but this time it will pass w/ new expiryTime
                        //this seems like a bad pattern - not sure I'm even guarantee'd sync state set here
                        //in fact as soon as this is set, we trigger rerender (console.log comes after)
                        GLOBAL_UI_VAR({...globalUI,expiryTime:expiryTime, access_token:r.access_token})
                        newTime = expiryTime;
                        console.log("refreshAuth finished");
                    }).catch(e =>{console.error(e)})
            }else{
               // console.log("APP | threshold check passed",diff);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // if(diff < threshold){
    //     console.log("token is about to expire. refreshing...");
    //     api.refreshAuth(globalUI.refresh_token)
    //         .then(r =>{
    //             //console.log("refreshAuth result",r)
    //
    //             //only need to refresh the access_token value
    //             console.log("previous GLOBAL_UI_VAR",globalUI);
    //             const params = JSON.parse(localStorage.getItem('params'));
    //             localStorage.setItem('params', JSON.stringify({access_token:r.access_token,refresh_token:params.refresh_token,user:params.user}));
    //             const expiryTime = new Date(new Date().getTime() + 3600 * 1000);
    //             localStorage.setItem('expiryTime', expiryTime.toISOString());
    //
    //             //todo: state set here causes rerender, but this time it will pass w/ new expiryTime
    //             //this seems like a bad pattern - not sure I'm even guarantee'd sync state set here
    //             //in fact as soon as this is set, we trigger rerender (console.log comes after)
    //             GLOBAL_UI_VAR({...globalUI,expiryTime:expiryTime, access_token:r.access_token})
    //
    //             console.log("refreshAuth finished");
    //         }).catch(e =>{console.error(e)})
    // }else{
    //     console.log("APP | threshold check passed");
    // }

    //todo: no idea why every variant is getting uppercased
    //https://stackoverflow.com/questions/25158435/paper-button-always-as-upper-case
    //https://material-ui.com/components/typography/
    //configing theme
    //https://material-ui.com/customization/typography/


    const muiTheme = createMuiTheme({
        typography: {
            fontFamily: [
                // '-apple-system',
                // 'BlinkMacSystemFont',
                // '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
                // '"Apple Color Emoji"',
                // '"Segoe UI Emoji"',
                // '"Segoe UI Symbol"',
            ].join(','),
            subtitle2:{  textTransform: 'none',},
            body1:{  textTransform: 'none'},
            subtitle1:{  textTransform: 'none'}
        },
        overrides: {
            MuiPaper: {
                root: {
                    textTransform:'none'
                }
            },
            MuiCardContent:{
                root: {
                   padding:"6px",
                    //not sure how to go about overriding a last-child condition
                    paddingBottom:"0px !important"
                }
            },
        }
    });

    return (
        <MuiThemeProvider theme={muiTheme}>
        <Store>

            {/*<TestComp/>*/}
            <BrowserRouter>
                <div className="main">
                    <Switch>
                        {/*<Route path="/" component={Home} exact={true} />*/}
                        <Route path="/redirect" component={RedirectPage} />
                        {/*<Route path="/dashboard" component={Dashboard} />*/}
                        {/*<Route component={NotFoundPage} />*/}
                    </Switch>
                </div>
            </BrowserRouter>
            <div>
                <div style={{position: "sticky",top: "0", padding:"1em 1em 0em 1em", borderBottom: "1px solid black", zIndex: "20",display:'flex',background:"#f0f0f0"}}>
                    <div><img style={{height:"4em"}} src={logo}/> </div>
                    <div style={{marginRight:"1em"}}><Profile user={globalUI.user}/></div>

                    {/*todo: broke this player when I set GLOBAL_UI_VAR in refreshAuth*/}
                    {/*tried to make it wait, but doesn't seem to matter. the tracing says
                    that this is caused by my GLOBAL_UI_VAR set but I can't make sense of it... */}

                    {/*{globalUI.access_token  &&*/}
                    {/*<div style={playerStyle}>*/}
                    {/*    <Player token={globalUI.access_token} id={control.id} play={control.play}/></div>*/}
                    {/*}*/}

                    {/*todo: forcing delay until I can figure it out*/}

                    <Delayed waitBeforeShow={2000}>
                        {globalUI.access_token  &&
                        <div style={control.play ? {opacity:1,flexGrow:2}: {opacity:.4,flexGrow:2}}>
                            <Player token={globalUI.access_token} id={control.id} play={control.play}/></div>
                        }
                    </Delayed>

                </div>
                <div className={classes.root} style={{display:"flex",flexDirection:"row"}}>
                    <div style={{width:"60em"}}>
                        {/*testing:*/}
                        {globalUI.access_token &&
                        <Tabify></Tabify>
                        }
                    </div>
                    <div style={{width:"30em"}}>
                        <EventsList data={[]} />
                    </div>
                </div>
            </div>
        </Store>
        </MuiThemeProvider>
    );
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withApolloProvider(App));
// export {
//     useControl
// }
