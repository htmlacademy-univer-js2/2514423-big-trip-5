import AbstractView from '../framework/view/abstract-view.js';
import { capitalizeString } from '../utils/utils.js';

function getFilteredTemplate(filter) {
  return `
  <form class="trip-filters" action="#" method="get">
    ${filter.map(({ type, count }) =>
    `<div class="trip-filters__filter">
      <input
        id="filter-${type}"
        class="trip-filters__filter-input visually-hidden"
        type="radio"
        name="trip-filter"
        value="${type}"
        ${count === 0 && 'disabled'}
        ${type === 'everything' && 'checked'}
      >
      <label class="trip-filters__filter-label" for="filter-${type}">${capitalizeString(type)}</label>
    </div>`
  ).join('')}

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
}

export default class Filters extends AbstractView{
  #filter;
  constructor(filter){
    super();
    this.#filter = filter;
  }

  get template(){
    return getFilteredTemplate(this.#filter);
  }
}
