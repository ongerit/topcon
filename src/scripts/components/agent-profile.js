'use strict';

$(document).ready(function() {
    var GOOGLE_API_KEY = 'AIzaSyDg7ztNaCTqSdpUgLiWTuRyS5adXChvTLM';
    var GOOGLE_MARKER_ICON_PATH = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAA6CAMAAADBRyrTAAACXlBMVEUAAAAA//8AgP8AqqoAqv8AgL8AmcwAgKoAgNUAkrYAktsAgL8AjsYAgLMAgMwAi9EAgL8AgMgAeMMAh8MAecIAesIAdroAgMQAgL8AgMQAe8UAfL0AgL8AfMEAeb8AecIAfcQAer8AfcEAe8IAfb4AfcAAeb4Ae78Ae8EAfL8AesAAfMEAer4AesAAfL8AfMEAe8AAe74AeMAAecEAe8AAesEAe78Aer8AesEAe78Aer8AfMAAe78AesAAer8Ae78AesAAeb4Aeb8Aer8AeL8Aer8Ae8AAer4Aeb8Aer8AesAAer4Aer8Aer4Ae74Aer4Aeb8Aer4Aer8Aeb4Aer8Aeb8Aer8Aer8Aer8Aer8Aeb4Aer8Aeb8Aer8Aeb4Aer8Aer8Aeb4Aeb8Aer8Aer4Aeb8Aer8Aeb8Aer4Aeb8Aer8Aer4Aeb4Aer8Aer4Aer8Aer8Aeb8Aer4Aeb4Aer4Aeb8Aeb4Aer8Aeb4Aer4Aer8Aer4Aeb8Aer8Aeb4Aer4Aeb8Aer8Aeb4Aer4Aeb8Aer8Aeb4Aer4Aeb4Aeb8Aeb4Cer4Fe78GfL8IfcALfsAPgMEQgcIWhMMch8UeiMUhisYji8Yki8cmjMcqj8gukckxksozk8s2lcs7mM1EnM9Fnc9LoNFPotJSpNJUpdNhq9Ztstlvs9pztdt1ttt4uNx7ud1/u96Evt+IwOCTxuOVx+Ogzeajzueq0ums0+mv1Oq01+u52u282+3D3+/S5/PW6fTd7fbf7vbh7/fn8vjo8vnq8/ns9frz+Pv0+fz3+vz7/P38/f7+/v7////FCtEKAAAAinRSTlMAAQIDAwQFBgYHBwgJCgoLDA4RERUZGhocHh8jJCUoKiswMTY3OTs8PkBBQkNFSEpNT1FSVVZXWFpfZGVocXN0dXZ4e3+AgYaPkJWWl5manaCho6anqKusrrCxsrO0tba6vcDDxcbHyMnKy83Q09XW2tvc3eDn6evs7e/x8vP09fb3+Pn6+/z9/v6odQSbAAACMUlEQVR4AZXL90PMbwAH8Pfd965vQoZQ9hAykp0RsodsIXuQQcggKtfpLt5FyN57UxmUvfX8V+66dM/z+Xzu7vH6/QVL/0U1+d9pg5a4kRlbD9PPuztrXA+E5xi+2kNF7pT2CMk+eg/N3BnxsNZrG60VpjthZp/kZUgbEmAUu5Lh5PWGqs1mhleUAlnsRkbi7o8g23JGlt8NjSZSx84WaNDdSy2zEGDPpp6SnqiXSl3r4WfLodGFB1Wvqp/dKKNREnySaXC9VgR8e3iSqiz4LKKi9LkIeneOCk8cEOOi4oWQfT1PxVigHxWPhep9OWWZwFTKzv4UBk8pOwAsoaxKGH0vp6w5dlBS+kWY3KWsHfZTckmYVVLWES5Kbgqz15R1gYeS28LsLWVdcYiSa8KsmrLO2EvJ6V/C5BFlHbCWshphcpGy1phJ2R1hVENZsR2jqKgVqt9XKMsG4qmo+CwU96mYBmA7FZc/iaC6J1QlAkij6szLOtHgwy2qdsEnzkWDq5UffefHm3tlNJgAvxk0O1FximZ5LeHXtoCa0hGQRj05UQhwbKIOTyL+SjhIDeMRlORmRPNtkAwpYQTrnFBMP86w9rWCweSwIzcWJmOOMaQtzWAh1csQ1jSFpREeWloVgxCGWY4V0QhpaDFNlkUjjMFHabA0CmGlGEamExEMclOy2ImIkovYaKEDGga62GCBA1oGHGG9eXZoSiqkz1w7tPUtIOfYAH198mfb8E862WDtD6QIOLyivWDkAAAAAElFTkSuQmCC';
    var $component = $('.nyl-agent-profile');
    var $triggerLinkComponent = $component.find('.nyl-agent-profile__map-toggle');
    var $mapContainer = $('.nyl-hero-agent-profile__map');
    var isMapOpen = false;
    var lat;
    var lng;
    var	map;
    var marker;

    function initialize() {
        fetchGeoData();
        enableMapToggle();
    }

    function fetchGeoData() {
        $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address=' + _getAndFormatAddress() + '&key=' + GOOGLE_API_KEY, function(data) {
            lat = _.get(_.head(data.results), 'geometry.location.lat');
            lng = _.get( _.head(data.results), 'geometry.location.lng');

            createGoogleMap(lat, lng);
        });
    }

    function createGoogleMap(latitude, longitude) {
        map = new google.maps.Map($mapContainer.get(0), {
            center: {
                lat: latitude,
                lng: longitude
            },
            disableDefaultUI: true,
            draggable: false,
            scrollwheel: false,
            zoomControl: false,
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        // Accessibilty: ensure sure map is not tabbable
        var mapCompleteListener = map.addListener('tilesloaded', function() {
            $mapContainer.find('a').attr('tabindex', -1);
            google.maps.event.removeListener(mapCompleteListener);
        });
    }

    function enableMapToggle() {
        $triggerLinkComponent.on('click', function() {
            _toggleMap();
        });
        $mapContainer.on('click', function() {
            _toggleMap();
        });
    }

    // Private Methods

    function _toggleMap() {
        if (isMapOpen) {
            isMapOpen = false;
            $mapContainer.removeClass('nyl-hero-agent-profile__map--open');
            $triggerLinkComponent.text('Show Location');

            _removePin();
            return;
        }

        isMapOpen = true;
        $mapContainer.addClass('nyl-hero-agent-profile__map--open');
        $triggerLinkComponent.text('Hide Location');

        _dropPin();
    }

    function _getAndFormatAddress() {
        var formattedAddress = $mapContainer.attr('data-address').replace(/ /g, '+');
        return formattedAddress;
    }

    function _dropPin() {
        marker = new google.maps.Marker({
            position: {
                lat: lat,
                lng: lng
            },
            map: map,
            icon: {
                url: GOOGLE_MARKER_ICON_PATH,
                scaledSize: new google.maps.Size(24, 29)
            }
        });
        marker.setAnimation(google.maps.Animation.DROP);
        marker.setMap(map);
    }

    function _removePin() {
        marker.setMap(null);
    }

    // INIT - test to ensure component exists
    if ($mapContainer.length) {
        initialize();
    }
});
