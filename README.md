Geous.js
===============

Javascript geolocation and geocoding made easy.

* [Overview](#overview)
* [Using with jQuery](#geous--jquery)
* [Geocoders](#geocoders)
* [License](#license)

Overview
--------

Geous provides a common format for managing location-based data and handy utilities for performing location-related tasks.

###geous.Location

Location objects provide the basic currency for all other geous operations. A basic location may be constructed from a variety of formats, including any of the following:

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

Geous + jQuery
--------------

Geous includes a jQuery plugin (jquery.geousable) for translating between HTML inputs and `geous.Location` objects.

### configuration

Pass options to `geousable` when first initializing it on a selector. For instance, to allow the plugin to overwrite existing content in related fields and elements, set the `overwrite` option:

    $('form').geousable({
      overwrite: true
    });

Options include:

<table>
  <tr>
    <th>Option</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>defaultMapPattern</td>
    <td>String</td>
    <td>
      The pattern used to map field names to CSS-selectors.
      <br /><strong>Default: <code>'.{%}'</code></strong>
    </td>
  </tr>
  <tr>
    <td>errorHandler</td>
    <td>Function</td>
    <td>General error handler to be passed as the default <code>error</code> parameter to geous requests</td>
  </tr>
  <tr>
    <td>map</td>
    <td>Object</td>
    <td>A map of the fields of a <code>geous.Location</code> object (address, city, state, etc.) to a corresponding CSS selector. If <code>null</code> is supplied, an appropriate selector will be constructed from the field's name and the <code>defaultMapPattern</code> parameter</td>
  </tr>
  <tr>
    <td>onFieldError</td>
    <td>Function</td>
    <td>
			Callback to call when a lookup fails to populate a field using <code>setLocation</code>. Callbacks specified using <code>onFieldError</code> should accept a jQuery selector containing the field in question (<code>$field</code>) as their only parameter.
    </td>
  </tr>
  <tr>
    <td>onFieldSuccess</td>
    <td>Function</td>
    <td>
			Callback to call when a lookup successfully populates a field using <code>setLocation</code>. Callbacks specified using <code>onFieldError</code> should accept a jQuery selector containing the field in question (<code>$field</code>) as their only parameter.
    </td>
  </tr>
  <tr>
    <td>overwrite</td>
    <td>Boolean</td>
    <td>Allow <code>setLocation</code> to overwrite fields with existing content? 
      <br /><strong>default: <code>false</code></strong>
    </td>
  </tr>
</table>

### getLocation()

With `geous.js` and `jquery.geousable.js` included, location fields may be retrieved directly from an HTML form:

    <!-- form -->
    <form>
      <input type="text" class="address" />
      <input type="text" class="city" />
      <input type="text" class="state" />
      <input type="submit" />
    </form>

    <script>
      $('form').submit(function (e) {
        e.preventDefault();
        var location = $(this).geousable('getLocation');
        console.log(location);
      });
    </script>

### setLocation()

Similarly, a `Location` may be assigned directly to the form:

    <script>
      var location = new geous.Location({
        address: '123 ABC st',
        city: 'Akron',
        state: 'Ohio'
      });
      $('form').geousable('setLocation', location);
    </script>

### geocode()

Finally, the `Location` described by a form may be completed via a geocoding request:

    <script>
      $('form').geousable('geocode', {
        success: function (location) {
          console.log(location);
        }
      });
    </script>

Geocoders
---------

Geous ships with support for Google's Geocoding API, but other geocoding services may be used as well. To use an alternate geocoder, wrap the geocoder in a module that exposes a `geocode()` method (see `src/geocoders`). If you author a wrapper for another service, please don't hesitate to contribute!

If you choose to rely on the Google Geocoding API, please be sure that your application conforms to its terms of service.


License
----------------

geous.js is released under the JSON License. You can read the license [here](http://www.json.org/license.html)
