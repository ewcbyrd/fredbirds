import { LightningElement } from 'lwc';
import {
    getNearbyNotableObservations,
    getNotableSightingsByLocation,
    getNearbyObservations,
} from 'data/ebirdService';
import { getStates } from 'data/restdbService';

export default class Resources extends LightningElement {
    localSightings;
    localSightingsDaysBack = 3;
    stateSightings;
    nearbySightings;
    usSightings;
    vaSightingsDaysBack = 1;
    selectedSightings = [];
    view = 'local';
    stateOptions = [];
    state = 'US-VA'
    stateLabel = 'Virginia';
    filter = 'rare';

    connectedCallback() {
        this.getLocalSightings();
        this.getStateNotableSightings();
        if (navigator.geolocation) {
            this.getNearbyObservations();
        }
        this.getUsNotableSightings();
        this.getStateOptions();
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

    getStateNotableSightings() {
        const opts = {
            regionCode: this.state,
            daysBack: this.vaSightingsDaysBack
        };
        getNotableSightingsByLocation(opts).then((result) => {
            this.stateSightings = result;
        });
    }

    getNearbyObservations() {
        navigator.geolocation.getCurrentPosition((position) => {
            const opts = {
                lat: position.coords.latitude,
                long: position.coords.longitude
            };
            getNearbyObservations(opts)
            .then((result) => {
                this.nearbySightings = result;
            })
        })
    }

    getUsNotableSightings() {
        const opts = {
            regionCode: 'US',
            daysBack: 3
        };
        getNotableSightingsByLocation(opts).then((result) => {
            this.usSightings = result;
        });
    }

    getStateOptions() {
        let states = sessionStorage.getItem('states');
        if (states) {
            this.stateOptions = JSON.parse(states);
        } else {
            getStates()
            .then((response) => {
                return response.json();
            })
            .then((results) => {
                results.forEach((item) => {
                    this.stateOptions.push({label: item.state, value: item.code});
                });
                sessionStorage.setItem('states', JSON.stringify(this.stateOptions));
            })
            .catch((error) => {
                console.log(error);
            })
        }
    }

    get stateSightingsHeader() {
        return `Notable ${this.stateLabel} Sightings for the past day`;
    }

    get nearbySightingsHeader() {
        return 'Nearby Sightings for the past 7 days';
    }

    get usSightingsHeader() {
        return `Rare United States Sightings for the past 3 days`;
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
    }
    
    get sightings() {
        return this[`${this.view}Sightings`];
    }

    get sightingsHeader() {
        return this[`${this.view}SightingsHeader`];
    }

    get nearbyDisabled() {
        return !navigator.geolocation;
    }

    get options() {
        return [
            { label: 'Nearby', value: 'nearby' },
            { label: 'Local', value: 'local' },
            { label: 'State', value: 'state'},
            { label: 'United States', value: 'us'}
        ];
    }

    get filterOptions() {
        return [
            { label: 'Rare', value: 'rare' },
            { label: 'Notable', value: 'notable' },
            { label: 'All', value: 'all'}
        ];
    }

    get showStateSelect() {
        return this.view === 'state';
    }

    handleStateChange(event) {
        
        this.state = event.target.value;
        this.stateLabel = this.stateOptions.find((item) => item.value === this.state).label;
        this.getStateNotableSightings();
    }
}
