/** @jsx React.DOM */
var request = superagent;
var View = React.createClass({displayName: 'View',
    render: function() {
	return (
		React.DOM.div( {className:"image"}, 
		React.DOM.img( {src:this.props.view.data.url}),
		React.DOM.a(null, this.props.view.data.title)
		)
	);
    }
});

var ViewRow = React.createClass({displayName: 'ViewRow',
    render: function() {
	// var views = this.props.group.map(function (view) {
	//     return (<View view={view} />);
	// });
	
	return (
		React.DOM.div( {className:"row"}, 
		"// ", views
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
	    groups[i] += view;
	});
	
	var rows = groups.map(function (group) {
	    return (ViewList( {group:group} ));
	});
			      
	return (
	    React.DOM.div(null, 
		rows
	    )
	);
    }
});

React.renderComponent(
	ViewList(null ),
    document.getElementById('content')
);
