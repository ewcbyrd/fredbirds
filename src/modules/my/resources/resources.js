import { LightningElement } from 'lwc';
import {
    getNearbyNotableObservations,
    getNotableSightingsByLocation
} from 'data/ebirdService';

export default class Resources extends LightningElement {
    localSightings;
    localSightingsDaysBack = 3;
    stateSightings;
    vaSightingsDaysBack = 1;
    selectedSightings = [];
    nearbySelected = false;
    localSelected = true;
    stateSelected = false;
    customSelected = false;
    view = 'local';

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
        getNearbyNotableObservations(opts).then((result) => {
            this.localSightings = result;
        });
    }

    getVirginiaNotableSightings() {
        const opts = {
            regionCode: 'US-VA',
            daysBack: this.vaSightingsDaysBack
        };
        getNotableSightingsByLocation(opts).then((result) => {
            this.stateSightings = result;
        });
    }

    get stateSightingsHeader() {
        return `Notable Virginia Sightings for the past day`;
    }

    handleSightingsSelected(event) {
        this.selectedSightings = event.detail;
        const details = this.template.querySelector('my-sightings-details');
        details.lat = undefined;
        details.lon = undefined;
    }

    handleSightingsChange(event) {        
        this.view = event.target.value;
        this.selectedSightings = undefined;
        ['nearby', 'local', 'state'].forEach((item) => {this[`${item}Selected`] = false});
        this[`${this.view}Selected`] = event.target.checked;
    }
    
    get sightings() {
        return this[`${this.view}Sightings`];
    }

    get sightingsHeader() {
        return this[`${this.view}SightingsHeader`];
    }
}
