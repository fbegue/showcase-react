import React from 'react'
import * as d3 from 'd3'
import { Simulation, SimulationNodeDatum } from 'd3-force'
// import './BubbleChart.scss'
import { Button } from '@material-ui/core'
//import { Types } from './types'

const uuid = require('react-uuid')

var forceData = [];

var simulation = null;

class BubbleChartD3 extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
        }
        this.forceData = this.setForceData(props)
    }

    componentDidMount() {
        this.animateBubbles()
    }

    componentDidUpdate(prevProps, prevState) {
        if (JSON.stringify(prevProps.bubblesData) !== JSON.stringify(this.props.bubblesData)) {
            this.forceData = this.setForceData(this.props)
            this.animateBubbles()
        }
    }

    setForceData = ( props ) => {
        const d = []
        for (let i= 0; i < props.bubblesData.length; i++) {
            d.push({ 'size': props.bubblesData[i].size })
        }
        return d
    }

    animateBubbles = () => {
        if (this.props.bubblesData.length > 0) {
            this.simulatePositions(this.forceData)
        }
    }

    radiusScale = (value) => {
        const fx = d3.scaleSqrt().range([1, 50]).domain([this.props.minValue, this.props.maxValue])
        return fx(value)
    }

    sizeGrav = (d) =>{
        // console.log("size",d);
        if(this.props.bubblesData[d.index].name === "rock"){
            console.log("rock!");
            return .5
        }else{
            console.log(d.size * .1);
            // return d.size * .1
            return 0
        }

    }

    charge(d) {
        return Math.pow(d.radius, 2.0) * 0.01
    }
    simulatePositions = (data) => {
        const centre = { x: this.props.width/2, y: this.props.height/2 };
        const forceStrength = 0.03;
        this.simulation = d3.forceSimulation()
            .nodes(data)
            .force('charge', d3.forceManyBody().strength(1))
             .force('y', d3.forceY().strength(this.sizeGrav).y(150))
            //.force('collide', d3.forceCollide().radius(d => d.radius + 20))
            .force(
                'collide',
                d3.forceCollide((d) => {
                    return this.radiusScale(d.size) + 2
                })
            )
            // .force("link", d3.forceLink())

            // this.simulation = d3
            //     .forceSimulation()
            //     .nodes(data)
            //     // .velocityDecay(0.45)
            //     .force('x', d3.forceX().strength(0.4))
            //     .force('y', d3.forceY(.5).strength(this.sizeGrav))
                 // .force('y', d3.forceY(1).strength(this.sizeGrav))
                // .force(
                //     'collide',
                //     d3.forceCollide((d) => {
                //         return this.radiusScale(d.size) + 2
                //     })
                // )
            .on('tick', () => {
                this.setState({ data })
            })
    }

    renderBubbles = (data) => {
        return data.map((item,index) => {
            const { props } = this
            const fontSize = this.radiusScale(item.size) / 4
            const content = props.bubblesData.length > index ? props.bubblesData[index].name : ''
            const strokeColor = props.bubblesData.length > index ? 'darkgrey' : this.props.backgroundColor
            return (
                <g key={`g-${uuid()}`} transform={`translate(${props.width / 2 + item.x - 70}, ${props.height / 2 + item.y})`}>
                    <circle
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                            this.props.selectedCircle(content)
                        }}
                        onMouseEnter={() => props.handleHover('enter')}
                        onMouseLeave={() => props.handleHover('leave')}
                        id="circleSvg"
                        r={this.radiusScale(item.size)}
                        fill={props.bubblesData[index].fillColor}
                        stroke={strokeColor}
                        strokeWidth="2"
                    />
                    <text
                        onClick={() => {
                            this.props.selectedCircle(content)
                        }}
                        dy="6"
                        className="bubbleText"
                        fill={this.props.textFillColor}
                        textAnchor="middle"
                        fontSize={`${fontSize}px`}
                        fontWeight="normal"
                    >
                        {content}
                    </text>
                </g>
            )
        })
    }

    render() {
        return (
            <div>
                <Button
                    className="buttonFixed"
                    variant="contained"
                    color="default"
                    onClick={() => {
                        this.animateBubbles()
                    }}
                >
                    Animate
                </Button>

                <div aria-hidden="true" id="chart" style={{ background: this.props.backgroundColor, cursor: 'pointer' }}>
                    <svg width={this.props.width} height={this.props.height}>
                        {this.renderBubbles(this.state.data)}
                    </svg>
                </div>
            </div>
        )
    }
}

// interface IBubbleChartProps {
//   bubblesData: Types.Data[]
//   width: number
//   height: number
//   backgroundColor: string
//   textFillColor: string
//   minValue: number
//   maxValue: number
//   selectedCircle: (content: string) => void
// }
//
// interface IBubbleChartState {
//   data: Types.ForceData[]
// }

export default BubbleChartD3
