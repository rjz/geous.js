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

