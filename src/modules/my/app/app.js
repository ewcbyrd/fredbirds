import { LightningElement } from 'lwc';
import { getRegions } from 'data/ebirdService';

export default class App extends LightningElement {
    dynamicCtor;
    
    async connectedCallback() {
        let regions = sessionStorage.getItem('regions');
        const regOpts = {};
        if (!regions) {
            getRegions(regOpts).then((result) => {
                sessionStorage.setItem('regions', JSON.stringify(result));
            });
        }
        const ctor = await import('my/home');
        this.dynamicCtor = ctor.default;
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

    async displayComponent(source) {
        let ctor;
        switch(source) {
            case 'home':
                ctor = await import('my/home');
                break;
            case 'about':
                ctor = await import('my/about');
                break;
            case 'announcements':
                ctor = await import('my/announcements');
                break;
            case 'events':
                ctor = await import('my/eventParent');
                break;
            case 'membership':
                ctor = await import('my/membership');
                break;
            case 'newsletters':
                ctor = await import('my/newsletterParent');
                break;
            case 'faqs':
                ctor = await import('my/faqs');
                break;
            case 'contact':
                ctor = await import('my/contact');
                break;
            case 'sightings':
                ctor = await import('my/resources');
                break;
            case 'hotspots':
                ctor = await import('my/hotspotParent');
                break;
            case 'news':
                ctor = await import('my/news');
                break;
            default:
        }
        
        this.dynamicCtor = ctor.default;
    }
}
