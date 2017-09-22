// set up data here.
// this can be nested multiple levels deep if necessary.
var data = {
    category: 'subscriptions',
    subscriptions: [
        {
            'active': true,
            'name': 'myTopcon',
            'menu': [
                {
                    name: 'Topnet Live',
                    link: 'https://example.com',
                    'active': false
                },
                {
                    name: 'MAGNET Enterprise',
                    link: 'https://example.com',
                    'active': true
                },
                {
                    name: 'Sitelink3D',
                    link: 'https://example.com',
                    'active': false
                },
                {
                    name: 'Site Planner',
                    link: 'https://example.com',
                    'active': false
                },
                {
                    name: 'Collage',
                    link: 'https://example.com',
                    'active': false
                }
            ]
        }, {
            'active': false,
            'name': 'PRODUCTS AND SERVICES',
            'menu': [
                {
                    name: 'Products and Subscriptions',
                    link: 'https://example.com',
                    'active': false
                },
                {
                    name: 'GPShield',
                    link: 'https://example.com',
                    'active': false
                },
                {
                    name: 'TSshield',
                    link: 'https://example.com',
                    'active': false
                },
                {
                    name: 'Firmware Updater Utility',
                    link: 'https://example.com',
                    'active': false
                },
                {
                    name: 'Support Cases',
                    link: 'https://example.com',
                    'active': false
                }
            ]
        }
    ]
}

module.exports = data;
