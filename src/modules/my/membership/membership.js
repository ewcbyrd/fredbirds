import { LightningElement } from 'lwc';

export default class Membership extends LightningElement {
    showModal = false;
    modalDetail = {};

    connectedCallback() {
        // Check if this component is being used standalone (not on home page)
        // This is a simple heuristic - if the parent doesn't have grid classes, it's standalone
        const parentElement = this.template.host.parentElement;
        const isEmbeddedInGrid =
            parentElement && parentElement.classList.contains('slds-col');

        if (!isEmbeddedInGrid) {
            // Add standalone class after next render cycle
            setTimeout(() => {
                const mainElement = this.template.querySelector('.main');
                if (mainElement) {
                    mainElement.classList.add('standalone');
                }
            }, 0);
        }
    }

    handleMemberEvent(event) {
        this.showModal = true;
        this.modalDetail = event.detail;
    }

    handleOkClick() {
        this.showModal = false;
    }
}
