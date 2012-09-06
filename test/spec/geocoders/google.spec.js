describe('geous.geocoders.google', function () {

    window.google = window.google || {
        maps: {
            LatLng: function (lat, lng) {
                this.lat = function () { return lat; }
                this.lng = function () { return lng; }
            }
        }
    }   

	it ('adds helpers to geous.Location', function () {

        var lat = 48.3689,
			lng = -99.9962;

        var location = new geous.Location(lat, lng),
            latLng = location.toLatLng();

        expect(latLng instanceof google.maps.LatLng).toBeTruthy();
        expect(latLng.lat()).toEqual(lat);
        expect(latLng.lng()).toEqual(lng);
	});

});
