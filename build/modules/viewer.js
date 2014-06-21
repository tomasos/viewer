/** @jsx React.DOM */
var request = superagent;

var Modal = React.createClass({displayName: 'Modal',
    open: function() {
	$(this.getDOMNode()).modal('show');
    },
    close: function() {
	$(this.getDOMNode()).modal('hide');
    },
    render: function() {
	return ( React.DOM.div( {className:"modal fade"}, 
		   React.DOM.div( {className:"modal-dialog"}, 
		     React.DOM.div( {className:"modal-content"}, 
		       React.DOM.div( {className:"modal-header"}, 
		         React.DOM.h3(null, this.props.view.data.title)
		       ),
		         React.DOM.div( {className:"modal-body"}, 
		         React.DOM.img( {onClick:this.close, src:this.props.view.data.url})
		       )
		     )
		   )
		 )
	       );
    }
});


var View = React.createClass({displayName: 'View',
    handleClick: function() {
	var id = this.props.view.data.id;
	this.props.onClicked(id);
    },
    
    render: function() {
	return (
		React.DOM.div( {className:"image"}, 
  		  React.DOM.img( {onClick:this.handleClick, key:this.props.view.data.id, src:this.props.view.data.thumbnail})
		)
	);
    }
});

var SubChooser = React.createClass({displayName: 'SubChooser',
    getInitialState: function() {
	return {subs: ['aww', 'earthporn', 'adviceanimals']};
    },

    change: function() {
	this.props.subChanged($(this.refs.subSelect.getDOMNode()).val());
    },

    render: function() {
	var options = this.state.subs.map(function(opt) {
	    return React.DOM.option(null, opt);
	});
	
	return (
		React.DOM.select( {ref:"subSelect", onChange:this.change}, 
		  options
		)
	);
    }
});

var ViewRow = React.createClass({displayName: 'ViewRow',
    handleClick: function(id) {
	this.props.onClicked(id);
    },
    render: function() {
	var views = this.props.group.map(function (view) {
	    return View( {onClicked:this.handleClick, view:view} );
	}.bind(this));
	
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
	    currentView: {data: {url: ''}},
	    count: 0,
	    subreddit: 'aww',
	    lastNode: '',
	    oldSub: 'aww'
	};
    },

    loadData: function (count, sub, last) {
	var subreddit = sub != undefined ? sub: this.state.subreddit;
	var lastNode = last != undefined ? last : this.state.lastNode;
	request
	    .get('http://www.reddit.com/r/' + subreddit + '/hot.json?limit=50&count=' + count + '&after=' + lastNode)
	    .end(function (res) {
		var result = res.body.data.children.filter(function (el) {
		    return el.data.url.indexOf('.jpg') > -1 || el.data.url.indexOf('.gif') > -1 || el.data.url.indexOf('.png') > -1;
		    });
		this.setState({data: result,
			       currentView: res.body.data.children[0],
			       lastNode: res.body.data.after,
			       count: count,
			       subreddit: subreddit
			      }
			     );
	    }.bind(this));
    },
    
    componentDidMount: function () {
	this.loadData(0);
    },


    clickHandler: function(id) {
	var current = this.state.data.filter(function (element) {
	    return element.data.id == id;
	    });
	this.setState({currentView: current[0]});
	this.refs.modal.open();
    },

    previous: function() {
	var count = this.state.count > 50 ? this.state.count - 50 : 0;
	console.log(count);
	this.loadData(count);

    },

    next: function() {
	var count = this.state.count + 50;
	console.log(count);
	this.loadData(count);

    },

    subChangeHandler: function(sub) {
	this.loadData(0, sub, '');
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
	    return ViewRow( {onClicked:this.clickHandler, group:group} );
	}.bind(this));
			      
	return (
		React.DOM.div(null, 
		  SubChooser( {subChanged:this.subChangeHandler} ),
	 	  rows,
	    React.DOM.a( {onClick:this.previous}, "<"), " ", React.DOM.a( {onClick:this.next}, ">"),
		  Modal( {ref:"modal", view:this.state.currentView} )
		)
	);
    }
});

React.renderComponent(
	ViewList(null ),
    document.getElementById('content')
);
