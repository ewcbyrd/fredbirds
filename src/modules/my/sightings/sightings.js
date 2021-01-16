import { LightningElement, api } from 'lwc';

export default class Sightings extends LightningElement {
    @api sightings;
    @api daysBack;

    get sightingList() {
        let filteredList = [];
        this.sightings.forEach((item) => {
            if (
                !filteredList.find(
                    (element) =>
                        element.comName === item.comName &&
                        element.locName === item.locName
                )
            ) {
                filteredList.push({
                    comName: item.comName,
                    locName: item.locName
                });
            }
        });
        return filteredList;
    }
}
