import MainPresenter from './presenter/list-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';
import PointModel from './model/point-model.js';
import OfferModel from './model/offer-model.js';
import DestinationModel from './model/destination-model.js';
import NewPointView from './view/new-point-view.js';
import { render, RenderPosition } from './framework/render.js';

const siteHeaderFiltersElement = document.querySelector('.trip-controls__filters');
const siteBodySortElement = document.querySelector('.trip-events');
const siteHeaderElement = document.querySelector('.trip-main');
const filterModel = new FilterModel();
const pointModel = new PointModel();
const offerModel = new OfferModel();
const destinationModel = new DestinationModel();
const filterPresenter = new FilterPresenter(
  siteHeaderFiltersElement,
  filterModel,
  pointModel
);
const mainPresenter = new MainPresenter(
  siteBodySortElement,
  pointModel,
  offerModel,
  destinationModel,
  filterModel,
  onNewPointFormClose
);

const newPointButtonComponent = new NewPointView(onNewPointButtonClick);

function onNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function onNewPointButtonClick() {
  mainPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}
render(newPointButtonComponent,siteHeaderElement,RenderPosition.BEFOREEND);
filterPresenter.init();
mainPresenter.init();
