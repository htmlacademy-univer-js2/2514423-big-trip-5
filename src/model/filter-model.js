import Observable from '../framework/observable.js';
import { FilterType } from '../const.js';

export default class FilterModel extends Observable {
  #currentFilter = FilterType.EVERYTHING;

  get filter() {
    return this.#currentFilter;
  }

  setFilter(updateType, newFilter) {
    this.#currentFilter = newFilter;
    this._notify(updateType, newFilter);
  }
}
