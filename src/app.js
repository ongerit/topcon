import $ from 'jquery';
import './app.scss';

// Components
import Navigation from './scripts/components/navigation';


function initializeComponents() {
    let domElement = null;
    let component = null;

    $('.navigation').each(function() {
        domElement = $(this);
        component = new Navigation(domElement);
    });
}

// Initialize Component(s) based on existence
initializeComponents();
