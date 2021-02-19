import { LightningElement, api } from 'lwc';

export default class PdfModal extends LightningElement {

    @api pdfFile;

    handleCloseClick() {
        this.dispatchEvent(new CustomEvent('closepdfmodal'));
    }

    get pdfFileLocation() {
        return `resources/pdf/${this.pdfFile}.pdf`;
    }
}