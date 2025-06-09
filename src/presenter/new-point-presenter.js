import { remove, render, RenderPosition } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';
import EditFormView from '../view/edit-form.js';
import { OnEscKeyDown } from '../utils/utils.js';

export default class NewPointFormPresenter {
  #eventsListContainer = null;
  #onDataChangeCallback = null;
  #onFormDestroyCallback = null;

  #editFormComponent = null;

  constructor(eventsListContainer, onDataChangeCallback, onFormDestroyCallback) {
    this.#eventsListContainer = eventsListContainer;
    this.#onDataChangeCallback = onDataChangeCallback;
    this.#onFormDestroyCallback = onFormDestroyCallback;
  }

  init(offersModel, destinationsModel) {
    if (this.#editFormComponent !== null) {
      return;
    }

    const blankPoint = {
      basePrice: 0,
      dateFrom: '',
      dateTo: '',
      destination: '',
      offers: [],
      type: 'flight',
      isFavorite: false,
    };

    this.#editFormComponent = new EditFormView(
      blankPoint,
      offersModel,
      destinationsModel,
      this.#handleFormSubmit,
      this.#handleCancelClick
    );

    render(this.#editFormComponent, this.#eventsListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#handleEscKeyDown);
  }

  destroy() {
    if (this.#editFormComponent === null) {
      return;
    }

    this.#onFormDestroyCallback();

    remove(this.#editFormComponent);
    this.#editFormComponent = null;

    document.removeEventListener('keydown', this.#handleEscKeyDown);
  }

  setSaving() {
    this.#editFormComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#editFormComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editFormComponent.shake(resetFormState);
  }

  #handleFormSubmit = (_, newPointData) => {
    this.#onDataChangeCallback(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      newPointData,
    );
  };

  #handleCancelClick = () => {
    this.destroy();
  };

  #handleEscKeyDown = (evt) => {
    OnEscKeyDown(evt, this.destroy.bind(this));
  };
}
