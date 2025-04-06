import { mockDestinations } from '../mock/destination';
import { mockOffers } from '../mock/offer';
import { mockPoints } from '../mock/point';
const FIRST_ELEMENT = 0;

export default class PointModel {
  #points = mockPoints;
  #pointOffers = mockOffers;
  #destinations = mockDestinations;

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#pointOffers;
  }

  getOfferById(type, id){
    return this.#pointOffers.filter((offer)=> offer.type === type)[FIRST_ELEMENT]
      .offers.find((item)=>item.id === id);
  }

  getOfferByType(type){
    return this.#pointOffers.filter((offer)=> offer.type === type)[FIRST_ELEMENT];
  }

  getDestinationById(id) {
    return this.#destinations.find((item) => item.id === id);
  }
}
