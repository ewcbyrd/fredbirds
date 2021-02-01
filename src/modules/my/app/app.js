import { LightningElement } from 'lwc';

export default class App extends LightningElement {
    homeSelected = true;
    sightingsSelected = false;
    hotspotsSelected = false;
    membershipSelected;

    handleHomeClick() {
        this.homeSelected = true;
        this.sightingsSelected = false;
        this.hotspotsSelected = false;
        this.membershipSelected = false;
    }

    handleResourcesClick() {
        this.homeSelected = false;
        this.sightingsSelected = true;
        this.hotspotsSelected = false;
        this.membershipSelected = false;
    }

    handleHotspotsClick() {
        this.homeSelected = false;
        this.sightingsSelected = false;
        this.hotspotsSelected = true;
        this.membershipSelected = false;
    }

    handleMembershipClick() {
        this.homeSelected = false;
        this.sightingsSelected = false;
        this.hotspotsSelected = false;
        this.membershipSelected = true;
    }

    get homeStyle() {
        return this.getMenuStyle(this.homeSelected);
    }

    get sightingsStyle() {
        return this.getMenuStyle(this.sightingsSelected);
    }

    get hotspotsStyle() {
        return this.getMenuStyle(this.hotspotsSelected);
    }
    get membershipStyle() {
        return this.getMenuStyle(this.membershipSelected);
    }

    getMenuStyle(selected) {
        return selected
            ? 'slds-context-bar__item slds-is-active'
            : 'slds-context-bar__item';
    }
}
