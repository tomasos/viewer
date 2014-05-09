/** @jsx React.DOM */

var View = React.createClass({displayName: 'View',
    render: function() {
	return (
		React.DOM.div(null, 
		React.DOM.img( {src:""})
		)
	);
    }
});



var ViewList = React.createClass({displayName: 'ViewList',
    render: function() {
	var views = this.props.data.map(function (view) {
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
