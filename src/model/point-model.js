import { mockPoints } from '../mock/point';

export default class PointModel{
  #points = mockPoints;

  get points(){
    return this.#points;
  }
}
