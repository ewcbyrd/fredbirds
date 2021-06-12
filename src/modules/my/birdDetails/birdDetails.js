import { LightningElement, api } from 'lwc';
import {} from 'data/ebirdService';

export default class BirdDetails extends LightningElement {
    bird = JSON.parse(
        '{"sciName":"Corvus brachyrhynchos","comName":"American Crow","speciesCode":"amecro","category":"species","taxonOrder":20638,"bandingCodes":["AMCR"],"comNameCodes":[],"sciNameCodes":["COBR"],"order":"Passeriformes","familyComName":"Crows, Jays, and Magpies","familySciName":"Corvidae"}'
    );

    @api getBird(speciesCode, listCode) {
        const birds = JSON.parse(sessionStorage.getItem(`${listCode}Birds`));
        this.bird = birds.find((item) => item.speciesCode === speciesCode);
        console.log(JSON.stringify(this.bird));
    }
}
