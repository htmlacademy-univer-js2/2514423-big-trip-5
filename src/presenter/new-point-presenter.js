import {remove, render, RenderPosition} from '../framework/render.js';
import {nanoid} from 'nanoid';
import {UserAction, UpdateType} from '../const.js';
import EditFormView from '../view/edit-form-view.js';

export default class NewPointPresenter {
  #pointListContainer = null;
  #onDataChange = null;
  #onDestroy = null;

  #pointEditComponent = null;

  constructor(pointListContainer, onDataChange, onDestroy) {
    this.#pointListContainer = pointListContainer;
    this.#onDataChange = onDataChange;
    this.#onDestroy = onDestroy;
  }

  init(offerModel,destinationModel) {
    if (this.#pointEditComponent !== null) {
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

    this.#pointEditComponent = new EditFormView(
      blankPoint,
      offerModel,
      destinationModel,
      this.#onFormSubmit,
      this.#onDeleteClick
    );

    render(this.#pointEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#onDestroy();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #onFormSubmit = (_, point) => {
    this.#onDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {id: nanoid(), ...point},
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
