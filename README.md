Geous.js
--------

This branch contains the working draft of Geous' next major iteration (tentatively scheduled for the 0.5 release)

geous.Location
--------------

Geous `Location` objects may be constructed from a variety of formats. All of the following are valid:

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


geous.getUserLocation
---------------------

A wrapper for the HTML5 location API that will return a Geous Location. `success` and `error` callbacks may be provided as options to handle the corresponding events:

    geous.getUserLocation({
        error: function () {
            console.log('bad news'); 
        },
        success: function (location) {
            console.log('location');
        }
    });

geous.geocode
-------------

A wrapper for various geocoders that will reverse/geocode a location or lat-lng pair. Besides supporting `success` and `error` callbacks, the geocoder may be used to reverse-geocode a lat-lng pair by specifiying `{ reverse: true }`.

**Note**: `geous.init` must be called to assign a geocoder before `geous.geocode()` is called.

    geous.init();
    geous.getUserLocation({
        success: function (location) {
            geous.geocode(location, {
                reverse: true,
                success: function (location) {

                }
            })
        })
    });
