import { LightningElement, api } from 'lwc';
import {
    getNews
} from 'data/restdbService';

export default class News extends LightningElement {

    @api home = false;
    @api numRows = 3;
    loading = false;
    news = [];

    connectedCallback() {
        this.fetchNews();
    }

    fetchNews() {
        const news = sessionStorage.getItem('news');
        this.loading = true;
        if (news) {
            this.news = this.home ? JSON.parse(news).splice(0, this.numRows) : this.news = JSON.parse(news);
            this.loading = false;
        } else {
            getNews()
            .then((result) => {
                this.loading = false;
                let rows = result.length < this.numRows ? result.length : this.numRows;
                sessionStorage.setItem('news', JSON.stringify(result));
                this.news = this.home || result.length === 1 ? result.splice(0, rows) : result;
            })
            .catch((error) => {
                console.log(error);
            });
        }
    }

    get birdNews() {
        this.news.forEach((item) => {
            item.isLink = item.type === 'link';
        })
        return this.news;
    }

    get showFooter() {
        return this.home === 'true';
    }

    handleViewAllClick() {
        this.dispatchEvent(new CustomEvent('viewall', { detail: 'news', bubbles: true, composed: true }));
    }
}