import React, {useState,useEffect} from 'react';
import {familyColors,familyGenre_map,genreFam_map} from "../families";
import DiscreteSlider from "../Slider";
import {VictoryPie} from "victory";
import List from "@material-ui/core/List";
import {animated, useTransition} from "react-spring";


function Main(props) {
	const [term, setTerm] = useState(null);
	const [pieData, setPieData] = useState([]);

	useEffect(() => {
		console.log("componentDidMount");
		var data = [];
		var map = {}
		props.data.filter(i =>{return i.term === term})
			.forEach(at =>{
				//todo: shouldn't have nulls here
				if(at.familyAgg !== null){
					if(!map[at.familyAgg]){map[at.familyAgg] = 1}
					else{map[at.familyAgg]++}
				}
			})
		Object.keys(map).forEach(fam =>{data.push({x:fam,y:map[fam]})})
		console.log("sorted",data);
		setPieData(data)
	},[term]);

	console.log("init | waiting to trigger render...");
	props.data.length > 0 && !(term) ? setTerm('short'):{};

	//--------------------------------------------------------------
	 let height = 0
	function getNodes(){
		console.log('Home | getNodes | props.data',props.data);
		//todo: make sure to guarantee order every time

		//console.log("getNodes",globalState.node.filter(n => n.data.length > 0))
		props.data.filter(i =>{return i.term === term}).forEach(n =>{n.height =10})
		return props.data.filter(i =>{return i.term === term}).map((data, i) => ({ ...data, y: (height += data.height) - data.height }))
	}

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

	return(
		<div>
			<div style={{display:"flex"}}>
				{/*<div style={{flexGrow:"1"}}></div>*/}
				{/*<DiscreteSlider handleChange={(v) =>{setTerm(v)}}/>*/}
				<div>
					<DiscreteSlider defaultValue={2}  handleChange={(v) =>{setTerm(v)}}/>
					<VictoryPie
						data={pieData}
						padAngle={2}
						innerRadius={80}
						animate={{
							duration: 2009, easing: "linear"
						}}
						style={{
							data: {
								fill: (d) => familyColors[d.slice.data.x]
							}
						}}
					/>
				</div>
				<div>
					<List>
						{transitions.map(({item, props: {y, ...rest}, key}, index) => (
							<animated.div
								key={key}
								className="card"
								// style={{ zIndex: data.length - index, transform: y.interpolate(y => `translate3d(0,${y}px,0)`), ...rest }}
								style={{transform: y.interpolate(y => `translate3d(0,${y}px,0)`), ...rest}}
							>
								<span>{item.id}</span>
							</animated.div>
						))}
					</List>

				</div>
			</div>
		</div>)
}
export default Main;
