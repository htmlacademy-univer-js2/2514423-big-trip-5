import ApiService from '../framework/api-service.js';

export default class DestinationsApi extends ApiService {
  get allDestinations() {
    return this._load({ url: 'destinations' }).then(ApiService.parseResponse);
  }
}
