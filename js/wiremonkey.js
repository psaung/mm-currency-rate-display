/*wiremonkey js
A realtime internet connection tracker and notifier
Version:0.1.0
Author:Ryvan Prabhu @ 2016
Git:http://github/ryvan-js
*/

(function() {

	var WireMonkey = window.WireMonkey || {};

  // Utility method to extend defaults with user options
  function extendDefaults(source, properties) {
    var property;
    for (property in properties) {
      if (properties.hasOwnProperty(property)) {
        source[property] = properties[property];
      }
    }
    return source;
  }

	WireMonkey = (function(){

		WireMonkey = function(){
			var _ = this;

      _.connectedHandler = [];
      _.disconnectedHandler = [];

			_.conf = {
				parentElement:"body",
				WmElement: ".wm_container",
				classDefault:"wm_container",
				classSlideIn:"bounce_in",
				classSlideOut:"bounce_out",
				classConnected:"connected",
				imgUrl:"http://www.vitaminedz.com/photos/49/02-49565-front-de-mer-a-oran.jpg"
			};

			_.message = {
			 	connectionLost:"Connection Lost",
				reconnected: "Connected"
			}

			_.onLine= true;


			_.onDisconnect = function(){
        var component = _.conf.WmElement;
				document.querySelector(component).querySelector('span').innerHTML = _.message.connectionLost;
				document.querySelector(component).className = document.querySelector(component).className +" "+ _.conf.classSlideIn;
			}

			_.onConnect = function(){
        var component = _.conf.WmElement;
				document.querySelector(component).querySelector('span').innerHTML = _.message.reconnected;
				document.querySelector(component).className = document.querySelector(component).className +" "+ _.conf.classConnected;
			}

      _.changeConnectionStatus = function(val) {
        if(val !== undefined) {
          if(val) {
            for(var i = 0; i < _.connectedHandler.length; i++){
              _.connectedHandler[i](this);
            }
          } else {
            for(var i = 0; i < _.disconnectedHandler.length; i++){
              _.disconnectedHandler[i](this);
            }
          }
          this.onLine = val;
        }
      }

			//_.init();

		}

		return WireMonkey;

	}());

  WireMonkey.prototype.on = function(event, handler) {
    switch(event) {
      case 'connected':
          this.connectedHandler.push(handler);
        break;
      case 'disconnected':
          this.disconnectedHandler.push(handler)
        break;
    }
  }

	WireMonkey.prototype.checkConnection = function () {
		var _ = this;

		if(typeof navigator === "object" && typeof navigator.onLine === "boolean"){
			_.onLine = navigator.onLine;
		}
		else{
			//hack for older bizzare browsers
			var i = new Image();
			i.onerror = function(){ _.onLine = false};
			i.onload = function(){ _.onLine = true};
			i.src = _.conf.imgUrl + new Date().getTime();
		}

	return  _.onLine;
	}

	WireMonkey.prototype.init = function(){
		var _= this,isOnline,reset_element;
		var conf = _.conf;
		var msg = _.message;
		var connection = true;

    // we don't necessary to show the wire monkey container if the user is not initialized the plugin.
    document.querySelector(_.conf.parentElement).insertAdjacentHTML("afterBegin","<div class='wm_container' >\
															<div class='bg_color_ball'></div>\
															<div class='wm_message_board'>\
															<span>Connection Lost</span><span class='icon'></span>\
															</div>\
															</div>");

    // check internet connection in every 4000 miliseconds.
		setInterval(function(){
			isOnline = _.checkConnection();
			if(isOnline && reset_element) document.querySelector(conf.WmElement).className = conf.classDefault; reset_element = false;
			if(!isOnline){
				if(connection){
					_.onDisconnect();
					connection = false;
          _.changeConnectionStatus(false);
				}
			}else
			if(isOnline && !connection){
				_.onConnect();
				setTimeout(function(){
					document.querySelector(conf.WmElement).className = document.querySelector(conf.WmElement).className +" "+ conf.classSlideOut;
          _.changeConnectionStatus(true);
					reset_element = true;
				},1000);
				return connection = true;
			}
		},4000);
	}


	window.WireMonkey = new WireMonkey();

}());
