import { LightningElement, api } from 'lwc';
import { getNewsletters } from 'data/restdbService';

export default class Newsletters extends LightningElement {

    newsletters = [];

    connectedCallback() {
        const newsletters = sessionStorage.getItem('newsletters');
        if (newsletters) {
            this.newsletters = JSON.parse(newsletters);
        } else {
            getNewsletters()
            .then((response) => {
                return response.json();
            })
            .then((results) => {
                this.newsletters = results;
                sessionStorage.setItem('newsletters', JSON.stringify(results));
            })
            .catch((error) => {
                console.log(error);
            });
        }
    }

    handleNewsletterClick(event) {
        const id = event.currentTarget.dataset.item;
        const newsletter = this.newsletters.find((item) => item._id === id);
        this.dispatchEvent(new CustomEvent('newsletterclick', { detail: newsletter}));
    }

}