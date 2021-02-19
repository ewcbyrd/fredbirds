import { LightningElement, api } from 'lwc';

export default class EventDetails extends LightningElement {

    @api selectedEvent;
    showModal = false;

    get eventCancelled() {
        return this.selectedEvent.cancelled;
    }

    get tripReport() {
        return this.selectedEvent.tripReport;
    }

    get showDetails() {
        return this.selectedEvent;
    }

    get showPDFDiabled() {
        return this.selectedEvent.pdfFile === undefined;
    }

    handleViewPdfClick() {
        this.showModal = true;
    }

    handleClosePdfModal() {
        this.showModal = false;
    }
}