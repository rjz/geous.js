(function () {

    // provide mock geocoder service
    (function (service) {

        service.geocode = function (originalLocation, opts) {
            var response = opts.response || {};
            service.trigger(response.type, originalLocation);
            if (opts[response.type] instanceof Function) {
                opts[response.type](originalLocation);
            }
        };

    })(geous.geocoders('mock'));

    // provide mock navigator.location object
    geous.extend(navigator.geolocation, {

        nextResult: function (success, lat, lng) {
            this._nextResult = [success, lat, lng];
        },

        getCurrentPosition: function (success, error) {

            var result;

            if ((result = this._nextResult) && result[0]) {
                return success({
                    coords: {
                        latitude: result[1],
                        longitude: result[2]
                    }
                });
            } else {
                return error();
            }
        }
    });


    // include test helpers
    this.testHelper = {
        checkFields: function (location, fields) {
            var scope;

            for (key in fields) {
                scope = location;
                if (key == 'lat' || key == 'lng') {
                    scope = scope.coordinates
                }
                expect(scope[key]).toEqual(fields[key]);
            }
        }
    };
})();
