import { LightningElement, api } from 'lwc';
import { getAnnouncements } from 'data/restdbService';

export default class Announcements extends LightningElement {
    @api home = false;
    @api numRows = 2;
    announcements = [];
    announcement;

    connectedCallback() {
        this.fetchAnnouncements();
    }

    fetchAnnouncements() {
        const announcements = sessionStorage.getItem('announcements');
        if (announcements) {
            this.announcements = this.home
                ? JSON.parse(announcements).splice(0, this.numRows)
                : (this.announcements = JSON.parse(announcements));
        } else {
            getAnnouncements()
                .then((result) => {
                    let rows =
                        result.length < this.numRows
                            ? result.length
                            : this.numRows;
                    sessionStorage.setItem(
                        'announcements',
                        JSON.stringify(result)
                    );
                    this.announcements =
                        this.home || result.length === 1
                            ? result.splice(0, rows)
                            : result;
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    get showFooter() {
        return this.home === 'true';
    }

    handleViewAllClick() {
        this.dispatchEvent(
            new CustomEvent('viewall', {
                detail: 'announcements',
                bubbles: true,
                composed: true
            })
        );
    }
}
