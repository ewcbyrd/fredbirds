import { LightningElement, api } from 'lwc';

export default class TripReport extends LightningElement {

    @api selectedEvent;
    opts = { autoScroll: false, autoScrollTime: 7 };

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

    get photos() {
        return this.selectedEvent.photos !== undefined;
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

}