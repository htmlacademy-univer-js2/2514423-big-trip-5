import { mockOffers } from '../mock/offer';

const FIRST_ELEMENT = 0;

export default class OfferModel {
  #offerList = mockOffers;

  get offers() {
    return this.#offerList;
  }

  getOfferById(type, offerId){
    return this.#offerList.filter((offer)=> offer.type === type)[FIRST_ELEMENT]
      .offers.find((item)=>item.id === offerId);
  }

  getOfferByType(type){
    return this.#offerList.filter((offer) => offer.type === type).map((offer) => offer.offers).flat();
  }
}
