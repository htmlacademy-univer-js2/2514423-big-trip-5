import { render } from './framework/render.js';
import Sort from '../src/view/sort-view.js';
import Filters from '../src/view/filters-view.js';
import Presenter from './presenter/main-presenter.js';
import PointModel from './model/point-model.js';
import OfferModel from './model/offer-model.js';
import DestinationModel from './model/destination-model.js';
import EmptyList from './view/empty-list-view';
import { generateFilters } from './mock/filter.js';

const siteHeaderFiltersElement = document.querySelector('.trip-controls__filters');
const siteBodySortElement = document.querySelector('.trip-events');
const filter = generateFilters(new PointModel().points);

render(new Filters(filter), siteHeaderFiltersElement);
if(filter[0].count === 0){
  render(new EmptyList(),siteBodySortElement);
} else{
  render(new Sort(),siteBodySortElement);
  const mainPresenter = new Presenter(siteBodySortElement,
    new PointModel(),new OfferModel(), new DestinationModel());
  mainPresenter.init();
}
