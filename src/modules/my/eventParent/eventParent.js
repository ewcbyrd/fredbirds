import { LightningElement } from 'lwc';

export default class EventParent extends LightningElement {

    selectedEvent;

    handleEventClick(event) {
        this.selectedEvent = event.detail;
        this.template.querySelector('my-event-details').resetSelected(this.selectedEvent.details !== undefined && this.selectedEvent.details !== '', this.selectedEvent.pdfFile !== undefined && this.selectedEvent.pdfFile !== '');
    }

    handleYearChange() {
        this.selectedEvent = undefined;
    }
}