import { LightningElement, api } from 'lwc';

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
            fetch(('https://fredbirds-098f.restdb.io/rest/news?q={"expires":{"$gt":{"$date":"$now"}}}&h={"$orderby": {"expires": -1}}'), {
                method: 'GET',
                headers: {
                    'cache-control': 'no-cache',
                    'x-apikey': '5ff9ea16823229477922c93f'
                }
            })
            .then((response) => {
                return response.json();
            })
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