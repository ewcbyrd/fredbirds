import { LightningElement, api } from 'lwc';
import {getSpeciesDetailsByLocation} from 'data/ebirdService';

export default class Birds extends LightningElement {

    birds = [];
    treeItems = [];
    selected = 'amecro';

    connectedCallback() {
        this.getBirds('US-VA');
    }

    @api getBirds(locId) {
        const birds = sessionStorage.getItem(`${locId}Birds`);
        if (birds) {
            this.birds = JSON.parse(birds);
            this.generateTreeItems();
            return;
        }
        getSpeciesDetailsByLocation({locId: locId})
        .then(species => {
            if (species.length === 0) {
                return;
            }
            this.birds = species.sort((a,b) => {return a.comName > b.comName ? 1 : -1});
            this.generateTreeItems();
            sessionStorage.setItem(`${locId}Birds`, JSON.stringify(this.birds));
        })
        .catch(error => {
            console.log(error);
        });
    }

    generateTreeItems() {
        const birds = this.birds;
        let treeItems = [];
        const families = new Set(birds.map(item => item.familyComName));

        [...families].sort().forEach((family) => {
            let filteredBirds = birds.filter((item) => item.familyComName === family);
            let treeItem = {label: family, items: []};
            filteredBirds.forEach((bird) => {
                treeItem.items.push({label: bird.comName, name: bird.speciesCode});
            })
            treeItems.push(treeItem);
        });
        this.treeItems = treeItems;
    }

    handleSpeciesSelect(event) {
        const selectedCode = event.detail.name;
        if (!selectedCode) return;
        alert(JSON.stringify(event.detail));
    }

}