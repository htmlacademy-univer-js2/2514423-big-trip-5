import { UpdateType } from '../const';
import Observable from '../framework/observable';

const FIRST_ELEMENT = 0;

export default class OfferModel extends Observable {
  #offerList = [];
  #offersApi;
  #loaded = false;

  constructor(offersApi) {
    super();
    this.#offersApi = offersApi;
  }

  async init() {
    try {
      this.#offerList = await this.#offersApi.offerList;
    } catch (err) {
      this.#offerList = [];
    }
    this.#loaded = true;
    this._notify(UpdateType.INIT);
  }

  get offerList() {
    return this.#offerList;
  }

  get loaded() {
    return this.#loaded;
  }

  getOfferById(type, offerId) {
    if (this.#offerList.length === 0) {
      return;
    }
    return this.#offerList.filter((offer) => offer.type === type)[FIRST_ELEMENT].offers.find((item) => item.offerId === offerId);
  }

  getOfferByType(type) {
    return this.#offerList.filter((offer) => offer.type === type).map((offer) => offer.offers).flat();
  }
}
