import { LightningElement } from 'lwc';
import {
    getNearbyNotableObservations,
    getNotableSightingsByLocation
} from 'data/ebirdService';

export default class Resources extends LightningElement {
    localSightings;
    localSightingsDaysBack = 7;
    vaSightings;
    vaSightingsDaysBack = 1;

    connectedCallback() {
        this.getLocalSightings();
        this.getVirginiaNotableSightings();
    }

    get localSightingsHeader() {
        return `Notable Fredericksburg Region Sightings for the past ${this.localSightingsDaysBack} days`;
    }

    getLocalSightings() {
        const opts = {
            lat: 38.31,
            long: -77.46,
            daysBack: this.localSightingsDaysBack
        };
        const sightings = sessionStorage.getItem('sightings');
        if (sightings) {
            this.localSightings = JSON.parse(sightings);
        } else {
            getNearbyNotableObservations(opts).then((result) => {
                sessionStorage.setItem('sightings', JSON.stringify(result));
                this.localSightings = result;
            });
        }
    }

    getVirginiaNotableSightings() {
        const opts = {
            regionCode: 'US-VA',
            daysBack: this.vaSightingsDaysBack
        };
        const sightings = sessionStorage.getItem('vasightings');
        if (sightings) {
            this.vaSightings = JSON.parse(sightings);
        } else {
            getNotableSightingsByLocation(opts).then((result) => {
                sessionStorage.setItem('vasightings', JSON.stringify(result));
                this.vaSightings = result;
            });
        }
    }

    get vaSightingHeader() {
        return `Notable Virginia Sightings for the past day`;
    }
}
