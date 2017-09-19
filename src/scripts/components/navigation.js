import $ from 'jquery';

class Navigation {
    constructor(domElement) {
        this.$component = domElement;
        this.$body = $('body');
        this.$menulogIn = this.$component.find('.menu__log-in');
        this.$menuLogged = this.$component.find('.menu__logged');
        this.$menuApp = this.$component.find('.menu__app');
        this.$subscriptions = this.$component.find('.subscriptions');
        this.$profile = this.$component.find('.profile');

        // [TO] - Initialize functions
        this.init();
    }

    init() {
        this.authenticateUser();
        this.toggleMenu();
    }

    authenticateUser() {
        $(this.$menulogIn).on('click', () => {
            console.log(this.$component);
            this.$component.addClass('authenticated');
        });
    }

    toggleMenu() {
        $(this.$menuApp).on('click', () => {
            if (this.$component.hasClass('show-subscription') || this.$component.hasClass('show-profile')) {
                this.$component.removeClass('show-subscription show-profile');
                return;
            }
            this.$component.addClass('show-subscription');
            this.$body.css('overflow', 'hidden');
        });

        $(this.$menuLogged).on('click', () => {
            if (this.$component.hasClass('show-subscription') || this.$component.hasClass('show-profile')) {
                this.$component.removeClass('show-profile show-subscription');
                return;
            }
            this.$component.addClass('show-profile');
        });
    }
}

export default Navigation;
