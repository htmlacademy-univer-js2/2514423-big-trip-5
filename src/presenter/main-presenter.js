// main-presenter.js

import { render } from '../render';
import CreateForm from '../view/create-form-view';
import EditForm from '../view/edit-form-view';
import PointView from '../view/point-view';
import PointsList from '../view/point-list-view.js';

export default class Presenter {
  createFormViewComponent = new CreateForm();
  editFormViewComponent = new EditForm();
  pointsListViewComponent = new PointsList();

  constructor({ container, model }) {
    this.container = container;
    this.model = model;
  }

  init() {
    // Рендерим список точек
    render(this.pointsListViewComponent, this.container);

    // Получаем данные из модели
    const points = this.model.getPoints(); // Массив точек

    // Рендерим каждую точку маршрута
    points.forEach((point) => {
      // Находим пункт назначения для текущей точки
      const destination = this.model.getDestinationById(point.destination);

      // Находим дополнительные опции для текущей точки
      const pointOffers = point.offers.map((offerId) =>
        this.model.getOfferById(point.type, offerId)
      );

      // Создаём и рендерим компонент точки маршрута
      const pointView = new PointView(point, destination, pointOffers);
      render(pointView, this.pointsListViewComponent.getElement());
    });

    // Рендерим формы редактирования и создания
    render(this.editFormViewComponent, this.pointsListViewComponent.getElement());
    render(this.createFormViewComponent, this.pointsListViewComponent.getElement());
  }
}
