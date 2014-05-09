/** @jsx React.DOM */
var request = superagent;
var View = React.createClass({displayName: 'View',
    render: function() {
	return (
		React.DOM.div( {className:"image"}, 
		React.DOM.img( {src:this.props.data.data.url}),
		React.DOM.a(null, this.props.data.data.title)
		)
	);
    }
});

var ViewList = React.createClass({displayName: 'ViewList',
    getInitialState: function () {
	return {data: []};
    },
    componentWillMount: function () {
	request
	    .get('http://www.reddit.com/r/aww/hot.json')
	    .end(function (res) {
		this.setState({data: res.body.data.children});
	    }.bind(this));
    },
    
    render: function() {
	var groups = [[]];
	var i = 0;
	this.state.data.map(function (view, index) {
	    if (index % 5 == 0) i++;
	    groups[i] += View( {data:view} );
	});
	console.log(groups);
	var views = groups.map(function (group) {
	    return (React.DOM.div( {className:"row"}, group));
	});
			      
	return (
	    React.DOM.div(null, 
		views
	    )
	);
    }
});

React.renderComponent(
	ViewList(null ),
    document.getElementById('content')
);
