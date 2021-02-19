import { LightningElement } from 'lwc';

export default class EventParent extends LightningElement {

    selectedEvent;

    handleEventClick(event) {
        this.selectedEvent = event.detail;
    }

    handleYearChange() {
        this.selectedEvent = undefined;
    }
}