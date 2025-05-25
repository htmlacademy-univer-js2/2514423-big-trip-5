import { mockPoints } from '../mock/point';
import { toCamelCase } from '../utils/common';
import Observable from '../framework/observable.js';

export default class PointModel extends Observable {
  #pointList = mockPoints.map((point) => toCamelCase(point));

  get points() {
    return this.#pointList;
  }

  updatePoints(updateType, updatedPoint) {
    const index = this.#pointList.findIndex((point) => point.id === updatedPoint.id);
    if (index === -1) {
      throw new Error('Unable to update: point not found');
    }

    this.#pointList = [
      ...this.#pointList.slice(0, index),
      updatedPoint,
      ...this.#pointList.slice(index + 1)
    ];

    this._notify(updateType, updatedPoint);
  }

  addPoints(updateType, newPoint) {
    this.#pointList = [...this.#pointList, newPoint];
    this._notify(updateType, newPoint);
  }

  deletePoints(updateType, pointToDelete) {
    const index = this.#pointList.findIndex((point) => point.id === pointToDelete.id);
    if (index === -1) {
      throw new Error('Unable to delete: point not found');
    }

    this.#pointList = [
      ...this.#pointList.slice(0, index),
      ...this.#pointList.slice(index + 1)
    ];

    this._notify(updateType, pointToDelete);
  }
}
