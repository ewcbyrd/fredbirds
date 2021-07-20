import { LightningElement } from 'lwc';

export default class About extends LightningElement {

    handleViewEventsClick() {
        this.dispatchEvent(new CustomEvent('viewall', { detail: 'events', bubbles: true, composed: true }));
    }
}