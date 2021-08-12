import { LightningElement } from 'lwc';
import {
    getNearbyNotableObservations,
    getNotableSightingsByLocation,
    getNearbyObservations
} from 'data/ebirdService';
import { getStates, getCounties } from 'data/restdbService';

export default class Resources extends LightningElement {
    localSightings;
    stateSightings;
    nearbySightings;
    countySightings;
    selectedSightings = [];
    stateOptions = [];
    stateLabel = 'Virginia';
    countyLabel = 'Accomack';
    dropdown = 'Local';
    showFilterModal = false;
    countyOptions = [];
    setting = {
        view: 'local',
        filter: 'notable',
        back: 7,
        state: 'US-VA',
        county: 'US-VA-001'
    };
    filteredCounties = [];
    lastUpdated = {};

    connectedCallback() {
        this.loadSightings();
        this.getStateOptions();
        this.getCountyOptions();
    }

    loadSightings() {
        this.getLocalSightings();
        this.getStateNotableSightings();
        if (navigator.geolocation) {
            this.getNearbyObservations();
        }
        this.getCountyNotableSightings();
    }

    get localSightingsHeader() {
        return `Notable Fredericksburg Region Sightings for the past ${this.setting.back} days`;
    }

    getLocalSightings() {
        const opts = {
            lat: 38.31,
            long: -77.46,
            daysBack: this.setting.back
        };
        getNearbyNotableObservations(opts).then((result) => {
            this.localSightings = result;
            this.lastUpdated.local = new Date();
        });
    }

    getStateNotableSightings() {
        const opts = {
            regionCode: this.setting.state,
            daysBack: 3
        };
        getNotableSightingsByLocation(opts).then((result) => {
            this.stateSightings = result;
            this.lastUpdated.state = new Date();
        });
    }

    getCountyNotableSightings() {
        const opts = {
            regionCode: this.setting.county,
            daysBack: 7
        };
        getNotableSightingsByLocation(opts).then((result) => {
            this.countySightings = result;
            this.lastUpdated.county = new Date();
        });
    }

    getNearbyObservations() {
        navigator.geolocation.getCurrentPosition((position) => {
            const opts = {
                lat: position.coords.latitude,
                long: position.coords.longitude
            };
            getNearbyObservations(opts).then((result) => {
                this.nearbySightings = result;
                this.lastUpdated.nearby = new Date();
            });
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
                        this.stateOptions.push({
                            label: item.state,
                            value: item.code
                        });
                    });
                    sessionStorage.setItem(
                        'states',
                        JSON.stringify(this.stateOptions)
                    );
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    getCountyOptions() {
        let counties = sessionStorage.getItem('counties');
        if (counties) {
            this.countyOptions = JSON.parse(counties);
        } else {
            getCounties()
                .then((response) => {
                    return response.json();
                })
                .then((results) => {
                    results.forEach((item) => {
                        this.countyOptions.push({
                            label: item.county,
                            value: item.code
                        });
                    });
                    sessionStorage.setItem(
                        'counties',
                        JSON.stringify(this.countyOptions)
                    );
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    getCounties(state) {
        this.filteredCounties = this.countyOptions.filter((item) =>
            item.value.startsWith(state)
        );
    }

    get stateSightingsHeader() {
        return `Notable ${this.stateLabel} Sightings for the past 3 days`;
    }

    get nearbySightingsHeader() {
        return 'Nearby Sightings for the past 7 days';
    }

    get countySightingsHeader() {
        return `Notable ${this.countyLabel}, ${this.stateLabel} Sightings for the past 7 days`;
    }

    handleSightingsSelected(event) {
        this.selectedSightings = event.detail;
        const details = this.template.querySelector('my-sightings-details');
        details.lat = undefined;
        details.lon = undefined;
    }

    handleSightingsChange(event) {
        this.template
            .querySelector('.list-select')
            .classList.remove('slds-is-open');
        const defaultFilter = {
            nearby: 'all',
            local: 'notable',
            state: 'notable',
            county: 'notable'
        };
        this.setting.view = event.currentTarget.dataset.id;
        this.selectedSightings = undefined;
        this.setting.filter = defaultFilter[this.setting.view];
        this.dropdown = {
            nearby: 'Nearby',
            local: 'Local',
            state: 'State',
            county: 'County'
        }[this.setting.view];
    }

    get sightings() {
        return this[`${this.setting.view}Sightings`];
    }

    get sightingsHeader() {
        return this[`${this.setting.view}SightingsHeader`];
    }

    get nearbyDisabled() {
        return !navigator.geolocation;
    }

    get filterOptions() {
        const secondary = {
            nearby: [
                { label: 'Rare', value: 'rare' },
                { label: 'All', value: 'all' }
            ],
            local: [
                { label: 'Rare', value: 'rare' },
                { label: 'Notable', value: 'notable' }
            ],
            state: [
                { label: 'Rare', value: 'rare' },
                { label: 'Notable', value: 'notable' }
            ],
            county: [
                { label: 'Rare', value: 'rare' },
                { label: 'Notable', value: 'notable' }
            ]
        };
        return secondary[this.setting.view];
    }

    get stateSelectDisabled() {
        return this.setting.view !== 'state' && this.setting.view !== 'county';
    }

    get countySelectDisabled() {
        return this.setting.view !== 'county';
    }

    handleApplyClick() {
        const filter = this.template.querySelector('.category').value;
        this.setting.filter = filter;
        const state = this.template.querySelector('.state').value;
        if (state !== this.setting.state) {
            this.setting.state = state;
            this.handleSelectedStateChange();
            this.selectedSightings = undefined;
        }
        const county = this.template.querySelector('.county').value;
        if (this.setting.county !== county) {
            this.setting.county = county;
            this.handleSelectedCountyChange();
            this.selectedSightings = undefined;
            console.log(this.sightings[0]);
        }
        this.showFilterModal = false;
    }

    handleSelectedStateChange() {
        this.stateLabel = this.stateOptions.find(
            (item) => item.value === this.setting.state
        ).label;
        this.getStateNotableSightings();
    }

    handleSelectedCountyChange() {
        this.countyLabel = this.countyOptions.find(
            (item) => item.value === this.setting.county
        ).label;
        this.getCountyNotableSightings();
    }

    handleStateChange(event) {
        this.getCounties(event.detail.value);
        this.template.querySelector('.county').value =
            this.filteredCounties[0].value;
    }

    handleListClick() {
        let classes = this.template.querySelector('.list-select').classList;
        if (classes.contains('slds-is-open')) {
            classes.remove('slds-is-open');
        } else {
            classes.add('slds-is-open');
        }
    }

    handleFilterClick() {
        this.getCounties(this.setting.state);
        this.showFilterModal = true;
    }

    handleFilterModalCancelClick() {
        this.showFilterModal = false;
    }

    get numSightings() {
        const sightings = this.template.querySelector('my-sightings');
        return sightings === null ? 0 : sightings.numSightings;
    }

    get lastUpdatedDate() {
        return this.lastUpdated[this.setting.view];
    }
}
