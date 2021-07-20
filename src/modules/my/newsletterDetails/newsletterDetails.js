import { LightningElement, api } from 'lwc';

export default class NewsletterDetails extends LightningElement {

    @api newsletter;

    get pdfFileLocation() {
        return `https://drive.google.com/file/d/${this.newsletter.pdfFile}/preview?usp=sharing`;
    }
}