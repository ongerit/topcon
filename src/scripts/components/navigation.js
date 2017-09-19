import $ from 'jquery';

class Navigation {
    constructor(domElement) {
        this.$component = domElement;
        this.$body = $('body');
        this.$navigationlogIn = this.$component.find('.menu__log-in');
        this.$navigationLogged = this.$component.find('.menu__logged');
        this.$navigationApp = this.$component.find('.menu__app');
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
        $(this.$navigationlogIn).on('click', () => {
            console.log(this.$component);
            this.$component.addClass('authenticated');
        });
    }

    toggleMenu() {
        $(this.$navigationApp).on('click', () => {
            if (this.$component.hasClass('show-subscription') || this.$component.hasClass('show-profile')) {
                this.$component.removeClass('show-subscription show-profile');
                return;
            }
            this.$component.addClass('show-subscription');
            this.$body.css('overflow', 'hidden');
        });

        $(this.$navigationLogged).on('click', () => {
            if (this.$component.hasClass('show-subscription') || this.$component.hasClass('show-profile')) {
                this.$component.removeClass('show-profile show-subscription');
                return;
            }
            this.$component.addClass('show-profile');
        });
    }
}

export default Navigation;
