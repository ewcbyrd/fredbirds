import { LightningElement } from 'lwc';
import {getHotspotDetails, getSpeciesList} from 'data/ebirdService';

export default class HotspotParent extends LightningElement {

    hotspot;
    sightings;

    handleHotspotClick(event) {
        const taxonomy = JSON.parse(localStorage.getItem('taxonomy'));
        getHotspotDetails({locId: event.detail}).then(results => {
            this.hotspot = results;
            getSpeciesList({locId: this.hotspot.locId}).then(species => {
                const birds = taxonomy.filter((item) => species.includes(item.speciesCode));
                this.sightings = birds.sort((a,b) => {return a.comName > b.comName ? 1 : -1});
            });
        });
    }

    handleLocationChange() {
        this.hotspot = undefined;
        this.sightings = undefined;
    }
}