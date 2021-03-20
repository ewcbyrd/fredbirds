import { LightningElement } from 'lwc';
import { getRegions, getTaxonomy } from 'data/ebirdService';

export default class App extends LightningElement {
    homeSelected = true;
    sightingsSelected = false;
    hotspotsSelected = false;
    officersSelected = false;
    newsSelected = false;
    aboutSelected = false;
    membershipSelected = false;
    announcementsSelected = false;
    birdsOpen = false;
    clubOpen = false;
    properties = {
        home: true,
        sightings: false,
        hotspots: false,
        events: false,
        officers: false,
        news: false,
        about: false,
        membership: false,
        announcements: false
    };

    connectedCallback() {
        const opts = {};
        if (!localStorage.getItem('regions')) {
            getRegions(opts).then((result) => {
                localStorage.setItem('regions', JSON.stringify(result));
            });
        }

        if (!localStorage.getItem('taxonomy')) {
            getTaxonomy().then((results) =>
                localStorage.setItem('taxonomy', JSON.stringify(results))
            );
        }
    }

    handleBirdsClick() {
        if (this.clubOpen) this.handleClubClick();
        let classList = this.template.querySelector('.birds').classList;
        if (this.birdsOpen) {
            classList.remove('slds-is-open');
            this.birdsOpen = false;
        } else {
            classList.add('slds-is-open');
            this.birdsOpen = true;
        }
    }

    handleClubClick() {
        if (this.birdsOpen) this.handleBirdsClick();
        let classList = this.template.querySelector('.club').classList;
        if (this.clubOpen) {
            classList.remove('slds-is-open');
            this.clubOpen = false;
        } else {
            classList.add('slds-is-open');
            this.clubOpen = true;
        }
    }

    get homeStyle() {
        return this.getMenuStyle(this.homeSelected);
    }

    get birdsStyle() {
        return this.sightingsSelected || this.hotspotsSelected ? '' : '';
    }

    getMenuStyle(selected) {
        return selected ? 'slds-context-bar__item' : 'slds-context-bar__item';
    }

    handleMenuClick(event) {
        if (this.birdsOpen) this.handleBirdsClick();
        if (this.clubOpen) this.handleClubClick();
        this.displayComponent(event.target.title);
    }

    handleViewAll(event) {
        this.displayComponent(event.detail);
    }

    displayComponent(source) {
        // eslint-disable-next-line guard-for-in
        for (const prop in this.properties) {
            this.properties[prop] = false;
            this[`${prop}Selected`] = false;
        }
        this.properties[source] = true;
        this[`${source}Selected`] = true;
    }
}
