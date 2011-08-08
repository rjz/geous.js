/**
 *	geous.js
 *	http://rjzaworski.com/projects/geous
 *
 *	Utility-belt library for deferring, loading, and performing basic geolocation and 
 *	geocoding tasks.
 *
 *	@author     RJ Zaworski <rj@rjzaworski.com>
 *	@license    JSON License <http://www.json.org/license.html>
 *	@version	0.1.0
 *
 *	
 */
//--------------------------------------------------------------------------------------------
/**
 *	@namespace
 */
var geous = {
	/**
	 *	Shallow-copy user-specified parameters over object
	 *	@memberOf	geous
	 *	@param	{object}	obj	definition of the object
	 *	@param	{object}	params	the object's user-specified parameters
	 */
	init : function( obj, params ) {
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
}

/**
 *	Defer a function's execution until the geolocation library has been loaded
 *	@param	{Function}	the callback to call once geolocation is available
 */
geous.withLocation = function( callback ) {
	// placeholder, fx deferred with geous.lazyLoader
}

/**
 *	Defer a function's execution until the Google Maps API has been loaded
 *	@param	{Function}	the callback to call once the API is available
 */
geous.withMaps = function( callback ) {
	// placeholder, fx deferred with geous.lazyLoader
}

/**
 *	Defer a function until the local user's location has become available
 *	@param	{Function}	callback	the function to be called when geous.Me is available
 */
geous.withMe = function( callback ) {
	// placeholder, fx deferred with geous.lazyLoader
}

/**
 *	Convert a google GeocoderResult object into a {@link geous.Location}
 *
 *	@param	{google.maps.GeocoderResult}	result	the response from Google's Geocoding API
 *	@returns	{geous.Location}
 */
geous.fromGeocoderResultToLocation = function( result ) {

	var address;
	var component;
	var loc = new geous.Location();
	
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
geous.geocode = function( request, callback ) {

	var gc = new google.maps.Geocoder();

	if( request instanceof google.maps.LatLng ) {
		request = { 'location' : request }	
	} else if( request instanceof geous.Address ) {
		request = { 'address' : request.toString() }
	} else if( request instanceof String ) {
		request = { 'address' : request }
	}

	gc.geocode(
		request,
		function(result, status) {

			if( status === google.maps.GeocoderStatus.OK ) {

				var result = geous.fromGeocoderResultToLocation( result[0] );
				if(typeof callback == 'function' ) callback( result );
			}
			else {
				// handle failed geocode() request
				console.log('failed @ ' + JSON.stringify(result));
			}
		} 
	);
}

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

/**
 *	Temporarily defer functions' execution
 *
 *	@param	{Object}
 *	@see	http://blog.rjzaworski.com/2011/07/microloader-for-asynchronous-scripts/
 */
geous.lazyLoader = function( options ) {

	var callbacks = [];
	var o = options;
		
	geous[options.target] = function( callback ) {

		var f;
		var i = 0;

		if( typeof o.init == 'function') {
			o.init();
			o.init = null;
		}

		if( typeof callback == 'function' ) {
			callbacks.push( callback );
		}

		if(o.test()) {

			while( f = callbacks[i++] ) { 
				f(); 
			}

			geous[options.target] = function( callback ) {
				if( typeof callback == 'function' ) return callback(); 
				return true;
			}
		}
		
		return false;
	}

	return geous[options.target];
}

/**
 *	Actually implement geous.withLocation()
 */
geous.lazyLoader({
	target: 'withLocation',
	init: function(){
		var script;
		if( typeof geo_position_js == 'undefined' ) {
			script = document.createElement('script');
			script.onreadystatechange= function () {
				if (this.readyState == 'complete') geous.withLocation();
			}
			script.onload = geous.withLocation;
			script.src = 'http://geo-location-javascript.googlecode.com/svn/trunk/js/geo-min.js';
			document.body.appendChild(script);
		}
	},
	test: function() {
		return ( typeof geo_position_js != 'undefined' );
	}
});

/**
 *	Actually implement geous.withMaps()
 */
geous.lazyLoader({
	target: 'withMaps',
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
 *	Actually implement geous.withMe()
 */
geous.lazyLoader({
	target: 'withMe',
	init: function(){
		geous.withMe.timer = window.setTimeout( geous.withMe, 500 );
	},
	test: function() {
		
		var error;
		var success;
		
		if(geous.withMaps() && geous.withLocation()) {

			window.clearTimeout(geous.withMe.timer);
			
			if(geous.Me) {
				return true; 
			}
			
			error = function( e ) {
				// handle failed getCurrentPosition() request
			};

			success = function( p ) {

				var loc = new geous.Location(p.coords);
				geous.geocode(loc.toLatLng(), function(location) {
					geous.Me = location;
					geous.withMe();
				});
			};

			if(geo_position_js.init()) {
				geo_position_js.getCurrentPosition(success, error);
			} else {
				// handle no access to geolocation.
			}
		}
		return false;
	}
});
