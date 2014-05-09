/** @jsx React.DOM */
var request = superagent;
var View = React.createClass({displayName: 'View',
    render: function() {
	return (
		React.DOM.div(null, 
		React.DOM.img( {src:this.props.data.img})
		)
	);
    }
});



var ViewList = React.createClass({displayName: 'ViewList',
    getInitialState: function () {
	return {data: [{img: 'http://web-mode.org/images/emacs-django.png'}]};
    },
    componentWillMount: function () {
	request.get('http://www.reddit.com/r/bergen/hot.json').end(function (res) {
	    // this.setState({data: res});
	}).bind(this);
    },
    
    render: function() {
	var views = this.state.data.map(function (view) {
	    return View( {data:view} );
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
