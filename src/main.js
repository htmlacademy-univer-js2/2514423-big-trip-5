import MainPresenter from './presenter/list-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';
import PointModel from './model/point-model.js';
import OfferModel from './model/offer-model.js';
import DestinationModel from './model/destination-model.js';
import NewPointView from './view/new-point.js';
import { render, RenderPosition } from './framework/render.js';
import PointsApiService from './api/point-api.js';
import OffersApiService from './api/offer-api.js';
import DestinationsApiService from './api/destination-api.js';
import RoutePresenter from './presenter/route-presenter.js';

const AUTHORIZATION = 'Basic 92k5hj4n4bdm4q2f';
const API_URL = 'https://24.objects.htmlacademy.pro/big-trip';
const filterContainer = document.querySelector('.trip-controls__filters');
const siteBodySortElement = document.querySelector('.trip-events');
const tripHeaderContainer = document.querySelector('.trip-main');

const filterModel = new FilterModel();
const pointModel = new PointModel(new PointsApiService(API_URL, AUTHORIZATION));
const offerModel = new OfferModel(new OffersApiService(API_URL, AUTHORIZATION));
const destinationModel = new DestinationModel(new DestinationsApiService(API_URL, AUTHORIZATION));

new RoutePresenter(tripHeaderContainer, pointModel, offerModel, destinationModel);

const filterPresenter = new FilterPresenter(
  filterContainer,
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

filterPresenter.init();
mainPresenter.init();

Promise.all([
  pointModel.init(),
  offerModel.init(),
  destinationModel.init()
]).then(() => {
  render(newPointButtonComponent, tripHeaderContainer, RenderPosition.BEFOREEND);
});
