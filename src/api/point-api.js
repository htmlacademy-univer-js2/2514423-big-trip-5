import ApiService from '../framework/api-service.js';

const HttpMethod = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class PointsApi extends ApiService {
  async updatePoint(updatedPoint) {
    const response = await this._load({
      url: `points/${updatedPoint.id}`,
      method: HttpMethod.PUT,
      body: JSON.stringify(this.#convertToServerFormat(updatedPoint)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    return await ApiService.parseResponse(response);
  }

  async addPoint(newPoint) {
    const response = await this._load({
      url: 'points',
      method: HttpMethod.POST,
      body: JSON.stringify(this.#convertToServerFormat(newPoint)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    return await ApiService.parseResponse(response);
  }

  async deletePoint(targetPoint) {
    return await this._load({
      url: `points/${targetPoint.id}`,
      method: HttpMethod.DELETE,
    });
  }

  get points() {
    return this._load({ url: 'points' }).then(ApiService.parseResponse);
  }

  #convertToServerFormat(point) {
    const adaptedPoint = {
      ...point,
      'base_price': point.basePrice,
      'date_from': point.dateFrom,
      'date_to': point.dateTo,
      'is_favorite': point.isFavorite,
      'destination': point.destination.toString(),
    };

    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.typeOffers;

    return adaptedPoint;
  }
}
