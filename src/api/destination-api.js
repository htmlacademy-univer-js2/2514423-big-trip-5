import ApiService from '../framework/api-service.js';

export default class DestinationsApi extends ApiService {
  get destinations() {
    return this._load({ url: 'destinations' }).then(ApiService.parseResponse);
  }
}
