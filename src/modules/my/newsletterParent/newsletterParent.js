import { LightningElement } from 'lwc';

export default class NewsletterParent extends LightningElement {

    handleNewsletterClickEvent(event) {
        const details = this.template.querySelector('my-newsletter-details');
        details.newsletter = event.detail;
    }
}