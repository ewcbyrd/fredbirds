import { LightningElement } from 'lwc';
import {
    getHotspotDetails,
    getSpeciesDetailsByLocation
} from 'data/ebirdService';

export default class HotspotParent extends LightningElement {
    hotspot;
    sightings;

    handleHotspotClick(event) {
        getHotspotDetails({ locId: event.detail }).then((results) => {
            this.hotspot = results;
            getSpeciesDetailsByLocation({ locId: this.hotspot.locId }).then(
                (species) => {
                    this.sightings = species.sort((a, b) => {
                        return a.comName > b.comName ? 1 : -1;
                    });
                }
            );
        });
    }

    handleLocationChange() {
        this.hotspot = undefined;
        this.sightings = undefined;
    }
}
