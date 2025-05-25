import { render, replace,remove } from '../framework/render';
import EditFormView from '../view/edit-form-view';
import PointView from '../view/point-view';
import {UserAction, UpdateType} from '../const.js';
import {isDatesEqual} from '../utils/utls.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter{
  #pointListContainer;
  #pointModel;
  #offerModel;
  #destinationModel;
  #pointComponent = null;
  #editPointComponent = null;
  #onPointChange;
  #onModeChange;
  #mode = Mode.DEFAULT;

  constructor(pointListContainer,offerModel,destinationModel,onPointChange,onModeChange){
    this.#pointListContainer = pointListContainer;
    this.#offerModel = offerModel;
    this.#destinationModel = destinationModel;
    this.#onPointChange = onPointChange;
    this.#onModeChange = onModeChange;
  }

  init(pointData){
    this.#pointModel = pointData;
    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;

    this.#pointComponent = new PointView(
      this.#pointModel,
      this.#offerModel,
      this.#destinationModel,
      this.#onPointButtonClick,
      this.#onFavoriteButtonClick);

    this.#editPointComponent = new EditFormView(
      this.#pointModel,
      this.#offerModel,
      this.#destinationModel,
      this.#onFormSubmit,
      this.#onDeleteClick,
      this.#onEditButtonClick
    );

    if(prevPointComponent === null || prevEditPointComponent === null){
      render(this.#pointComponent,this.#pointListContainer);
      return;
    }

    if(this.#mode === Mode.DEFAULT){
      replace(this.#pointComponent,prevPointComponent);
    }
    if(this.#mode === Mode.EDITING){
      replace(this.#editPointComponent,prevEditPointComponent);
    }
    remove(prevPointComponent);
    remove(prevEditPointComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  }

  resetView(){
    if(this.#mode !== Mode.DEFAULT){
      this.#replaceFormToCard();
    }
  }

  #replaceCardToForm(){
    replace(this.#editPointComponent,this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#onModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard(){
    replace(this.#pointComponent,this.#editPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToCard();
    }
  };

  #onPointButtonClick = ()=> {
    this.#replaceCardToForm();
  };

  #onEditButtonClick = ()=> {
    this.#replaceFormToCard();
  };

  #onFavoriteButtonClick = () => {
    this.#onPointChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      {...this.#pointModel,isFavorite:!this.#pointModel.isFavorite});
  };

  #onFormSubmit = (evt,editPoint)=> {
    evt.preventDefault();
    const isMinorUpdate = !isDatesEqual(this.#pointModel.dateFrom, editPoint.dateTo);
    this.#onPointChange(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      editPoint);
    this.#replaceFormToCard();
  };

  #onDeleteClick = (point) => {
    this.#onPointChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };
}
