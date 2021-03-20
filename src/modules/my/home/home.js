import { LightningElement } from 'lwc';

export default class Home extends LightningElement {
    counter = 0;

    options = { autoScroll: true, autoScrollTime: 5 };

    items = [
        {
            image:
                'https://fredbirds-098f.restdb.io/media/60283a54b0bc995a0001f177',
            header: 'Chesapeake Bay Bridge Tunnel',
            href: '#'
        },
        {
            image:
                'https://fredbirds-098f.restdb.io/media/60283a58b0bc995a0001f178',
            header: 'George Washington Birthplace National Monument',
            description: 'November 10, 2018',
            href: '#'
        },
        {
            image:
                'https://fredbirds-098f.restdb.io/media/60283a5bb0bc995a0001f17a',
            header: 'Occoquan Bay National Wildlife Refuge',
            description: 'March 11, 2017',
            href: '#'
        },
        {
            image:
                'https://fredbirds-098f.restdb.io/media/60283a5db0bc995a0001f17b',
            href: '#'
        },
        {
            image:
                'https://fredbirds-098f.restdb.io/media/60283a5fb0bc995a0001f17d',
            header: 'Mattamuskeet National Wildlife Refuge',
            href: '#'
        }
    ];

    showModal = false;
    modalDetail = {};

    handleMemberEvent(event) {
        this.showModal = true;
        this.modalDetail = event.detail;
    }

    handleOkClick() {
        this.showModal = false;
    }
}
