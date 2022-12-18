import { LightningElement, api } from 'lwc';
import {
    getEventsByYear,
    getFutureEvents
} from 'data/restdbService';

export default class Events extends LightningElement {
    year;
    yearEvents;
    showModal = false;

    events = {};
    selectedEvent;

    noEvents = false;
    loading = false;

    opts = { autoScroll: false, autoScrollTime: 7 };

    @api home;

    @api readOnly = false;

    connectedCallback() {
        const year = 2023;
        this.year = year;
        this.fetchEvents(year);
    }

    get options() {
        return Object.keys(this.events);
    }

    handleEventClick(event) {
        const id = event.currentTarget.dataset.item;
        this.selectedEvent = this.yearEvents.find((item) => item.id === id);
        if (id === '0') return;
        this.dispatchEvent(new CustomEvent('eventclick', { detail: this.selectedEvent }));
    }

    handleCloseClick() {
        this.showModal = false;
    }

    handleYearChange(event) {
        const year = event.currentTarget.value;
        this.year = year;
        this.fetchEvents(year);
        this.dispatchEvent(new CustomEvent('eventyearchange'));
    }

    get eventCancelled() {
        return this.selectedEvent.cancelled;
    }

    get tripReport() {
        return this.selectedEvent.tripReport;
    }

    createEvents(result) {
        this.yearEvents = [];
        if (result.length === 0) {
            this.yearEvents = [{ id: '0', date: 'No Events Scheduled' }];
            this.noEvents = true;
            return;
        }
        this.noEvents = false;
        result.sort((a, b) => (a.start > b.start ? 1 : -1));
        result.forEach((item) => {
            let photos = [];
            if (item.photos) {
                item.photos.forEach((photo) => {
                    photos.push({ header: `${photo.caption}`, image: `https://fredbirds-098f.restdb.io/media/${photo.photo}`, href: "#" });
                });
            }
            if (item.species_sighted)
                item.species_sighted.sort((a, b) =>
                    (a.common > b.common ? 1 : -1)
                );
            if (item.participants)
                item.participants.sort((a, b) => (a.name > b.name ? 1 : -1));
            this.yearEvents.push({
                id: item._id,
                date: this.getEventDate(new Date(item.start), item.end ? new Date(item.end) : null),
                event: item.event,
                sightings: item.species_sighted,
                details: item.details,
                tripReport: item.tripreport,
                participants: item.participants,
                start: item.start,
                cancelled: item.cancelled,
                photos: photos,
                pdfFile: item.pdfFile
            });
        });
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

    fetchEvents(year) {
        this.loading = true;
        const events = this.home === 'false' ? sessionStorage.getItem(`${year}events`) : sessionStorage.getItem('upcomingevents');
        if (events) {
            this.createEvents(JSON.parse(events));
            this.loading = false;
        } else {
            // eslint-disable-next-line no-unused-expressions
            this.home === 'false' ? this.fetchYearEvents(year) : this.fetchFutureEvents();
        }
    }

    fetchFutureEvents() {
            const currentDate = new Date();
            getFutureEvents(currentDate, 3)
            .then((result) => {
                sessionStorage.setItem('upcomingevents', JSON.stringify(result));
                this.createEvents(result);
                this.loading = false;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    fetchYearEvents(year) {
        getEventsByYear(year)
        .then((result) => {
            sessionStorage.setItem(`${year}events`, JSON.stringify(result));
            this.createEvents(result);
            this.loading = false;
        })
        .catch((error) => {
            console.log(error);
        });
    }

    getEventDate(startDate, endDate) {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        let dateText = '';
        const startMonth = monthNames[startDate.getUTCMonth()];
        dateText = `${startMonth} ${startDate.getUTCDate()}`;
        if (endDate) {
            const endMonth = monthNames[endDate.getUTCMonth()];
            if (startMonth === endMonth) {
                dateText += ` - ${endDate.getUTCDate()}`;
            } else {
                dateText += ` - ${endMonth} ${monthNames[endDate.getUTCDate()]}`;
            }
        }
        return dateText;

    }

    get isHome() {
        return this.home === "true";
    }

    handleViewAllEventsClick() {
        this.dispatchEvent(new CustomEvent('viewall', { detail: 'events', bubbles: true, composed: true }));
    }
}
