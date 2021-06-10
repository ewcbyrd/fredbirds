import { LightningElement } from 'lwc';
import {} from 'data/ebirdService';

export default class BirdParent extends LightningElement {

    vaSelected = true;
    localSelected = false;
    usSelected = false;

    get getVirginiaVariant() {
        return this.vaSelected ? 'brand' : 'neutral';
    }

    get getUSVariant() {
        return this.usSelected ? 'brand' : 'neutral';
    }

    get LocalVariant() {
        return this.localSelected ? 'brand' : 'neutral';
    }

    handleFilterClick(event) {
        let buttons = this.template.querySelectorAll('lightning-button');
        buttons.forEach(item => {
            this[`${item.title}Selected`] = false;
        })
        this[`${event.target.title}Selected`] = true;
        this.template.querySelector('my-birds').getBirds(event.target.value);
    }
}