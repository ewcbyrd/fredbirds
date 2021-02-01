import { LightningElement, api } from 'lwc';

export default class Sightings extends LightningElement {
    @api sightings;
    @api header;

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
                    locName: item.locName,
                    obsId: item.obsId
                });
            }
        });
        return filteredList;
    }
}
