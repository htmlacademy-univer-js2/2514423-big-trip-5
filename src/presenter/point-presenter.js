import { render, replace,remove } from '../framework/render';
import EditFormView from '../view/edit-form.js';
import PointView from '../view/point.js';
import {UserAction, UpdateType} from '../const.js';
import {isDatesEqual} from '../utils/utils.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter{
  #pointsListElement;
  #pointModel;
  #offerModel;
  #destinationModel;
  #pointCardView = null;
  #editpointCardView = null;
  #handlePointChange;
  #handleModeChange;
  #mode = Mode.DEFAULT;

  constructor(pointsListElement,offerModel,destinationModel,handlePointChange,handleModeChange){
    this.#pointsListElement = pointsListElement;
    this.#offerModel = offerModel;
    this.#destinationModel = destinationModel;
    this.#handlePointChange = handlePointChange;
    this.#handleModeChange = handleModeChange;
  }

  init(pointData){
    this.#pointModel = pointData;
    const prevpointCardView = this.#pointCardView;
    const prevEditpointCardView = this.#editpointCardView;

    this.#pointCardView = new PointView(
      this.#pointModel,
      this.#offerModel,
      this.#destinationModel,
      this.#handleEditClick,
      this.#handleFavoriteToggle);

    this.#editpointCardView = new EditFormView(
      this.#pointModel,
      this.#offerModel,
      this.#destinationModel,
      this.#handleFormSubmit,
      this.#handleDeleteClick,
      this.#onEditButtonClick
    );

    if(prevpointCardView === null || prevEditpointCardView === null){
      render(this.#pointCardView,this.#pointsListElement);
      return;
    }

    if(this.#mode === Mode.DEFAULT){
      replace(this.#pointCardView,prevpointCardView);
    }
    if(this.#mode === Mode.EDITING){
      replace(this.#editpointCardView,prevEditpointCardView);
    }
    remove(prevpointCardView);
    remove(prevEditpointCardView);
  }

  destroy() {
    remove(this.#pointCardView);
    remove(this.#editpointCardView);
  }

  resetView(){
    if(this.#mode !== Mode.DEFAULT){
      this.#replaceFormToCard();
    }
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#editpointCardView.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#editpointCardView.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointCardView.shake();
      return;
    }
    const resetFormState = () => {
      if (this.#mode === Mode.EDITING) {
        this.#editpointCardView.updateElement({
          isDisabled: false,
          isSaving: false,
          isDeleting: false,
        });
      }
    };
    this.#editpointCardView.shake(resetFormState);
  }

  #replaceCardToForm(){
    replace(this.#editpointCardView,this.#pointCardView);
    document.addEventListener('keydown', this.#handleEscapeKey);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard(){
    replace(this.#pointCardView,this.#editpointCardView);
    document.removeEventListener('keydown', this.#handleEscapeKey);
    this.#mode = Mode.DEFAULT;
  }

  #handleEscapeKey = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToCard();
    }
  };

  #handleEditClick = ()=> {
    this.#replaceCardToForm();
  };

  #onEditButtonClick = ()=> {
    this.#replaceFormToCard();
  };

  #handleFavoriteToggle = () => {
    this.#handlePointChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      {...this.#pointModel,isFavorite:!this.#pointModel.isFavorite});
  };

  #handleFormSubmit = (evt,editPoint)=> {
    evt.preventDefault();
    const isMinorUpdate = !isDatesEqual(this.#pointModel.dateFrom, editPoint.dateTo);
    this.#handlePointChange(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      editPoint);
    this.#replaceFormToCard();
  };

  #handleDeleteClick = (point) => {
    this.#handlePointChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };
}
