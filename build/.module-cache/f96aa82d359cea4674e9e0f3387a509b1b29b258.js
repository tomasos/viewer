/** @jsx React.DOM */
var request = superagent;
var View = React.createClass({displayName: 'View',
    render: function() {
	return (
		React.DOM.div(null, 
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
	var views = this.state.data.map(function (view) {
	    return View( {data:view} );
	});
	return (
	    React.DOM.div( {style:"height: 400px;"}, 
		views
	    )
	);
    }
});

React.renderComponent(
	ViewList(null ),
    document.getElementById('content')
);
