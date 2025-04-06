import { render, replace } from '../framework/render.js';
import EditForm from '../view/edit-form-view';
import flatpickr from 'flatpickr';
import PointView from '../view/point-view';
import 'flatpickr/dist/flatpickr.min.css';
import {isEscapeKey} from '../utils/utils.js';

export default class Presenter{
  #pointModel;
  #offerModel;
  #destinationModel;
  #container;

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
    for(let i = 0; i < this.pointModel.getPoints().length; i++){
      this.#renderPoint(this.pointModel.getPoints()[i]);

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
    const escKeyDownHandler = (evt) => {
      if (isEscapeKey(evt)) {
        evt.preventDefault();
        replaceEditToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const onPointButtonClick = ()=> {
      replacePointToEdit();
      document.addEventListener('keydown', escKeyDownHandler);
    };

    const onEditButtonClick = ()=> {
      replaceEditToPoint();
      document.removeEventListener('keydown', escKeyDownHandler);
    };

    const onFormSubmit = (evt)=> {
      evt.preventDefault();
      replaceEditToPoint();
      document.removeEventListener('keydown', escKeyDownHandler);
    };

    const point = new PointView(pointData,this.offerModel,this.destinationModel,onPointButtonClick);
    const editPoint = new EditForm(pointData,this.offerModel,this.destinationModel,
      onFormSubmit,onEditButtonClick);

    function replacePointToEdit(){
      replace(editPoint,point);
    }

    function replaceEditToPoint(){
      replace(point,editPoint);
    }

    render(point,this.#container);
  }

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
