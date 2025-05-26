import { render, RenderPosition, replace } from '../framework/render.js';
import RouteView from '../view/route-view.js';

const generateRouteTitle = (points, destinationModel) => {
  if (points.length === 0) {
    return '';
  }

  const sortedPoints = points.slice().sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
  const cityNames = sortedPoints.map((point) => {
    const destination = destinationModel.getDestinationById(point.destination);
    return destination && destination.name ? destination.name : point.destination;
  });
  return cityNames.length > 3
    ? `${cityNames[0]} — … — ${cityNames[cityNames.length - 1]}`
    : cityNames.join(' — ');
};

const formatTripDates = (points) => {
  if (points.length === 0) {
    return '';
  }
  const sortedPoints = points.slice().sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
  const lastDate = new Date(sortedPoints[sortedPoints.length - 1].dateTo);
  const firstDate = new Date(sortedPoints[0].dateFrom);

  if (
    firstDate.getMonth() === lastDate.getMonth() &&
    firstDate.getFullYear() === lastDate.getFullYear()
  ) {
    return `${firstDate.getDate()} — ${lastDate.getDate()} ${lastDate.toLocaleString('en-US', {
      month: 'short',
    })}`;
  }

  const options = { day: 'numeric', month: 'short' };
  return `${firstDate.toLocaleDateString('en-US', options)} — ${lastDate.toLocaleDateString('en-US', options)}`;
};

const calculateTotalCost = (points, offerModel) => points.reduce((total, point) => {
  const basePrice = Number(point.basePrice);
  const offersTotal = (point.offers || []).reduce((offerSum, offerId) => {
    const offer = offerModel.getOfferById(point.type, offerId);
    return offer ? offerSum + Number(offer.price) : offerSum;
  }, 0);
  return total + basePrice + offersTotal;
}, 0);

export default class RoutePresenter {
  #routeContainer = null;
  #offerModel = null;
  #destinationModel = null;
  #pointModel = null;
  #routeView = null;

  constructor(container, pointModel, offerModel, destinationModel) {
    this.#routeContainer = container;
    this.#pointModel = pointModel;
    this.#offerModel = offerModel;
    this.#destinationModel = destinationModel;

    this.#pointModel.addObserver(this.handleModelEvent);
    this.#destinationModel.addObserver(this.handleModelEvent);
    this.#offerModel.addObserver(this.handleModelEvent);

    this.renderRoute();
  }

  handleModelEvent = () => {
    this.renderRoute();
  };

  renderRoute = () => {
    const points = this.#pointModel.points;
    const routeTitle = generateRouteTitle(points, this.#destinationModel);
    const tripDates = formatTripDates(points);
    const totalCost = calculateTotalCost(points, this.#offerModel);

    const prevRouteView = this.#routeView;
    this.#routeView = new RouteView({
      routeTitle,
      tripDates,
      totalCost,
    });

    if (prevRouteView === null) {
      render(this.#routeView, this.#routeContainer, RenderPosition.AFTERBEGIN);
    } else {
      replace(this.#routeView, prevRouteView);
    }
  };
}
