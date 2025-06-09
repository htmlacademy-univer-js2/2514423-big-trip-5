import { render, replace, remove } from '../framework/render.js';
import FilterView from '../view/filters.js';
import { filter } from '../utils/filter.js';
import { FilterType, UpdateType } from '../const.js';

export default class FilterPresenter {
  #container = null;
  #filterState = null;
  #pointsData = null;

  #filterViewComponent = null;

  constructor(container, filterState, pointsData) {
    this.#container = container;
    this.#filterState = filterState;
    this.#pointsData = pointsData;

    this.#pointsData.addObserver(this.#handleModelEvent);
    this.#filterState.addObserver(this.#handleModelEvent);
  }

  get availableFilters() {
    const points = this.#pointsData.points;
    return Object.values(FilterType).map((filterType) => ({
      type: filterType,
      count: filter[filterType](points).length,
    }));
  }

  init() {
    const filters = this.availableFilters;
    const prevFilterComponent = this.#filterViewComponent;

    this.#filterViewComponent = new FilterView(
      filters,
      this.#filterState.filter,
      this.#handleFilterChange
    );

    if (prevFilterComponent === null) {
      render(this.#filterViewComponent, this.#container);
    } else {
      replace(this.#filterViewComponent, prevFilterComponent);
      remove(prevFilterComponent);
    }
  }

  #handleFilterChange = (newFilterType) => {
    if (this.#filterState.filter === newFilterType) {
      return;
    }
    this.#filterState.setFilter(UpdateType.MAJOR, newFilterType);
  };

  #handleModelEvent = () => {
    this.init();
  };
}
