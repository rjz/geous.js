/**
 *	geous.js
 *	http://rjzaworski.com/projects/geous
 *
 *	Utility-belt library for deferring, loading, and performing basic geolocation and 
 *	geocoding tasks.
 *
 *	@author     RJ Zaworski <rj@rjzaworski.com>
 *	@version	0.2.0
 *	@license    JSON License <http://www.json.org/license.html>
 */
//--------------------------------------------------------------------------------------------
/**
 *	@namespace
 */
var geous = new function(){

	var self = this,
	
		/**
		 *	Temporarily defer functions' execution
		 *
		 *	@see	http://blog.rjzaworski.com/2011/07/microloader-for-asynchronous-scripts
		 *	@param	{Object}
		 *	@return {Function}
		 */
		loaderFactory = function( options ) {
		
			var callbacks = [],
				o = options;
	
			return function( callback ) {
		
				var f_ptr;

				if( typeof o.init == 'function') {
					o.init();
					o.init = null;
				}
	
				if( typeof callback == 'function' ) {
					callbacks.push( callback );
				}
	
				if(o.test()) {
					while( f_ptr = callbacks.pop() ) { 
						f_ptr(); 
					}
					return true;
				}
				
				return false;
			}
		};
	/**
	 *	Shallow-copy user-specified parameters over object
	 *	@memberOf	geous
	 *	@param	{Object}	obj	definition of the object
	 *	@param	{Object}	params	the object's user-specified parameters
	 */
	this.init = function( obj, params ) {
		if( params ) {
			for(x in obj) {
				if( params[x] && x != 'toString' ) {
					if( typeof obj[x] === typeof params[x] ) {
						obj[x] = params[x];	
					}
				}
			}
		}		
	}

	/**
	 *	Convert a google GeocoderResult object into a {@link geous.Location}
	 *
	 *	@param	{google.maps.GeocoderResult}	result	the response from Google's Geocoding API
	 *	@returns	{geous.Location}
	 */
	this.fromGeocoderResultToLocation = function( result ) {
	
		var address,
			component,
			loc = new geous.Location();
		
		if( result && result.address_components ) {
		
			// support instantiation with geocoder results
			loc.latitude = result.geometry.location.lat();
			loc.longitude = result.geometry.location.lng();
		
			address = result.address_components;
		
			for(x in address ) {
		
				component = address[x];	// get current component
	
				if( component.types.indexOf('street_address') > -1 ) {
					loc.address.street = component.long_name;
				} else if( component.types.indexOf('locality') > -1 ) {
					loc.address.locality = component.long_name;
				} else if( component.types.indexOf('administrative_area_level_1') > -1 ) { 
					loc.address.region = component.long_name;
				} else if( component.types.indexOf('country') > -1) {
					loc.address.country = component.long_name;
				}
			}
		}
		
		return loc;
	}
	
	/**
	 *	Submit a request to google's Geocoding API
	 *
	 *	@param	{google.maps.LatLng|geous.Address|String}	request	the address or latlng to be geocoded
	 *	@param	{function}	callback	the function to be called following a successful geocoding request
	 */
	this.geocode = function( request, callback ) {
	
		var gc = new google.maps.Geocoder();
	
		if( request instanceof google.maps.LatLng ) {
			request = { 'location' : request }	
		} else if( request instanceof geous.Address ) {
			request = { 'address' : request.toString() }
		} else if( request instanceof String ) {
			request = { 'address' : request }
		}
	
		gc.geocode( request, function(result, status) {
			var location;
			
			if( status === google.maps.GeocoderStatus.OK ) {
				location = geous.fromGeocoderResultToLocation( result[0] );
				if(typeof callback == 'function' ) callback( location );
			}
			else {
				// handle failed geocode() request
			}
		});
	}
	
	this.Me = null;

	/**
	 *	Defer a function's execution until the geolocation library has been loaded
	 *	@param	{Function}	the callback to call once geolocation is available
	 *	@return {boolean}	whether or not the location library is available
	 */
	this.withLocation = loaderFactory({
		init: function(){
			var script;

			if( !this.test() ) {

				script = document.createElement('script');
				script.onreadystatechange= function () { // IE hack
					if( script.readyState == 'complete' || script.readyState == 'loaded' ) self.withLocation();
				}
				script.onload = self.withLocation;
				script.src = 'http://geo-location-javascript.googlecode.com/svn/trunk/js/geo-min.js';
				document.body.appendChild(script);
			}
		},
		test: function() {
			return ( typeof geo_position_js != 'undefined' );
		}
	});

	/**
	 *	Defer a function's execution until the Google Maps API has been loaded
	 *	@param	{Function}	the callback to call once the API is available
	 *	@return {boolean}	whether or not the Maps API is available
	 */
	this.withMaps = loaderFactory({
		init: function(){
			var script;
			if(!this.test()) {
				script = document.createElement("script");
				script.src = 'http://maps.google.com/maps/api/js?sensor=true&libraries=geometry&callback=geous.withMaps';
				document.body.appendChild(script);	
			}
		},
		test: function() {
			return	typeof google != 'undefined' && 
					typeof google.maps != 'undefined' &&
					typeof google.maps.LatLng != 'undefined';
		}
	});

	/**
	 *	Defer a function until the local user's location has become available
	 *	@param	{Function}	callback	the function to be called when geous.Me is available
	 *	@return {boolean}	whether or the Me object is available
	 */
	this.withMe = loaderFactory({
		init: function(){
			this.timer = window.setInterval( self.withMe, 100 );
		},
		test: function() {
			
			var error = function( e ) {
					// handle failed getCurrentPosition() request
				},
				success = function( p ) {
					var loc = new geous.Location(p.coords);
					self.geocode(loc.toLatLng(), function(location) {
						self['Me'] = location;
						self.withMe();
					});
				};

			if(self.withMaps() && self.withLocation()) {

				if( self['Me'] ) {
					return true; 
				}

				if(this.timer ) {
					window.clearInterval(this.timer);
					this.timer = null;

					if(geo_position_js.init()) {
						geo_position_js.getCurrentPosition(success, error);
					} else {
						// handle no access to geolocation.
					}
				}
			}

			return false;
		}
	});
}

/** Export symbols for Closure Compiler: **/
window['geous'] = geous;

geous['Me'] = geous.Me;

// helpers
geous['fromGeocoderResultToLocation'] = geous.fromGeocoderResultToLocation;
geous['geocode'] = geous.geocode;
	  
// methods
geous['withMaps'] = geous.withMaps;
geous['withLocation'] = geous.withLocation;
geous['withMe'] = geous.withMe;

/**
 *	Standard class for holding geous addresses.
 *
 *	@see	http://code.google.com/apis/maps/documentation/javascript/reference.html#GeocoderResult
 *
 *	@constructor
 *	@property   {string}	street
 *	@property   {string}	locality    The town or city associated with this address
 *	@property   {string}	region      The state or province associated with this address
 *	@property   {string}	country
 *	@param      {geous.Address=} address An address to copy
 */
geous.Address = function( address ){
	
	this.street = '';
	this.locality = '';
	this.region = '';
	this.country = '';
	
	geous.init( this, address );
}

/**
 *	Convert this address into a human-friendly string
 *	@override
 */
geous.Address.prototype.toString = function() {
	return this.street + ' ' + this.locality + ', ' + this.region + ' ' + this.country;
}

/** Export symbols for Closure Compiler: **/
geous['Address'] = geous.Address;
geous.Address['toString'] = geous.Address.prototype.toString;

/**
 *	Standard class for holding geous locations
 *	@param	{geous.Location=}	location	an existing location to be copied
 *	@constructor
 *	@property	{number}	latitude	The latitude at this location
 *	@property	{number}	longitude	The longitude at this location
 *	@property	{geous.Address}	address	The address (if available) of this location
 */
geous.Location = function( location ){

	this.latitude = 0;
	this.longitude = 0;
	this.address = new geous.Address();

	geous.init( this, location );
}

/**
 *	Convert the current location into a google.maps.LatLng object
 *	@returns	{google.maps.LatLng}
 */
geous.Location.prototype.toLatLng = function() {
	return new google.maps.LatLng( this.latitude, this.longitude );	
}

/** Export symbols for Closure Compiler: **/
geous['Location'] = geous.Location;
geous.Location['toLatLng'] = geous.Location.prototype.toLatLng;