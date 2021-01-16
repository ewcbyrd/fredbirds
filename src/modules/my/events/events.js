import { LightningElement } from 'lwc';

export default class Events extends LightningElement {
    year;
    yearEvents;

    events = {};

    connectedCallback() {
        fetch('https://fredbirds-098f.restdb.io/rest/events', {
            method: 'GET',
            headers: {
                'cache-control': 'no-cache',
                'x-apikey': '5ff9ea16823229477922c93f'
            }
        })
            .then((response) => {
                return response.json();
            })
            .then((result) => {
                result.forEach((item) => {
                    if (this.events[item.year] === undefined)
                        this.events[item.year] = [];
                    this.events[item.year].push({
                        id: item._id,
                        date: item.date,
                        event: item.event
                    });
                });
                console.log(this.events);
                this.setEvents(this.options[0]);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    setEvents(year) {
        this.year = year;
        this.yearEvents = this.events[year];
    }

    get options() {
        return Object.keys(this.events);
    }
}
