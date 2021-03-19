import { LightningElement } from 'lwc';

export default class Membership extends LightningElement {

    showModal = false;
    modalDetail = {};

    handleMemberEvent(event) {
        this.showModal = true;
        this.modalDetail = event.detail;
    }

    handleOkClick() {
        this.showModal = false;
    }
}