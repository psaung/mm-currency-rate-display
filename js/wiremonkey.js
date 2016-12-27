/*wiremonkey js
A realtime internet connection tracker and notifier
Version:0.1.0
Author:Ryvan Prabhu @ 2016
Git:http://github/ryvan-js
*/

(function() {

	var WireMonkey = window.WireMonkey || {};

	WireMonkey = (function(){

		WireMonkey = function(){
			var _ = this;

			document.querySelector("body").insertAdjacentHTML("afterBegin","<div class='wm_container' >\
															<div class='bg_color_ball'></div>\
															<div class='wm_message_board'>\
															<span>Connection Lost</span><span class='icon'></span>\
															</div>\
															</div>");

			_.conf = {
				parentElement:"body",
				WmElement:document.querySelector(".wm_container"),
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
				_.conf.WmElement.querySelector('span').innerHTML = _.message.connectionLost;
				_.conf.WmElement.className = _.conf.WmElement.className +" "+ _.conf.classSlideIn;
			}

			_.onConnect = function(){
				_.conf.WmElement.querySelector('span').innerHTML = _.message.reconnected;
				_.conf.WmElement.className = _.conf.WmElement.className +" "+ _.conf.classConnected;
			}

			//_.init();

		}

		return WireMonkey;

	}());

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


		setInterval(function(){

			isOnline = _.checkConnection();
			if(isOnline && reset_element) conf.WmElement.className = conf.classDefault; reset_element = false;
			if(!isOnline){
				if(connection){
					_.onDisconnect();
					connection = false;
				}
			}else
			if(isOnline && !connection){
				_.onConnect();
				setTimeout(function(){
					conf.WmElement.className = conf.WmElement.className +" "+ conf.classSlideOut;
					reset_element = true;
				},1000);
				return connection = true;
			}
		},4000);
	}


	window.WireMonkey = new WireMonkey();

    //console.log( WM );
}());
