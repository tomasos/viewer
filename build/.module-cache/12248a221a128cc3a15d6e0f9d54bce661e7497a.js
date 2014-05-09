/** @jsx React.DOM */
var request = superagent;

var Modal = React.createClass({displayName: 'Modal',
    render: function() {
	return ( React.DOM.div( {className:"modal hide fade"}, 
		 React.DOM.div( {className:"modal-body"}, 
		 React.DOM.img( {src:this.props.view.data.url})
		 )
		 )
	       );
    }
});


var View = React.createClass({displayName: 'View',
    handleClick: function() {
	var id = this.props.view.data.id;
	this.props.onClick(id);
    },
    
    render: function() {
	return (
		React.DOM.div( {className:"image"}, 
		
		React.DOM.img( {onClick:this.handleClick, key:this.props.view.data.id, src:this.props.view.data.thumbnail})
		
		)
	);
    }
});

var ViewRow = React.createClass({displayName: 'ViewRow',
    handleClick: function(id) {
	this.props.onClick(id);
    },
    render: function() {
	var views = this.props.group.map(function (view) {
	    return View( {onClick:this.handleClick, view:view} );
	});
	
	return (
		React.DOM.div( {className:"row"}, 
		views
		)
	);
    }
});


var ViewList = React.createClass({displayName: 'ViewList',
    getInitialState: function () {
	return {
	    data: [],
	    currentView: {}
	};
    },
    componentWillMount: function () {
	request
	    .get('http://www.reddit.com/r/aww/hot.json')
	    .end(function (res) {
		this.setState({data: res.body.data.children,
			      currentView: res.body.data.children[0]});
	    }.bind(this));
    },

    clickHandler: function(id) {
	var current = this.state.data.filter(function (element) {
	    return element.data.id == id;
	    });
	this.setState({currentView: current});
    },
    
    render: function() {
	var groups = [[]];
	var i = 0, j = 5;
	
	for (var k = 0; k < this.state.data.length; k +=5) {
	    groups[i] = this.state.data.slice(j, j+5);
	    i++;
	    j += 5;
	}

	var rows = groups.map(function (group) {
	    return ViewRow( {onClick:this.clickHandler, group:group} );
	});
			      
	return (
		React.DOM.div(null, 
		rows,
		Modal( {view:this.state.currentView} )
		)
	);
    }
});

React.renderComponent(
	ViewList(null ),
    document.getElementById('content')
);
