Geous.js
===============

Javascript geolocation and geocoding made easy.

Overview
--------

Geous provides several useful tools for simplifying location-based tasks and a common format for handling their results.

###geous.Location

Geous `Location` objects are the basic currency of Geous operations, and may be constructed from a variety of formats. All of the following are valid:

    // copy constructor
    new geous.Location(new geous.Location());

    // address string
    new geous.Location('123 abc st, akron, ohio');

    // address components
    new geous.Location(['123 abc st', 'akron', 'ohio']);
    new geous.Location({city: 'akron', state: 'ohio'});

    // lat/lng coordinates
    new geous.Location(48.3689, -99.9962);
    new geous.Location([48.3689, -99.9962]);
    new geous.Location({lat: 48.3689, lng: -99.9962});

The `setAddress` and `setCoordinates` methods used by the constructor may also be used to assign location components to an existing `geous.Location`:

    var location = new geous.Location();

    location.setAddress({city: 'akron', state: 'ohio'});
    console.log(location.city, location.state);

    location.setCoordinates(48.3689, -99.9962);
    console.log(location.coords);

###geous.geocode

Geous provides a catch-all method for converting between various location formats. 

    var location = new geous.Location({ city: 'Truckee', state: 'CA' });

    geous.geocode(location, {
        error: function () {
            alert('well, that didn\'t work out!');
        },
        success: function (location) {
            console.log(location.coords);
        }
    });

Besides supporting `success` and `error` callbacks, the geocoder may be used to reverse-geocode a lat-lng pair by specifiying `{ reverse: true }`.

    var location = new geous.Location(48.3689, -99.9962);

    geous.geocode(location, {
        reverse: true,
        success: function (location) {
            console.log(location);
        }
    });

Prior to calling `geous.geocode`, an alternative geocoder may be assigned using `geous.configure()`:

    geous.configure({
        geocoder: 'google'
    });


###geous.getUserLocation

A wrapper for the HTML5 location API that will return a Geous Location. `success` and `error` callbacks may be provided as options to handle the corresponding events:

    geous.getUserLocation({
        error: function () {
            console.log('Something terrible has happened!');
        },
        success: function (location) {
            console.log('User is at: ', location.coords);
        }
    });

Adding `geocode: true` to the options hash will instruct geous to attempt to geocode the user's location.

    geous.getUserLocation({
        geocode: true,
        success: function (location) {
            console.log('Geocoded location:', location.toAddress());
        }
    });

License
----------------

geous.js is released under the JSON License. You can read the license [here](http://www.json.org/license.html)
