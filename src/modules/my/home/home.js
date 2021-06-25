import { LightningElement } from 'lwc';

export default class Home extends LightningElement {
    counter = 0;

    options = { autoScroll: true, autoScrollTime: 5 };

    items = [
        {
            image: 'resources/photos/image5.jpeg',
            header: 'Bristoe Station Heritage Park',
            description: 'June 19, 2021',
            href: '#'
        },
        {
            image: 'resources/photos/CBBT.jpg',
            header: 'Chesapeake Bay Bridge Tunnel',
            href: '#'
        },
        {
            image: 'resources/photos/Group.jpg',
            header: 'George Washington Birthplace National Monument',
            description: 'November 10, 2018',
            href: '#'
        },
        {
            image: 'resources/photos/Group1.jpg',
            header: 'Occoquan Bay National Wildlife Refuge',
            description: 'March 11, 2017',
            href: '#'
        },
        {
            image: 'resources/photos/P1020092.jpg',
            href: '#'
        },
        {
            image: 'resources/photos/Photo-Op.jpg',
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
