import { mockPoints } from '../mock/point';
import { toCamelCase } from '../utils/common';
import Observable from '../framework/observable.js';
export default class PointModel extends Observable{
  #points = mockPoints.map((point)=>toCamelCase(point));

  get points(){
    return this.#points;
  }

  updatePoints(updateType,update){
    const index = this.#points.findIndex((point)=>point.id === update.id);
    if (index === - 1){
      throw new Error('I can\'t update this point');
    }
    this.#points = [...this.#points.slice(0,index),update,...this.#points.slice(index + 1)];

    this._notify(updateType,update);
  }

  addPoints(updateType,update){
    this.#points = [...this.#points,update];

    this._notify(updateType,update);
  }

  deletePoints(updateType,update){
    const index = this.#points.findIndex((point)=>point.id === update.id);
    if (index === - 1){
      throw new Error('I can\'t update this point');
    }
    this.#points = [...this.#points.slice(0,index),...this.#points.slice(index + 1)];

    this._notify(updateType,update);
  }
}
