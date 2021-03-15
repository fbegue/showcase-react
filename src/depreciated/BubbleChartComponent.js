import React, {useContext, useState,useEffect} from 'react';
import DiscreteSlider from "../Slider";
import MaterialTable from "material-table";
import ChipsArray from "../ChipsArray";
import api from "../api/api";
import {Context, initUser} from "../storage/Store";
import {StatControl,Control} from "../index";
import {useReactiveVar} from "@apollo/react-hooks";
import {GLOBAL_UI_VAR} from "../storage/withApolloProvider";
import BubbleChart from "./BubbleChart";
import {families,familyColors} from "../families";
import _ from "lodash";
import * as d3 from "d3";
const uuid = require('react-uuid')


function Social(props) {

	const [globalState, globalDispatch] = useContext(Context);
	const globalUI = useReactiveVar(GLOBAL_UI_VAR);
	let control = Control.useContainer();
	let statcontrol = StatControl.useContainer();

	//todo:
	const [term, setTerm] = useState('medium');

	//testing: not being sent yet
	var guest = {id:123028477,name:"Dan"};

	function setStatic(){
		api.fetchStaticUser()
			.then(r =>{
				initUser(guest);
				globalDispatch({type: 'init', user:guest,payload:r[0].data,context:'artists'});
			},err =>{
				console.log(err);
			})
	}

	var handleSelectGuest = function(rows){
		//here I'm just accessing the 'checked' rows directly later, so null payload here
		//console.log("selected",rows.length);
		globalDispatch({type: 'select', payload:null,user: globalUI.user,context:'artists',control:control,stats:statcontrol});

	}

	function getSrc(item){
		var ret = false;
		item.owner.images[0] ? ret= item.owner.images[0].url:{}
		return ret;
	}

	// const d = [
	// 	{ id: 1, name: 'React', size: 350, fillColor: '#D3D3D3' },
	// 	{ id: 2, name: 'TypeScript', size: 100, fillColor: '#9d9a9f' },
	// 	{ id: 3, name: 'SCSS', size: 75, fillColor: '#605f62' },
	// 	{ id: 4, name: 'Recoil', size: 150, fillColor: '#D3D3D3' },
	// 	{ id: 5, name: 'Redux', size: 150, fillColor: '#D3D3D3' },
	// 	{ id: 6, name: 'Material-UI', size: 125, fillColor: '#c6c5c6' },
	// 	{ id: 7, name: 'Router', size: 230, fillColor: '#808080' },
	// 	{ id: 8, name: 'Jest', size: 70, fillColor: '#C0C0C0' },
	// 	{ id: 9, name: 'Enzym', size: 70, fillColor: '#C0C0C0' },
	// 	{ id: 10, name: 'Sinon', size: 70, fillColor: '#C0C0C0' },
	// 	{ id: 11, name: 'Puppeteer', size: 70, fillColor: '#C0C0C0' },
	// 	{ id: 12, name: 'ESLint', size: 50, fillColor: '#A9A9A9' },
	// 	{ id: 13, name: 'Prettier', size: 60, fillColor: '#A9A9A9' },
	// 	{ id: 14, name: 'Lodash', size: 70, fillColor: '#DCDCDC' },
	// 	{ id: 15, name: 'Moment', size: 80, fillColor: '#DCDCDC' },
	// 	{ id: 16, name: 'Classnames', size: 90, fillColor: '#DCDCDC' },
	// 	{ id: 17, name: 'Serve', size: 100, fillColor: '#DCDCDC' },
	// 	{ id: 18, name: 'Snap', size: 150, fillColor: '#DCDCDC' },
	// 	{ id: 19, name: 'Helmet', size: 150, fillColor: '#DCDCDC' },
	// ]

	const radiusScale = (value) => {
		const fx = d3.scaleSqrt().range([1, 50]).domain([1,150])
		return fx(value)
	}

	var d = [];
	families.forEach(f =>{
		d.push({id:uuid(),name:f,size:50,radius:radiusScale(100),fillColor:familyColors[f]})
	})



	const [data, setData] = React.useState(d)
	//const [data, setData] = React.useState([])
	const [trigger, setTrigger] = React.useState(false)

	const changeData = () => {
		setData(function(oldData, props) {
			d.forEach(r =>{ r.name !== 'hip hop' ? r.size =50:{} })
			console.log("newData",oldData);
			return d
		});
	}
	const st = () => {
		console.log("setTrigger");
		setTrigger(true)
	}


	useEffect(() => {
		var map = {}
		//var data = []
		if(trigger){
			//console.log("globalState",globalState);
			globalState[guest.id + "_artists"].filter(i =>{return i.term === term})
				.forEach(a =>{
					if(a.familyAgg && a.familyAgg !== null) {
						if (!map[a.familyAgg]) {
							map[a.familyAgg] = 1
						} else {
							map[a.familyAgg]++
						}
					}})

			var newData = JSON.parse(JSON.stringify(data))
			Object.keys(map).forEach(fam =>{
				var datum = _.find(newData, function(o) { return o.name === fam });
				datum.size = map[fam] * 20
			});
			//Object.keys(map).forEach(fam =>{data.push({id:uuid(),name:fam,size:map[fam] * 10,fillColor:familyColors[fam]})});
			console.log("new data",newData);
			setData(newData)
		}

	},[trigger,term]);

	useEffect(() => {

	},[term]);


	const selectedKeyHandler = (key) => {
		// eslint-disable-next-line no-alert
		alert(key)
	}

	const handleHover = (key) => {
		console.log("handleHover",key);
		// eslint-disable-next-line no-alert
	}

	return(
		<div>

				<button onClick={changeData}>changeData</button>
				<button onClick={st}>trigger</button>
				<div style={{display:"flex"}}>
					<div>
						<BubbleChart bubblesData={data} width={400} height={300} textFillColor="drakgrey" backgroundColor="#ffffff" minValue={1} maxValue={150}
									 handleHover={handleHover} selectedCircle={selectedKeyHandler} />
					</div>
				</div>
		</div>)
}
export default Social;
