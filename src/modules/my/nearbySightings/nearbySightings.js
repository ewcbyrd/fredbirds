import { LightningElement } from 'lwc';
import { getNearbyNotableObservations } from 'data/ebirdService';

export default class NearbySightings extends LightningElement {
    localSightings = [];

    connectedCallback() {
        this.getLocalSightings();
    }

    getLocalSightings() {
        const opts = {
            lat: 38.31,
            long: -77.46,
            daysBack: 7,
            dist: 30
        };
        getNearbyNotableObservations(opts).then((result) => {
            const sightingsMap = new Map();
            result.forEach((item) => {
                item.obsDt = new Date(item.obsDt);
                sightingsMap.set(item.obsId, item);
            });
            console.log();
            this.localSightings = sightingsMap.values();
        });
    }

    handleViewAllSightingsClick() {
        this.dispatchEvent(
            new CustomEvent('viewall', {
                detail: 'sightings',
                bubbles: true,
                composed: true
            })
        );
    }
}
