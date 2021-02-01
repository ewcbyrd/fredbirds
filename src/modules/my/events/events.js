import { LightningElement } from 'lwc';

export default class Events extends LightningElement {
    year;
    yearEvents;
    showModal = false;

    events = {};
    selectedEvent;

    noEvents = false;

    connectedCallback() {
        const events = sessionStorage.getItem('events');
        if (events) {
            this.createEvents(JSON.parse(events));
        } else {
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
                    sessionStorage.setItem('events', JSON.stringify(result));
                    this.createEvents(result);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    setEvents(year) {
        this.year = year;
        if (this.events[year] === undefined) {
            this.yearEvents = [{ _id: '0', event: 'No Events Scheduled' }];
            this.noEvents = true;
        } else {
            this.yearEvents = this.events[year];
            this.noEvents = false;
        }
    }

    get options() {
        return Object.keys(this.events);
    }

    handleEventClick(event) {
        const id = event.currentTarget.dataset.item;
        this.selectedEvent = this.yearEvents.find((item) => item.id === id);
        this.showModal = true;
    }

    handleCloseClick() {
        this.showModal = false;
    }

    handleYearChange(event) {
        const year = event.currentTarget.value;
        this.setEvents(year);
    }

    get sightings() {
        return (
            this.selectedEvent.sightings !== undefined &&
            this.selectedEvent.sightings.length > 0
        );
    }

    get participants() {
        return (
            this.selectedEvent.participants !== undefined &&
            this.selectedEvent.participants.length > 0
        );
    }

    get participantString() {
        if (this.selectedEvent.participants === undefined) return '';
        let partString = '';
        for (let i = 0; i < this.selectedEvent.participants.length; i++) {
            partString += this.selectedEvent.participants[i].name;
            if (i < this.selectedEvent.participants.length - 1)
                partString += ', ';
        }
        return partString;
    }

    createEvents(result) {
        result.sort((a, b) => (a.start > b.start ? 1 : -1));
        result.forEach((item) => {
            if (this.events[item.year] === undefined)
                this.events[item.year] = [];
            if (item.species_sighted)
                item.species_sighted.sort((a, b) =>
                    a.common > b.common ? 1 : -1
                );
            if (item.participants)
                item.participants.sort((a, b) => (a.name > b.name ? 1 : -1));
            this.events[item.year].push({
                id: item._id,
                date: item.date,
                event: item.event,
                sightings: item.species_sighted,
                details: item.details,
                tripReport: item.tripreport,
                participants: item.participants,
                photos: item.photos,
                start: item.start
            });
        });
        console.log(this.events);
        this.setEvents(new Date().getFullYear());
    }

    get showDetails() {
        console.log(
            new Date() < this.selectedEvent.start ||
                this.yearEvents[0]._id === '0'
        );
        return (
            new Date() < this.selectedEvent.start ||
            this.yearEvents[0]._id === '0'
        );
    }
}
