import { LightningElement, api } from 'lwc';

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
        console.log(this.home);
        const year = new Date().getFullYear();
        this.year = year;
        this.fetchEventsByYear(year);
    }

    get options() {
        return Object.keys(this.events);
    }

    handleEventClick(event) {
        const id = event.currentTarget.dataset.item;
        this.selectedEvent = this.yearEvents.find((item) => item.id === id);
        if (id === '0') return;
        this.dispatchEvent(new CustomEvent('eventclick', {detail: this.selectedEvent}));
    }

    handleCloseClick() {
        this.showModal = false;
    }

    handleYearChange(event) {
        const year = event.currentTarget.value;
        this.year = year;
        this.fetchEventsByYear(year);
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
                    photos.push({header: `${photo.caption}`, image: `https://fredbirds-098f.restdb.io/media/${photo.photo}`, href: "#"});
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

    fetchEventsByYear(year) {
        this.loading = true;
        const events = sessionStorage.getItem(`${year}events`);
        const query = `{"start":{"$gt":{"$date":"${year}-01-01"},"$lt":{"$date":"${year}-12-31"}}}`
        if (events) {
            this.createEvents(JSON.parse(events));
            this.loading = false;
        } else {
            fetch('https://fredbirds-098f.restdb.io/rest/events?q=' + query, {
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
                sessionStorage.setItem(`${year}events`, JSON.stringify(result));
                this.createEvents(result);
                this.loading = false;
            })
            .catch((error) => {
                console.log(error);
            });
        }
        
    }

    getEventDate(startDate, endDate) {
        let dateText = '';
        const startMonth = startDate.toLocaleString('default', {month: 'long'});
        dateText =  `${startMonth} ${startDate.getDate() + 1}`;
        if (endDate) {
            const endMonth = endDate.toLocaleString('default', {month: 'long'});
            if (startMonth === endMonth) {
                dateText += ` - ${endDate.getDate() + 1}`;
            } else {
                dateText += ` - ${endMonth} ${endDate.getDate() + 1}`;
            }
        }
        return dateText;

    }

    get isHome() {
        return this.home === "true";
    }

    handleViewAllEventsClick() {
        this.dispatchEvent(new CustomEvent('viewall', {detail: 'events', bubbles: true, composed: true}));
    }
}
