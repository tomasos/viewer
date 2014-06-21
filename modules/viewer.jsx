/** @jsx React.DOM */
var request = superagent;

var Modal = React.createClass({
    open: function() {
	$(this.getDOMNode()).modal('show');
    },
    close: function() {
	$(this.getDOMNode()).modal('hide');
    },
    render: function() {
	return ( <div className="modal fade">
		   <div className="modal-dialog">
		     <div className="modal-content">
		       <div className="modal-header">
		         <h3>{this.props.view.data.title}</h3>
		       </div>
		         <div className="modal-body">
		         <img onClick={this.close} src={this.props.view.data.url}></img>
		       </div>
		     </div>
		   </div>
		 </div>
	       );
    }
});


var View = React.createClass({
    handleClick: function() {
	var id = this.props.view.data.id;
	this.props.onClicked(id);
    },
    
    render: function() {
	return (
		<div className='image'>
  		  <img onClick={this.handleClick} key={this.props.view.data.id} src={this.props.view.data.thumbnail}></img>
		</div>
	);
    }
});

var SubChooser = React.createClass({
    getInitialState: function() {
	return {subs: ['aww', 'earthporn', 'adviceanimals']};
    },

    change: function() {
	this.props.subChanged($(this.refs.subSelect.getDOMNode()).val());
    },

    render: function() {
	var options = this.state.subs.map(function(opt) {
	    return <option>{opt}</option>;
	});
	
	return (
		<select ref="subSelect" onChange={this.change}>
		  {options}
		</select>
	);
    }
});

var ViewRow = React.createClass({
    handleClick: function(id) {
	this.props.onClicked(id);
    },
    render: function() {
	var views = this.props.group.map(function (view) {
	    return <View onClicked={this.handleClick} view={view} />;
	}.bind(this));
	
	return (
		<div className='row'>
		  {views}
		</div>
	);
    }
});


var ViewList = React.createClass({
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

    loadData: function (count) {
	var subreddit = this.state.subreddit;
	var count = this.state.count;
	request
	    .get('http://www.reddit.com/r/' + subreddit + '/hot.json?limit=50')
	    .end(function (res) {
		var result = res.body.data.children.filter(function (el) {
		    return el.data.url.indexOf('.jpg') > -1 || el.data.url.indexOf('.gif') > -1 || el.data.url.indexOf('.png') > -1;
		    });
		this.setState({data: result,
			       currentView: res.body.data.children[0],
			       lastNode: res.body.data.after,
			       count: count}
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
	this.setState({subreddit: sub});
	
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
	    return <ViewRow onClicked={this.clickHandler} group={group} />;
	}.bind(this));
			      
	return (
		<div>
		  <SubChooser subChanged={this.subChangeHandler} />
	 	  {rows}
	    <a onClick={this.previous}>&lt;</a> <a onClick={this.next}>&gt;</a>
		  <Modal ref="modal" view={this.state.currentView} />
		</div>
	);
    }
});

React.renderComponent(
	<ViewList />,
    document.getElementById('content')
);
