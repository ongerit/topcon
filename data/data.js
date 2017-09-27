// set up data here.
// this can be nested multiple levels deep if necessary.
var data = {
    "category": "subscriptions",
    "subscriptions": [
        {
            "active": true,
            "categoryLabel": "myTopcon",
            "slug": "my-topcon",
            "display": true,
            "menu": [
                {
                    "label": "Topnet Live",
                    "slug": "topnet-live",
                    "link": "https://example.com",
                    "active": false,
                    "display": true
                },
                {
                    "label": "MAGNET Enterprise",
                    "slug": "magnet-enterprise",
                    "link": "https://example.com",
                    "active": true,
                    "display": false
                },
                {
                    "label": "Site link 3D",
                    "slug": "site-link-3d",
                    "link": "https://example.com",
                    "active": false,
                    "display": true
                },
                {
                    "label": "Site Planner",
                    "slug": "site-planner",
                    "link": "https://example.com",
                    "active": false,
                    "display": true
                },
                {
                    "label": "Collage",
                    "slug": "collage",
                    "link": "https://example.com",
                    "active": false,
                    "display": true
                }
            ]
        }, {
            "active": false,
            "slug": "products-and-services",
            "categoryLabel": "PRODUCTS AND SERVICES",
            "menu": [
                {
                    "label": "Products and Subscriptions",
                    "link": "https://example.com",
                    "slug": "products-and-subscriptions",
                    "active": false,
                    "display": false
                },
                {
                    "label": "GPShield",
                    "slug": "gpshield",
                    "link": "https://example.com",
                    "active": false,
                    "display": true
                },
                {
                    "label": "TSshield",
                    "slug": "tsshield",
                    "link": "https://example.com",
                    "active": false,
                    "display": true
                },
                {
                    "label": "Firmware Updater Utility",
                    "slug": "firmware-updater-utility",
                    "link": "https://example.com",
                    "active": false,
                    "display": true
                },
                {
                    "label": "Support Cases",
                    "slug": "support-cases",
                    "link": "https://example.com",
                    "active": false,
                    "display": true
                }
            ]
        }
    ]
}

module.exports = data;
