/** @jsx React.DOM */

var viewList = React.createClass({displayName: 'viewList',
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
	React.DOM.h1(null, "Viewer"),
    document.getElementById('content')
);
