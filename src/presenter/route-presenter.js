import { render, RenderPosition, replace } from '../framework/render.js';
import RouteView from '../view/route-view.js';

const generateRouteTitle = (points, destinationsModel) => {
  if (points.length === 0) {
    return '';
  }

  const sortedPoints = points.slice().sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
  const cities = sortedPoints.map((point) => {
    const destination = destinationsModel.getDestinationById(point.destination);
    return destination && destination.name ? destination.name : point.destination;
  });

  return cities.length > 3
    ? `${cities[0]} — … — ${cities[cities.length - 1]}`
    : cities.join(' — ');
};

const formatTripDates = (points) => {
  if (points.length === 0) {
    return '';
  }

  const sortedPoints = points.slice().sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
  const startDate = new Date(sortedPoints[0].dateFrom);
  const endDate = new Date(sortedPoints[sortedPoints.length - 1].dateTo);

  if (
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getFullYear() === endDate.getFullYear()
  ) {
    return `${startDate.getDate()} — ${endDate.getDate()} ${endDate.toLocaleString('en-US', {
      month: 'short',
    })}`;
  }

  const options = { day: 'numeric', month: 'short' };
  return `${startDate.toLocaleDateString('en-US', options)} — ${endDate.toLocaleDateString('en-US', options)}`;
};

const calculateTotalCost = (points, offersModel) =>
  points.reduce((total, point) => {
    const basePrice = Number(point.basePrice);
    const offersTotal = (point.offers || []).reduce((sum, offerId) => {
      const foundOffer = offersModel.getOfferById(point.type, offerId);
      return foundOffer ? sum + Number(foundOffer.price) : sum;
    }, 0);

    return total + basePrice + offersTotal;
  }, 0);

export default class RoutePresenter {
  #container = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  #routeComponent = null;

  constructor(container, pointsModel, offersModel, destinationsModel) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#destinationsModel.addObserver(this.#handleModelEvent);
    this.#offersModel.addObserver(this.#handleModelEvent);

    this.#renderRoute();
  }

  #renderRoute = () => {
    const points = this.#pointsModel.points;
    const routeTitle = generateRouteTitle(points, this.#destinationsModel);
    const tripDates = formatTripDates(points);
    const totalCost = calculateTotalCost(points, this.#offersModel);

    const prevRouteComponent = this.#routeComponent;

    this.#routeComponent = new RouteView({
      routeTitle,
      tripDates,
      totalCost,
    });

    if (prevRouteComponent === null) {
      render(this.#routeComponent, this.#container, RenderPosition.AFTERBEGIN);
    } else {
      replace(this.#routeComponent, prevRouteComponent);
    }
  };

  #handleModelEvent = () => {
    this.#renderRoute();
  };
}
