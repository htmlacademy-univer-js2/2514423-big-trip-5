import { render } from './framework/render.js';
import Sort from './view/sort-view.js';
import EmptyList from './view/empty-list-view';
import Filter from './view/filters-view.js';
import MainPresenter from './presenter/list-presenter.js';
import PointModel from './model/point-model.js';
import OfferModel from './model/offer-model.js';
import DestinationModel from './model/destination-model.js';
import { generateFilters } from './mock/filter.js';


const siteHeaderFiltersElement = document.querySelector('.trip-controls__filters');
const siteBodySortElement = document.querySelector('.trip-events');
const filter = generateFilters(new PointModel().points);
render(new Filter(filter), siteHeaderFiltersElement);
if(filter[0].count === 0){
  render(new EmptyList(),siteBodySortElement);
} else{
  render(new Sort(),siteBodySortElement);
  const mainPresenter = new MainPresenter(siteBodySortElement,
    new PointModel(),new OfferModel(), new DestinationModel());
  mainPresenter.init();
}
