import { LightningElement, api } from 'lwc';
import '@lwc/synthetic-shadow';

export default class Sightings extends LightningElement {
    @api sightings;
    @api daysBack;
}
