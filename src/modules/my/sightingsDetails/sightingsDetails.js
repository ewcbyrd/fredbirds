/* eslint-disable @lwc/lwc/no-api-reassignments */
import { LightningElement, api } from 'lwc';

export default class SightingsDetails extends LightningElement {

    @api sightings;
    @api lat;
    @api lon;
    @api viewtype;
   
    get showSightings() {
        return this.sightings !== undefined && this.sightings.length > 0;
    }

    get header() {
        return `${this.sightings[0].comName} (${this.sightings[0].sciName})`;
    }

    get sightingList() {
        let tempList = [];
        this.sightings.forEach((item) => {
            if (tempList.findIndex((temp) => temp.id === item.obsId) < 0) {
                tempList.push({id: item.obsId, location: item.locName, locality: item.subnational2Name === undefined ? '' : `${item.subnational2Name}, ${item.subnational1Name}`, quantity: item.howMany, by: item.userDisplayName, date: item.obsDt});
            }
        });
        return tempList;
    }

    get mapUrl() {
        return `https://www.google.com/maps/embed/v1/place?key=AIzaSyCB3Q5szLx_1-UE-WIkFSgA3fFi7-KWFAM&q=${this.lat},${this.lon}&zoom=15`;
    }

    get showMap() {
        return this.lat && this.lon;
    }

    handleSightingClick(event) {
        const obsId = event.currentTarget.dataset.id;
        const selectedSighting = this.sightings.find((item) => item.obsId === obsId);
        this.lat = selectedSighting.lat;
        this.lon = selectedSighting.lng;
    }

    get showLocations() {
        return this.viewtype !== 'nearby';
    }
}