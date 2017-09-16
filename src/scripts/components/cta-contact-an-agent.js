'use strict';

$(document).ready(function() {
    var $component = $('.nyl-cta-contact-an-agent');
    var $pictureWrapper = $component.find('.nyl-cta-contact-an-agent__picture-row');

    function initialize() {
        getRandomImages();
    }

    function getRandomImages() {
        $.ajax({
            method: 'GET',
            dataType: 'json',
            url: NYLApi.getApiPath() + 'getagentimages',
            success: function(result) {
                if (result.status !== 'OK') {
                    return;
                }

                _buildNewImages(result.dataBeanList);
            },
            error: function(errorResult) {
                console.warn('Failed to get CTA Contact An Agent imagery from service');
            }
        });
    }

    // PRIVATE METHODS

    function _buildNewImages(imageArray) {
        $pictureWrapper.empty();

        imageArray.forEach(function(imageSet) {
            var pictureElement = '<picture class="nyl-cta-contact-an-agent__pictures"><img src="' + _.get(imageSet, 'desktopImg2x') + '" alt="Agent Profile"></picture>';
            $pictureWrapper.append(pictureElement);
        });
    }

    // INIT - test to ensure component exists
    if ($component.length) {
        initialize();
    }
});
