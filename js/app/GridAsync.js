function GridAsync(){

	var self = this;

	this.domain = document.grid.async.domain;
	this.path = document.grid.async.path;
	this.author = document.grid.async.author;
	this.observers = [];


	/**
	 * init function
	 */
	this.init = function(){
		if(document.grid.async.service != ''){
			this.socket = io(document.grid.async.service);
			this.initEvents();
		}
	};
	this.addObserver = function(observer){
		this.observers.push(observer);
	};
	this.removeObserver = function(observer){
		this.observers = _.without(this.observers,observer);
	};
	this.notifyAll = function(_event, data){
		_.each(this.observers, function(_observer, index, list){
			if(typeof _observer["async_"+_event] == "function")
			{
				_observer["async_"+_event](data);
			}
		});
	};

	/**
	 * Grid Async server events
	 */
	this.initEvents = function(){
		this.on("connect", "connect");
		this.on("disconnect", "disconnect");
		// authors
		this.on("authors.list", "authors_list");
		this.on("authors.joined", "authors_joined");
		this.on("authors.left", "authors_left");
		// locking
		this.on("locking.isLocked", "locking_is_locked");
		this.on("locking.lockRequested", "locking_lock_requested");
		// ping
		this.on('ping.send',"ping_send");
	}
	this.on = function(e, f){
		var self = this;
		this.socket.on(e, function(data){
			self[f](data);
		});
	}
	this.connect = function(data){
		this.authors_join();
	};
	this.disconnect = function(data){
		this.notifyAll("disconnect");
		this.notifyAll("locking_is_locked");
	};
	/**
	 * authors
	 */
	this.authors_join = function(){
		this.socket.emit("authors.join", {domain: this.domain, path: this.path, author: this.author});
	}
	/**
	 * locking
	 */
	this.locking_request_lock = function(){
		this.socket.emit("locking.requestLock");
	}
	this.locking_handover = function(identifier){
		GRID.authors.each(function(author){
			author.set("request_lock", false);
		});
		this.socket.emit("locking.handover", identifier);
	}
	this.locking_deny_handover = function(identifier){
		this.socket.emit("locking.denyHandover", identifier);
	}
	/**
	 * authors events
	 */
	this.authors_list = function(data){
		this.notifyAll("authors_list",data);
	};
	this.authors_joined = function(data){
		this.notifyAll("authors_joined",data);
	};
	this.authors_left = function(id){
		this.notifyAll("authors_left",id);
	};
	/**
	 * locking events
	 */
	this.locking_is_locked = function(data){
		GRID.authors.resetLock();
		if(data.isLocked){
			GRID.authors.setLock(data.identifier);
		}
		this.notifyAll("locking_is_locked");
	};
	this.locking_lock_requested = function(data){
		var author = GRID.authors.get(data.identifier);
		if( author instanceof GridAuthor){
			author.set("request_lock",true);
		}
		this.notifyAll("request_lock");
	};
	/**
	 * ping events
	 */
	var _ping_timeout = null;
	this.ping_send = function(){
		_ping_timeout = setTimeout(function(){
			console.log("ping");
			self.socket.emit('ping.received');
		},1000);
	};

}





