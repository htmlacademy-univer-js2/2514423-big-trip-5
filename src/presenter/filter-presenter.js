import {render,replace, remove } from '../framework/render.js';
import FilterView from '../view/filters.js';
import {filter} from '../utils/filter.js';
import {FilterType, UpdateType} from '../const.js';

export default class FilterPresenter {
  #filtersWrapper = null;
  #filterModel = null;
  #pointsModel = null;

  #filterViewComponent = null;

  constructor(filtersWrapper, filterModel, pointsModel) {
    this.#filtersWrapper = filtersWrapper;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const points = this.#pointsModel.points;
    return Object.values(FilterType).map((type) => ({
      type,
      count: filter[type](points).length
    }));
  }

  init() {
    const filters = this.filters;
    const prevfilterViewComponent = this.#filterViewComponent;
    this.#filterViewComponent = new FilterView(
      filters,
      this.#filterModel.filter,
      this.#handleFilterChange
    );

    if (prevfilterViewComponent === null) {
      render(this.#filterViewComponent, this.#filtersWrapper);
    }else{
      replace(this.#filterViewComponent, prevfilterViewComponent);
      remove(prevfilterViewComponent);
    }
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
