geous.js
========

**geous.js** is a library that simplifies geolocation and geocoding tasks.

Overview
--------

geous.js uses the Google Maps API and [geo_location.js](http://code.google.com/p/geo-location-javascript/) to determine the current user&rsquo;s location and convert it (if possible) into a human-friendly address. Two helper methods are used to queue functions for execution as soon as the Maps API and user location are available. They are:

* **geous.withLocation**, defer functions until the user&rsquo;s location is available

* **geous.withMaps**, used to defer functions until the Maps API is available

* **geous.withMe**, used to defer functions until both the user's location and the Maps API are available and the user&rsquo;s location has been stored in `geous.Me`.

In addition, geous.js provides helper methods for geocoding address and lat/lng data and classes for storing and transforming the location and address information returned by Google&rsquo;s v3 Maps API.

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

Author
------
RJ Zaworski <rj@rjzaworski.com>

License
-------

geous.js is released under the JSON License. You can read the license [here](http://www.json.org/license.html).