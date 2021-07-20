import { LightningElement, api } from 'lwc';

export default class EventDetails extends LightningElement {

    @api selectedEvent;
    detailsSelected;
    tripReportSelected;

    get eventCancelled() {
        return this.selectedEvent.cancelled;
    }

    get tripReport() {
        return this.selectedEvent.pdfFile;
    }

    get showDetails() {
        return this.selectedEvent !== undefined;
    }

    get detailsDisabled() {
        return this.selectedEvent.details === undefined || this.selectedEvent.details === '';
    }

    get tripReportDisabled() {
        return this.selectedEvent.pdfFile === undefined || this.selectedEvent.pdfFile === '';
    }

    get showButtons() {
        return (this.selectedEvent.pdfFile !== undefined && this.selectedEvent.pdfFile !== '') || (this.selectedEvent.details !== '' && this.selectedEvent.details !== undefined);
    }

    @api resetSelected(details, tripReport) {
        if (details) {
            this.detailsSelected = true;
            this.tripReportSelected = false;
        } else if (tripReport) {
            this.detailsSelected = false;
            this.tripReportSelected = true;
        } else {
            this.detailsSelected = false;
            this.tripReportSelected = false;
        }
    }

    get pdfFileLocation() {
        return `https://drive.google.com/file/d/${this.selectedEvent.pdfFile}/preview?usp=sharing`;
    }

    handleTypeChange(event) {
        const type = event.target.value;
        if (type === 'details') {
            this.detailsSelected = true;
            this.tripReportSelected = false;
        } else {
            this.detailsSelected = false;
            this.tripReportSelected = true;
        }
    }
}