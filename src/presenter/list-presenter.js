import PointPresenter from './point-presenter';
import { render, RenderPosition, remove } from '../framework/render';
import { SortType, UserAction, UpdateType, FilterType } from '../const';
import { sortPointByDay, sortPointByTime } from '../utils/utils.js';
import {filter} from '../utils/filter.js';
import EmptyListView from '../view/empty-list.js';
import SortView from '../view/sort.js';
import NewPointPresenter from './new-point-presenter.js';

export default class MainPresenter{
  #pointModel;
  #offerModel;
  #destinationModel;
  #filterModel;
  #mainContainer;
  #pointsListElement;
  #newPointPresenter;
  #pointsPresenters = new Map();
  #sortComponent = null;
  #currentSortType = SortType.DAY;

  constructor(container,pointModel,offerModel,destinationModel, filterModel, onNewPointDestroy){
    const tripEventsList = document.createElement('ul');
    tripEventsList.className = 'trip-events__list';
    container.appendChild(tripEventsList);
    this.#mainContainer = container;
    this.#pointsListElement = tripEventsList;
    this.#pointModel = pointModel;
    this.#offerModel = offerModel;
    this.#filterModel = filterModel;
    this.#destinationModel = destinationModel;
    this.#pointModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#newPointPresenter = new NewPointPresenter(
      tripEventsList,
      this.#handleViewAction,
      onNewPointDestroy
    );
  }

  get points(){
    const filterType = this.#filterModel.filter;
    const points = this.#pointModel.points;
    const filteredPoints = filter[filterType](points);
    switch(this.#currentSortType){
      case SortType.DAY:
        filteredPoints.sort(sortPointByDay);
        break;
      case SortType.TIME:
        filteredPoints.sort(sortPointByTime);
        break;
      case SortType.PRICE:
        filteredPoints.sort((a,b)=>b.basePrice - a.basePrice);
        break;
    }
    return filteredPoints;
  }

  get offerModel(){
    return this.#offerModel;
  }

  get destinationModel(){
    return this.#destinationModel;
  }

  init(){
    this.#renderPoints();
  }

  createNewPoint = () => {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init(this.#offerModel,this.#destinationModel);
  };

  #onSortTypeChange = (changeSortType) => {
    if(changeSortType === this.#currentSortType){
      return;
    }
    this.#currentSortType = changeSortType;
    this.#clearPointList({resetRenderedPointCount:true});
    this.#renderPoints();

  };

  #renderSort(){
    this.#sortComponent = new SortView({currentSortType: this.#currentSortType, onSortTypeChange: this.#onSortTypeChange});
    render(this.#sortComponent,this.#mainContainer,RenderPosition.AFTERBEGIN);
  }

  #renderPoints(){
    const pointsCount = this.points.length;
    if (pointsCount === 0){
      render(new EmptyListView(this.#filterModel.filter),this.#pointsListElement,RenderPosition.AFTEREND);
      return;
    }
    this.#renderSort();
    for(let i = 0; i < pointsCount; i++){
      const pointPresenter = new PointPresenter(
        this.container,
        this.offerModel,
        this.destinationModel,
        this.#handleViewAction,
        this.#handleModeChange);
      pointPresenter.init(this.points[i]);
      this.#pointsPresenters.set(this.points[i].id,pointPresenter);
    }
  }

  #clearPointList({resetSortType = false} = {}){
    this.#newPointPresenter.destroy();
    this.#pointsPresenters.forEach((pointPresenter)=>pointPresenter.destroy());
    this.#pointsPresenters.clear();
    remove(this.#sortComponent);
    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch(actionType){
      case UserAction.UPDATE_POINT:
        this.#pointModel.updatePoints(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointModel.addPoints(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointModel.deletePoints(updateType, update);
        break;
    }
  };

  #handleModeChange = () =>{
    this.#newPointPresenter.destroy();
    this.#pointsPresenters.forEach((pointPresenter)=>pointPresenter.resetView());
  };

  #handleModelEvent = (updateType,update) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointsPresenters.get(update.id).init(update);
        break;
      case UpdateType.MINOR:
        this.#clearPointList();
        this.#renderPoints();
        break;
      case UpdateType.MAJOR:
        this.#clearPointList({resetRenderedPointCount: true, resetSortType: true});
        this.#renderPoints();
        break;
    }
  };

  get container(){
    return this.#pointsListElement;
  }
}
