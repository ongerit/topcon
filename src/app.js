import $ from 'jquery';
import './app.scss';

// Components
import Navigation from './scripts/components/navigation';
import Subscriptions from './scripts/components/subscriptions';


function initializeComponents() {
    let domElement = null;
    let component = null;

    $('.navigation').each(function() {
        domElement = $(this);
        component = new Navigation(domElement);
    });

    $('.subscriptions').each(function(index) {
        domElement = $(this);
        component = new Subscriptions(domElement);
    });
}

// Initialize Component(s) based on existence
initializeComponents();
