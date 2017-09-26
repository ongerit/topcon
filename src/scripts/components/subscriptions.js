import $ from 'jquery';

class Subscriptions {
    constructor(domElement) {
        this.$component = domElement;
        this.$body = $('body');
        this.$subscriptionsWrapper = this.$component.find('.subscriptions__wrapper');

        // [TO] - Initialize functions
        this.init();
    }

    init() {
        this.getMenuData();
    }

    getMenuData() {
        const urlPath = '/static/data/data.json';
        const urlHref = document.location.href;
        const dataArray = [];

        $.ajax({
            method: 'GET',
            dataType: 'json',
            url: urlHref + urlPath,
            success: (result) => {
                this._buildNewMenu(result);
            },
            error: (errorResult) => {
                console.warn('Failed to load menu data. Please view subscriptions.js file.');
            }
        });
    }
    // PRIVATE METHODS
    _buildNewMenu(data) {
        this.$subscriptionsWrapper.empty();
        const html = `<div class="subscriptions__grid">
            <p>Have an account? <a>Log in</a> for a full list of your Topcon apps and services here.</p>
              <h3>${data.category}</h3>
            </div>
            ${data.subscriptions.map(item => `
                  <div class="subscriptions__cat">
                      <h4 class="subscriptions__menu ${item.active ? 'subscriptions__active' : ''}">${item.categoryLabel}</h4>
                      <ul>
                        ${item.menu.map(menu => `
                              <li class="subscriptions__menu-list ${menu.active ? 'subscriptions__active' : ''}">
                                  <a href='${menu.link}'>
                                      ${menu.label}
                                  </a>
                              </li>
                              `).join('\n      ')}
                      </ul>
                  </div>
            `).join('\n      ')} `;
        this.$subscriptionsWrapper.append(html);
    }
}

export default Subscriptions;