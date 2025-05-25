import {remove, render, RenderPosition} from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';
import EditFormView from '../view/edit-form.js';

export default class NewPointPresenter {
  #pointsListElement = null;
  #handleDataChange = null;
  #handleDestroy = null;

  #editPointView = null;

  constructor(pointsListElement, handleDataChange, handleDestroy) {
    this.#pointsListElement = pointsListElement;
    this.#handleDataChange = handleDataChange;
    this.#handleDestroy = handleDestroy;
  }

  init(offerModel,destinationModel) {
    if (this.#editPointView !== null) {
      return;
    }
    const blankPoint = {
      basePrice: 0,
      dateFrom: new Date().toISOString(),
      dateTo: new Date().toISOString(),
      destination: 1,
      offers: [],
      type: 'flight',
      isFavorite: false
    };

    this.#editPointView = new EditFormView(
      blankPoint,
      offerModel,
      destinationModel,
      this.#onFormSubmit,
      this.#onDeleteClick
    );

    render(this.#editPointView, this.#pointsListElement, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#editPointView === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#editPointView);
    this.#editPointView = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#editPointView.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#editPointView.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editPointView.shake(resetFormState);
  }

  #onFormSubmit = (_, point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
    this.destroy();
  };

  #onDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
