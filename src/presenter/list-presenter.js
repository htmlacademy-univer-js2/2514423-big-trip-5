import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import PointPresenter from './point-presenter';
import { updateItem } from '../utils/common';

export default class MainPresenter{
  #pointModel;
  #offerModel;
  #destinationModel;
  #container;
  #listPoints = [];
  #pointsPresenters = new Map();

  constructor(container, pointModel,offerModel,destinationModel){
    const tripEventsList = document.createElement('ul');
    tripEventsList.className = 'trip-events__list';
    container.appendChild(tripEventsList);
    this.#container = tripEventsList;
    this.#pointModel = pointModel;
    this.#offerModel = offerModel;
    this.#destinationModel = destinationModel;
  }

  init(){
    this.#listPoints = [...this.#pointModel.points];
    for(let i = 0; i < this.pointModel.points.length; i++){
      this.#renderPoint(this.pointModel.points[i]);
    }
    flatpickr('#event-start-time-1', {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
    });

    flatpickr('#event-end-time-1', {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
    });

  }

  #renderPoint(pointData){
    const pointPresenter = new PointPresenter(this.container,this.offerModel,
      this.destinationModel,this.#handlePointChange,this.#onModeChange);
    pointPresenter.init(pointData);
    this.#pointsPresenters.set(pointData.id,pointPresenter);
  }

  #clearPointsPresenters(){
    this.#pointsPresenters.forEach((pointPresenter)=>pointPresenter.destroy());
    this.#pointsPresenters.clear();
  }

  #handlePointChange = (updatePoint) => {
    this.#listPoints = updateItem(this.#listPoints, updatePoint);
    this.#pointsPresenters.get(updatePoint.id).init(updatePoint);
  };

  #onModeChange = () =>{
    this.#pointsPresenters.forEach((pointPresenter)=>pointPresenter.resetView());
  };

  get pointModel(){
    return this.#pointModel;
  }

  get offerModel(){
    return this.#offerModel;
  }

  get destinationModel(){
    return this.#destinationModel;
  }

  get container(){
    return this.#container;
  }
}
