import { LightningElement, api } from 'lwc';

export default class Sightings extends LightningElement {
    @api sightings;
    @api header;
    @api viewtype;

    rarebirds = new Set(JSON.parse(sessionStorage.getItem('rarebirds')).map(item => item['Scientific Name']));

    get sightingList() {
        if (this.sightings.length === 0) {
            return [{id: '0', name: 'None'}];
        }
        let filteredList = [];
        const speciesSet = new Set(this.sightings.map(item => item.comName));
        speciesSet.forEach((species) => {
            let matches = this.sightings.filter(item => item.comName === species);
            let locations = this.viewtype === 'us' ? [...new Set(matches.map(item => `${item.subnational2Name}, ${item.subnational1Name}`))].sort() : new Set(matches.map(item => item.subnational2Name));
            filteredList.push(
                {
                    id: matches[0].speciesCode, 
                    name: species, 
                    locations: this.viewtype === 'us' ? Array.from(locations).join('; ') : Array.from(locations).join(', '),
                    mostRecent: Math.max(...matches.map(e => new Date(e.obsDt))),
                    scientific: matches[0].sciName,
                    class: this.rarebirds.has(matches[0].sciName) ? 'slds-cell-wrap rare' : 'slds-cell-wrap'
                }
            );
        });
        return filteredList.sort((a, b) => {return a.name > b.name ? 1 : -1});
    }

    handleSightingClick(event) {
        const code = event.currentTarget.dataset.id;
        const sightings = this.sightings.filter(item => item.speciesCode === code);
        this.dispatchEvent(new CustomEvent('sightingselected', {detail: sightings}));
    }

    get showLocations() {
        return this.viewtype !== 'nearby';
    }

}
