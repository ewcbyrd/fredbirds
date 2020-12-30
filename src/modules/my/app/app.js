import { LightningElement } from 'lwc';
import { getTaxonomy, getNearbyNotableObservations } from 'data/ebirdService';

export default class App extends LightningElement {
    taxonomy;
    sightings;

    connectedCallback() {
        this.getSpecies();

        let opts = { lat: 38.31, long: -77.46, daysBack: 2 };
        getNearbyNotableObservations(opts).then((result) => {
            result.forEach((item) => {
                result.locationUrl = `https://ebird.org/hotspot/${item.locId}`;
            });
            this.sightings = result;
            console.log(this.sightings);
        });
    }

    getSpecies() {
        let taxonomy = JSON.parse(localStorage.getItem('taxonomy'));
        if (!taxonomy) {
            getTaxonomy().then((result) => {
                this.taxonomy = result;
                localStorage.setItem('taxonomy', JSON.stringify(result));
            });
        } else {
            this.taxonomy = taxonomy;
        }
    }
}
