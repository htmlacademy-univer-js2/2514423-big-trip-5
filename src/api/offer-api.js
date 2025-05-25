import ApiService from '../framework/api-service.js';

export default class OffersApi extends ApiService {
  get allOffers() {
    return this._load({ url: 'offers' }).then(ApiService.parseResponse);
  }
}
