import { render } from './render.js';
import Sort from '../src/view/sort-view.js';
import Filters from '../src/view/filters-view.js';
import Presenter from './presenter/main-presenter.js';
import TripInfo from './view/trip-info-view.js';
import PointModel from './model/model.js';

const filtersContainer = document.body.querySelector('.trip-controls__filters');
const eventsContainer = document.body.querySelector('.trip-events');
const tripMainContainer = document.body.querySelector('.trip-main');

render(new TripInfo(), tripMainContainer, 'afterbegin');
render(new Filters(), filtersContainer);
render(new Sort(), eventsContainer);

const model = new PointModel();
const presenter = new Presenter({ container: eventsContainer, model });

presenter.init();
