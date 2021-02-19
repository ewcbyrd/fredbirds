import { LightningElement, api } from 'lwc';

export default class Sightings extends LightningElement {
    @api sightings;
    @api header;

    get sightingList() {
        let filteredList = [];
        const speciesSet = new Set(this.sightings.map(item => item.comName));
        speciesSet.forEach((species) => {
            let matches = this.sightings.filter(item => item.comName === species);
            let locations = new Set(matches.map(item => item.subnational2Name));
            filteredList.push({id: matches[0].speciesCode, name: species, locations: Array.from(locations).join(', ') });

        });
        return filteredList.sort((a, b) => {return a.name > b.name ? 1 : -1});
    }

    handleSightingClick(event) {
        const code = event.currentTarget.dataset.id;
        const sightings = this.sightings.filter(item => item.speciesCode === code);
        this.dispatchEvent(new CustomEvent('sightingselected', {detail: sightings}));
    }

}
