import { LightningElement, api } from 'lwc';

export default class Sightings extends LightningElement {
    @api sightings;
    @api header;
    @api viewtype;
    @api filter;

    rarebirds = new Set(
        JSON.parse(sessionStorage.getItem('rarebirds')).map(
            (item) => item['Scientific Name']
        )
    );

    get sightingList() {
        if (!this.sightings || this.sightings.length === 0) {
            return [{ id: '0', name: 'None' }];
        }
        let filteredList = [];
        const speciesSet = new Set(this.sightings.map((item) => item.comName));
        speciesSet.forEach((species) => {
            let matches = this.sightings.filter(
                (item) => item.comName === species
            );
            let locations =
                this.viewtype === 'us'
                    ? [
                          ...new Set(
                              matches.map(
                                  (item) =>
                                      `${item.subnational2Name}, ${item.subnational1Name}`
                              )
                          )
                      ].sort()
                    : new Set(matches.map((item) => item.subnational2Name));
            if (
                (this.filter === 'rare' &&
                    this.rarebirds.has(matches[0].sciName)) ||
                this.filter === 'notable' ||
                this.filter === 'all'
            ) {
                // Create individual sighting records like in sightingDetails component
                let individualSightings = [];
                matches.forEach((item) => {
                    if (individualSightings.findIndex((temp) => temp.id === item.obsId) < 0) {
                        individualSightings.push({
                            id: item.obsId, 
                            location: item.locName, 
                            locality: item.subnational2Name === undefined ? '' : `${item.subnational2Name}, ${item.subnational1Name}`, 
                            quantity: item.howMany, 
                            by: item.userDisplayName, 
                            date: item.obsDt
                        });
                    }
                });
                
                filteredList.push({
                    id: matches[0].speciesCode,
                    name: species,
                    locations:
                        this.viewtype === 'us'
                            ? Array.from(locations).join('; ')
                            : Array.from(locations).join(', '),
                    mostRecent: Math.max(
                        ...matches.map((e) => new Date(e.obsDt))
                    ),
                    scientific: matches[0].sciName,
                    isRare: this.rarebirds.has(matches[0].sciName),
                    individualSightings: individualSightings,
                    class:
                        this.rarebirds.has(matches[0].sciName) &&
                        this.filter !== 'rare'
                            ? 'slds-cell-wrap rare'
                            : 'slds-cell-wrap'
                });
            }
        });
        return filteredList.sort((a, b) => {
            return a.name > b.name ? 1 : -1;
        });
    }

    handleSightingClick(event) {
        const code = event.currentTarget.dataset.id;
        const sightings = this.sightings.filter(
            (item) => item.speciesCode === code
        );
        this.dispatchEvent(
            new CustomEvent('sightingselected', { detail: sightings })
        );
    }

    handleIndividualSightingsToggle(event) {
        const sightingId = event.currentTarget.dataset.id;
        const detailsElement = this.template.querySelector(`.individual-sightings-details[data-id="${sightingId}"]`);
        
        if (detailsElement) {
            const isExpanded = !detailsElement.classList.contains('slds-hide');
            
            if (isExpanded) {
                detailsElement.classList.add('slds-hide');
            } else {
                detailsElement.classList.remove('slds-hide');
            }
        }
    }

    get showLocations() {
        return this.viewtype !== 'nearby';
    }

    @api get numSightings() {
        return this.sightingList === undefined ? 0 : this.sightingList.length;
    }

    // Modal and map functionality
    showMapModal = false;
    selectedSightingLocation = null;
    lat = null;
    lon = null;

    get mapUrl() {
        if (this.lat && this.lon) {
            return `https://www.google.com/maps/embed/v1/place?key=AIzaSyCB3Q5szLx_1-UE-WIkFSgA3fFi7-KWFAM&q=${this.lat},${this.lon}&zoom=15`;
        }
        return null;
    }

    handleIndividualSightingClick(event) {
        const obsId = event.currentTarget.dataset.id;
        
        // Find the selected sighting from all raw sightings data
        const selectedSighting = this.sightings.find((item) => item.obsId === obsId);
        
        if (selectedSighting) {
            this.selectedSightingLocation = {
                location: selectedSighting.locName,
                locality: selectedSighting.subnational2Name === undefined ? '' : `${selectedSighting.subnational2Name}, ${selectedSighting.subnational1Name}`,
                date: selectedSighting.obsDt
            };
            this.lat = selectedSighting.lat;
            this.lon = selectedSighting.lng;
            this.showMapModal = true;
        }
    }

    handleMapModalClose() {
        this.showMapModal = false;
        this.selectedSightingLocation = null;
        this.lat = null;
        this.lon = null;
    }
}
