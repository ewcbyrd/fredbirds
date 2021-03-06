import { LightningElement, api } from 'lwc';

export default class HotspotDetails extends LightningElement {

    @api hotspot;
    @api sightings = [];

    get showHotspot() {
        return this.hotspot !== undefined && this.hotspot !== null;
    }

    get mapUrl() {
        return `https://www.google.com/maps/embed/v1/place?key=AIzaSyCB3Q5szLx_1-UE-WIkFSgA3fFi7-KWFAM&q=${this.hotspot.latitude},${this.hotspot.longitude}&zoom=14`;
    }

    get ebirdLink() {
        return `https://ebird.org/hotspot/${this.hotspot.locId}`;
    }

    get showSpeciesList() {
        return this.sightings !== undefined && this.sightings !== null;
    }

}