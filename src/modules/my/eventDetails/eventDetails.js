import { LightningElement, api } from 'lwc';
import AWS from "aws-sdk";

export default class EventDetails extends LightningElement {

    @api selectedEvent;
    textSelected;
    pdfSelected;

    connectedCallback() {
    }

    get eventCancelled() {
        return this.selectedEvent.cancelled;
    }

    get tripReport() {
        return this.selectedEvent.tripReport || this.selectedEvent.pdfFile;
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

    get textDisabled() {
        return this.selectedEvent.tripReport === undefined || this.selectedEvent.tripReport === '';
    }

    get pdfDisabled() {
        return this.selectedEvent.pdfFile === undefined;
    }

    @api resetSelected(tripReport, pdfFile) {
        if (tripReport) {
            this.textSelected = true;
            this.pdfSelected = false;
        } else if (pdfFile) {
            this.textSelected = false;
            this.pdfSelected = true;
        } else {
            this.textSelected = false;
            this.pdfSelected = false;
        }
    }

    get pdfFileLocation() {
        return `resources/pdf/${this.selectedEvent.pdfFile}.pdf`;
    }

    handleTypeChange(event) {
        const type = event.target.value;
        if (type === 'text') {
            this.textSelected = true;
            this.pdfSelected = false;
        } else {
            this.textSelected = false;
            this.pdfSelected = true;
        }
    }
}