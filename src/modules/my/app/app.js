import { LightningElement } from 'lwc';
import { getRegions } from 'data/ebirdService';
import { getRareBirds } from 'data/restdbService';

export default class App extends LightningElement {
    dynamicCtor;
    
    async connectedCallback() {
        const regions = sessionStorage.getItem('regions');
        const regOpts = {};
        if (!regions) {
            getRegions(regOpts).then((result) => {
                sessionStorage.setItem('regions', JSON.stringify(result));
            });
        }
        const rarebirds = sessionStorage.getItem('rarebirds');
        if (!rarebirds) {
            getRareBirds()
            .then((response) => {
                return response.json();
            })
            .then((results) => {
                sessionStorage.setItem('rarebirds', JSON.stringify(results));
            })
            .catch((error) => {
                console.log(error);
            });
        }
        const ctor = await import('my/home');
        this.dynamicCtor = ctor.default;
    }

    handleMenuClick(event) {
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
