import ApiService from '../framework/api-service.js';

const HttpMethod = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class PointsApi extends ApiService {
  get points() {
    return this._load({ url: 'points' }).then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: HttpMethod.PUT,
      body: JSON.stringify(this.#adaptPointToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    return await ApiService.parseResponse(response);
  }

  async addPoint(point) {
    const response = await this._load({
      url: 'points',
      method: HttpMethod.POST,
      body: JSON.stringify(this.#adaptPointToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  }

  async deletePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: HttpMethod.DELETE,
    });

    return response;
  }

  #adaptPointToServer(point) {
    const adaptedPoint = {
      ...point,
      'base_price': point.basePrice,
      'date_from': point.dateFrom,
      'date_to': point.dateTo,
      'is_favorite': point.isFavorite,
      'destination': point.destination.toString()


    };

    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.basePrice;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.typeOffers;
    return adaptedPoint;
  }
}
