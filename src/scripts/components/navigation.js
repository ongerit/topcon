import $ from 'jquery';

class Navigation {
    constructor(domElement) {
        this.$component = domElement;
        this.$body = $('body');
        this.$navigationlogIn = this.$component.find('.navigation__log-in')[0];
        this.$navigationLogged = this.$component.find('.navigation__logged')[0];

        this.$navigationApp = this.$body.find('.navigation__app')[0];


        this.$subscriptions = this.$body.find('.subscriptions')[0];
        this.$profile = this.$body.find('.profile')[0];

        this.init();
    }

    init() {
        console.log(this.$logIn);
        this.authenticateUser();
        this.toggleMenu();
    }

    authenticateUser() {
        $(this.$navigationlogIn).on('click', () => {
            this.$body.addClass('authenticated');
        });

    }

    toggleMenu() {
        $(this.$navigationApp).on('click', () => {
            this.$body.addClass('show-subscription');
        });

        $(this.$navigationLogged).on('click', () => {
            this.$body.addClass('show-profile');
        });
    }

}

export default Navigation;
