import MainPresenter from './presenter/list-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';
import PointModel from './model/point-model.js';
import OfferModel from './model/offer-model.js';
import DestinationModel from './model/destination-model.js';
import NewPointView from './view/new-point.js';
import PointsApi from './api/point-api.js';
import OffersApi from './api/offer-api.js';
import DestinationsApi from './api/destination-api.js';
import { render, RenderPosition } from './framework/render.js';

const authorization = 'Basic ssj52f854f3h3v9f';
const endPoint = 'https://24.objects.htmlacademy.pro/big-trip';
const siteHeaderFiltersElement = document.querySelector('.trip-controls__filters');
const siteBodySortElement = document.querySelector('.trip-events');
const siteHeaderElement = document.querySelector('.trip-main');
const filterModel = new FilterModel();
const pointModel = new PointModel(new PointsApi(endPoint, authorization));
const offerModel = new OfferModel(new OffersApi(endPoint, authorization));
const destinationModel = new DestinationModel(new DestinationsApi(endPoint, authorization));
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
  mainPresenter.createNewPoint();
  newPointButtonComponent.element.disabled = true;
}
render(newPointButtonComponent,siteHeaderElement,RenderPosition.BEFOREEND);
filterPresenter.init();
mainPresenter.init();
Promise.all([
  pointModel.init(),
  offerModel.init(),
  destinationModel.init()
]).then(() => {
  render(newPointButtonComponent, siteHeaderElement, RenderPosition.BEFOREEND);
});
