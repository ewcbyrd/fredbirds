import { LightningElement } from 'lwc';
import { getFaqs} from 'data/restdbService';

export default class Events extends LightningElement {

    faqs = {};
    category = 'Membership';
    options = [];
    selectedFaqs = [];

    connectedCallback() {
        const faqs = sessionStorage.getItem('faqs');
        if (faqs) {
            this.faqs = JSON.parse(faqs);
            this.getOptions();
            this.getSelectedFaqs();
        } else {
            getFaqs()
            .then((response) => {
                return response.json();
            })
            .then((results) => {
                const faqObj = {};
                results.forEach((faq) => {
                    if (!faqObj[faq.category]) {
                        faqObj[faq.category] = [];
                    }
                    faqObj[faq.category].push(faq);
                });
                this.faqs = faqObj;
                sessionStorage.setItem('faqs', JSON.stringify(faqObj));
                this.getOptions();
                this.getSelectedFaqs();
            })
            .catch((error) => console.log(error));
        }
    }

    getOptions() {
        let options = [];
        // Build options for dropdown
        for (const key in this.faqs) {
            options.push({label: key, value: key});
        }
        console.log(options);
        this.options = options;
    }

    getSelectedFaqs() {
        this.selectedFaqs = this.faqs[this.category];
    }

    handleCategoryChange(event) {
        this.category = event.target.value;
        this.getSelectedFaqs();
    }

}