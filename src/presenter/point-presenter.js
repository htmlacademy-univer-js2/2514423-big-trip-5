import { render, replace, remove } from '../framework/render';
import EditFormView from '../view/edit-form';
import PointView from '../view/point';
import { UserAction, UpdateType } from '../const.js';
import { isDatesEqual, OnEscKeyDown } from '../utils/utils.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #eventsListContainer;
  #pointData;
  #offersModel;
  #destinationsModel;

  #pointComponent = null;
  #editFormComponent = null;

  #onDataChangeCallback;
  #onModeChangeCallback;
  #mode = Mode.DEFAULT;

  constructor(eventsListContainer, offersModel, destinationsModel, onDataChangeCallback, onModeChangeCallback) {
    this.#eventsListContainer = eventsListContainer;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#onDataChangeCallback = onDataChangeCallback;
    this.#onModeChangeCallback = onModeChangeCallback;
  }

  init(pointData) {
    this.#pointData = pointData;

    const prevPointComponent = this.#pointComponent;
    const prevEditFormComponent = this.#editFormComponent;

    this.#pointComponent = new PointView(
      this.#pointData,
      this.#offersModel,
      this.#destinationsModel,
      this.#handleEditClick,
      this.#handleFavoriteClick
    );

    this.#editFormComponent = new EditFormView(
      this.#pointData,
      this.#offersModel,
      this.#destinationsModel,
      this.#handleFormSubmit,
      this.#handleDeleteClick,
      this.#handleFormCloseClick
    );

    if (prevPointComponent === null || prevEditFormComponent === null) {
      render(this.#pointComponent, this.#eventsListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    } else if (this.#mode === Mode.EDITING) {
      replace(this.#editFormComponent, prevEditFormComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevEditFormComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editFormComponent);
  }

  resetViewToDefault() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToCard();
    }
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#editFormComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#editFormComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }

    const resetFormState = () => {
      if (this.#mode === Mode.EDITING) {
        this.#editFormComponent.updateElement({
          isDisabled: false,
          isSaving: false,
          isDeleting: false,
        });
      }
    };

    this.#editFormComponent.shake(resetFormState);
  }

  #replaceCardToForm() {
    replace(this.#editFormComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#handleEscKeyDown);
    this.#onModeChangeCallback();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    this.#editFormComponent.resetToInitialState();
    replace(this.#pointComponent, this.#editFormComponent);
    document.removeEventListener('keydown', this.#handleEscKeyDown);
    this.#mode = Mode.DEFAULT;
  }

  #handleEscKeyDown = (evt) => {
    OnEscKeyDown(evt, this.#replaceFormToCard.bind(this));
  };

  #handleEditClick = () => {
    this.#replaceCardToForm();
  };

  #handleFormCloseClick = () => {
    this.#replaceFormToCard();
  };

  #handleFavoriteClick = () => {
    this.#onDataChangeCallback(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      { ...this.#pointData, isFavorite: !this.#pointData.isFavorite }
    );
  };

  #handleFormSubmit = (evt, updatedPointData) => {
    evt.preventDefault();

    const isMinorUpdate = !isDatesEqual(this.#pointData.dateFrom, updatedPointData.dateTo);

    this.#onDataChangeCallback(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      updatedPointData
    );

    this.#replaceFormToCard();
  };

  #handleDeleteClick = (pointData) => {
    this.#onDataChangeCallback(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      pointData
    );
  };
}
