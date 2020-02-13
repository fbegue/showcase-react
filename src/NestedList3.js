import React, { useState, useEffect } from 'react';

class NodeView extends React.Component {
	constructor(props) {
		super(props);
	}

	handleClick = (e) => {
		e.stopPropagation();
		this.props.onNodeToggle(this.props.path);
	}

	handleChecked  = (e) => {
		this.props.onNodeChecked(this.props.path);
	}

	/**
	 * if the node contains children, renders a folder icon, if it is expanded renders an openfolder icon
	 * @param {boolean} isParent contains children or not
	 * @param {boolean} isExpanded the expanded state of this node
	 * @return {JSX.Element} the JSX of the rendered icon
	 */
	renderIcon(isParent, isExpanded) {
		if (isParent && isExpanded) {
			return (
				<span
					className="glyphicon glyphicon-folder-open"
					aria-hidden="true">
            </span>);
		} else if (isParent && !isExpanded) {
			return (
				<span
					className="glyphicon glyphicon-folder-close"
					aria-hidden="true">
            </span>);
		}

		return (
			<span
				className="glyphicon glyphicon-file node-view__file-icon"
				aria-hidden="true">
          </span>);
	}

	/**
	 * if the node contains children and is collapsed renders a plus icon
	 * @param {boolean} isParent contains children or not
	 * @param {boolean} isExpanded the expanded state of this node
	 * @return {JSX.Element} the JSX of the rendered icon
	 */
	renderArrowIcon(isParent, isExpanded) {
		if (!isParent) {
			return null;
		}

		if (isExpanded) {
			return (
				<span
					className="glyphicon glyphicon-minus node-view__folder-ctrl"
					aria-hidden="true"
					onClick={this.handleClick}
				>
            </span>);
		}

		return (
			<span
				className="glyphicon glyphicon-plus node-view__folder-ctrl"
				aria-hidden="true"
				onClick={this.handleClick}
			>
          </span>);
	}

	/**
	 * Renders the children of this element of the source object
	 * @param {object[]} items children objects of the source data structure
	 * @param {string} path array of indexes to get to this node
	 * @return {JSX.Element} a recursive JSX structure that contains children of children
	 */
	renderChildren(children, path) {
		const { isPathExpanded, isNodeChecked, onNodeToggle, onNodeChecked } = this.props;
		return (
			<ul>{children.map((item, i) => {
				let newPath = null;
				if (path) {
					newPath = [...path, i];
				}

				return (
					<NodeView
						node={item}
						key={i}
						path={newPath}
						checked={isNodeChecked(newPath)}
						expanded={isPathExpanded(newPath)}
						isPathExpandisNodeCheckeded={isPathExpanded}
						isNodeChecked={isNodeChecked}
						onNodeToggle={onNodeToggle}
						onNodeChecked={onNodeChecked}
					/>);
			})}
			</ul>);
	}

	render() {
		const { node, path, expanded, checked } = this.props;
		const isFolder = node.children && node.children.length > 0;
		const nodeIcon = this.renderIcon(isFolder, expanded);
		const arrowIcon = this.renderArrowIcon(isFolder, expanded);

		return (
			<li className="node-view__node">
				{arrowIcon}
				{nodeIcon}
				<input type="checkbox" className="node-view__check" checked={checked} onChange={this.handleChecked} />
				<div className="node-view__label">
					{node.label}
				</div>

				{isFolder && expanded && this.renderChildren(node.children, path)}
			</li>
		);
	}
}


export default class TreeView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			nodeState: {}
		};
	}

	/**
	 * returns true if the children of this NodeView are expanded, if there is no key in the state returns true
	 * @param {string} path array of indexes to get to this node
	 * @return {boolean} this branch is expanded or not
	 */
	isPathExpanded = (path) => {
		const { nodeState } = this.state;
		// if it is undefined assume that is expanded
		if (nodeState[path] === undefined) {
			return true;
		}
		return nodeState[path].expanded;
	}

	isNodeChecked = (path) => {
		const { nodeState } = this.state;
		// if it is undefined assume that is not checked
		if (nodeState[path] === undefined) {
			return false;
		}
		return nodeState[path].checked;
	}

	/**
	 * Toggles the expanded state of a node
	 * @param {string} path array of indexes to get to this node
	 */
	handleExpandToggle = (path) => {
		const isExpanded = this.isPathExpanded(path);
		const oldState = this.state.nodeState;
		const oldNodeState = this.state.nodeState[path] || { checked: false, expanded: true };
		const newNodeState = { checked: oldNodeState.checked, expanded: !isExpanded };
		this.setState({
			nodeState: { ...oldState, [path]: newNodeState }
		});
	}

	handleCheckToggle = (path) => {
		const oldState = this.state.nodeState;
		const oldNodeState = this.state.nodeState[path] || { checked: false, expanded: true };
		const newNodeState = { checked: !oldNodeState.checked, expanded: oldNodeState.expanded };
		this.setState({
			nodeState: { ...oldState, [path]: newNodeState }
		});
	}

	render() {
		return (
			<ul className="node-view__root" style={this.props.style}>
				<NodeView
					node={this.props.root}
					path={[0]}
					expanded={this.isPathExpanded([0])}
					onNodeToggle={this.handleExpandToggle}
					onNodeChecked={this.handleCheckToggle}
					isPathExpanded={this.isPathExpanded}
					isNodeChecked={this.isNodeChecked}
				/>
			</ul>
		);
	}
}