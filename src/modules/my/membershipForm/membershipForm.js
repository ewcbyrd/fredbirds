import { LightningElement } from 'lwc';
import { saveMember, sendEmail, getMember } from 'data/restdbService';

export default class MembershipForm extends LightningElement {
    first = '';
    last = '';
    email = '';
    phone = '';

    handleSubmit() {
        const isInputsCorrect = [
            ...this.template.querySelectorAll('lightning-input')
        ].reduce((validSoFar, inputField) => {
            inputField.reportValidity();
            return validSoFar && inputField.checkValidity();
        }, true);

        if (isInputsCorrect) {
            this.first =
                this.first.charAt(0).toUpperCase() +
                this.first.substr(1).toLowerCase();
            this.last =
                this.last.charAt(0).toUpperCase() +
                this.last.substr(1).toLowerCase();
            this.email = this.email.toLowerCase();
            getMember({
                first: this.first,
                last: this.last,
                email: this.email,
                phone: this.phone
            })
                .then((result) => {
                    if (result.length === 0) {
                        return saveMember(
                            JSON.stringify({
                                first: this.first,
                                last: this.last,
                                email: this.email,
                                phone: this.phone
                            })
                        );
                    }
                    return new Promise((resolve, reject) => {
                        reject('Existing Member');
                    });
                })
                .then(() => {
                    const body = JSON.stringify({
                        to: [
                            {
                                email: this.email,
                                name: `${this.first} ${this.last}`
                            }
                        ],
                        from: {
                            email: 'admin@fredbirds.com',
                            name: 'Fredericksburg Birding Club'
                        },
                        cc: [
                            {
                                email: 'membership@fredbirds.com',
                                name: 'FBC Membership'
                            }
                        ],
                        templateId: 'd-41856bbce48b405e9455299a6a239ccb',
                        dynamic_template_data: {
                            first: this.first,
                            subject:
                                'Welcome to the Fredericksburg Birding Club'
                        }
                    });
                    return sendEmail(body);
                })
                .then(() => {
                    this.clearForm();
                    this.dispatchEvent(
                        new CustomEvent('memberevent', {
                            detail: {
                                header: 'Welcome!',
                                message:
                                    'Your membership record has been created. You will be receiving a welcome email shortly with membership information.'
                            },
                            bubbles: true,
                            composed: true
                        })
                    );
                })
                .catch((error) => {
                    this.clearForm();
                    if (error === 'Existing Member') {
                        this.dispatchEvent(
                            new CustomEvent('memberevent', {
                                detail: {
                                    header: 'Existing Member',
                                    message:
                                        'Our records indicate that you already have a membership record. An email has been sent to our membership committee. Someone should be following up with you soon.'
                                },
                                bubbles: true,
                                composed: true
                            })
                        );
                    }
                });
        }
    }

    clearForm() {
        this.first = '';
        this.last = '';
        this.email = '';
        this.phone = '';
    }

    handleFormChange(event) {
        this[event.target.name] = event.target.value;
    }
}
