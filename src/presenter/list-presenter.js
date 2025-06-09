import PointPresenter from './point-presenter';
import { render, RenderPosition, remove } from '../framework/render';
import { SortType, UserAction, UpdateType, FilterType } from '../const';
import { sortPointByDay, sortPointByTime } from '../utils/utils';
import { filter } from '../utils/filter.js';
import EmptyListView from '../view/empty-list';
import SortView from '../view/sort';
import NewPointPresenter from './new-point-presenter.js';
import LoadingView from '../view/loading.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const TIMEOUT_LIMIT = {
  LOWER: 350,
  UPPER: 1000,
};

export default class MainPresenter {
  #pointsModel;
  #offersModel;
  #destinationsModel;
  #filtersModel;
  #mainContainer;
  #eventsListContainer;
  #newPointFormPresenter;
  #pointPresentersMap = new Map();
  #currentSortComponent = null;
  #currentSortType = SortType.DAY;
  #loadingIndicator = new LoadingView();
  #isLoadingData = true;
  #uiBlocker = new UiBlocker({
    lowerLimit: TIMEOUT_LIMIT.LOWER,
    upperLimit: TIMEOUT_LIMIT.UPPER
  });

  constructor(container, pointsModel, offersModel, destinationsModel, filtersModel, onNewPointFormDestroy) {
    const listElement = document.createElement('ul');
    listElement.className = 'trip-events__list';
    container.appendChild(listElement);
    this.#mainContainer = container;
    this.#eventsListContainer = listElement;

    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#filtersModel = filtersModel;
    this.#destinationsModel = destinationsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#offersModel.addObserver(this.#handleModelEvent);
    this.#destinationsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);

    this.#newPointFormPresenter = new NewPointPresenter(
      listElement,
      this.#handleViewAction,
      onNewPointFormDestroy
    );
  }

  get filteredPoints() {
    const activeFilter = this.#filtersModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[activeFilter](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        filteredPoints.sort(sortPointByDay);
        break;
      case SortType.TIME:
        filteredPoints.sort(sortPointByTime);
        break;
      case SortType.PRICE:
        filteredPoints.sort((a, b) => b.basePrice - a.basePrice);
        break;
    }

    return filteredPoints;
  }

  get offersModel() {
    return this.#offersModel;
  }

  get destinationsModel() {
    return this.#destinationsModel;
  }

  get container() {
    return this.#eventsListContainer;
  }

  init() {
    this.#renderPointsSection();
  }

  createPoint = () => {
    this.#currentSortType = SortType.DAY;
    this.#filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointFormPresenter.init(this.#offersModel, this.#destinationsModel);
  };

  #handleSortTypeChange = (newSortType) => {
    if (newSortType === this.#currentSortType) {
      return;
    }
    this.#currentSortType = newSortType;
    this.#clearPointsSection({ resetSortType: true });
    this.#renderPointsSection();
  };

  #handleViewAction = async (actionType, updateType, updateData) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresentersMap.get(updateData.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, updateData);
        } catch {
          this.#pointPresentersMap.get(updateData.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointFormPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, updateData);
        } catch {
          this.#newPointFormPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresentersMap.get(updateData.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, updateData);
        } catch {
          this.#pointPresentersMap.get(updateData.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModeChange = () => {
    this.#newPointFormPresenter.destroy();
    this.#pointPresentersMap.forEach((presenter) => presenter.resetViewToDefault());
  };

  #handleModelEvent = (updateType, updatedData) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresentersMap.get(updatedData.id).init(updatedData);
        break;
      case UpdateType.MINOR:
        this.#clearPointsSection();
        this.#renderPointsSection();
        break;
      case UpdateType.MAJOR:
        this.#clearPointsSection({ resetSortType: true });
        this.#renderPointsSection();
        break;
      case UpdateType.INIT:
        if (this.#pointsModel.isLoaded && this.#offersModel.isLoaded && this.#destinationsModel.isLoaded) {
          this.#isLoadingData = false;
          remove(this.#loadingIndicator);
          this.#renderPointsSection();
        }
        break;
    }
  };

  #renderPointsSection() {
    if (this.#isLoadingData) {
      this.#renderLoadingIndicator();
      return;
    }

    const pointsCount = this.filteredPoints.length;

    if (pointsCount === 0) {
      render(new EmptyListView(this.#filtersModel.filter), this.#eventsListContainer, RenderPosition.AFTEREND);
      return;
    }

    this.#renderSortControls();

    for (const point of this.filteredPoints) {
      const pointPresenter = new PointPresenter(
        this.container,
        this.offersModel,
        this.destinationsModel,
        this.#handleViewAction,
        this.#handleModeChange
      );
      pointPresenter.init(point);
      this.#pointPresentersMap.set(point.id, pointPresenter);
    }
  }

  #renderSortControls() {
    if (this.#currentSortComponent) {
      remove(this.#currentSortComponent);
    }
    this.#currentSortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#currentSortComponent, this.#mainContainer, RenderPosition.AFTERBEGIN);
  }

  #clearPointsSection({ resetSortType = false } = {}) {
    this.#newPointFormPresenter.destroy();
    this.#pointPresentersMap.forEach((presenter) => presenter.destroy());
    this.#pointPresentersMap.clear();
    remove(this.#currentSortComponent);
    remove(this.#loadingIndicator);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderLoadingIndicator() {
    render(this.#loadingIndicator, this.#eventsListContainer, RenderPosition.AFTERBEGIN);
  }
}
