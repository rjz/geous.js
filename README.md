geous.js
========

**geous.js** is a library that simplifies geolocation and geocoding tasks.

*28 Apr 2012: Geous remains a work in progress. Production environments should avoid linking directly to this version of Geous to avoid broken functionality in future releases*

Quickstart
----------

The simplest use of geous.js is to defer geo-related functionality until the Google Maps API and/or current user&rsquo;s location are available:

	geous.withMaps(function(){
		alert('maps are now available');
	});

	geous.withMe(function(){
		alert('I\'m viewing this site from ' + geous.Me.address );
	});

Note that a call to any of the geous functions will immediately trigger any dependencies (e.g., geo_location.js) loading if they are unavailable.

Overview
--------

geous.js uses the [Google Maps API](http://code.google.com/apis/maps/documentation/javascript/) and [geo_location.js](http://code.google.com/p/geo-location-javascript/) to determine the current user&rsquo;s location and convert it (if possible) into a human-friendly address. Two helper methods are used to queue functions for execution as soon as the Maps API and user location are available. They are:

* **geous.withLocation**, defer functions until the user&rsquo;s location is available

* **geous.withMaps**, used to defer functions until the Maps API is available

* **geous.withMe**, used to defer functions until both the user's location and the Maps API are available and the user&rsquo;s location has been stored in `geous.Me`.

In addition, geous.js provides helper methods for geocoding address and lat/lng data and classes for storing and transforming the location and address information returned by Google&rsquo;s v3 Maps API.

Reference
---------

Complete documentation of geous is available [here](http://rjzaworski.com/projects/geous)

Demo
----

See geous at work [here](http://rjzaworski.com/projects/geous/demo.html)

Notes on compiling with Closure Compiler
----------------------------------------

As of v0.2.0, geous.js may be compiled using [Closure Compiler](http://code.google.com/closure/compiler/). 

To compile with Closure, include the [Maps API extern definitions](http://closure-compiler.googlecode.com/svn/trunk/contrib/externs/maps/google_maps_api_v3_5.js) in `externs_url` and define the following symbols from geo_location.js in `js_externs`:

	var geo_position_js = {};
	geo_position_js.init = function(){};
	geo_position_js.getCurrentPosition = function(){}'

Author
------
RJ Zaworski <rj@rjzaworski.com>

License
-------

geous.js is released under the JSON License. You can read the license [here](http://www.json.org/license.html).
