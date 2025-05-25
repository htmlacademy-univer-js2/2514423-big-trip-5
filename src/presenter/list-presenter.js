import { render, replace,remove } from '../framework/render';
import EditFormView from '../view/edit-form-view';
import PointView from '../view/point-view';

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
  #handlePointChange;
  #handleModeChange;
  #mode = Mode.DEFAULT;

  constructor(pointListContainer,offerModel,destinationModel,handlePointChange,handleModeChange){
    this.#pointListContainer = pointListContainer;
    this.#offerModel = offerModel;
    this.#destinationModel = destinationModel;
    this.#handlePointChange = handlePointChange;
    this.#handleModeChange = handleModeChange;
  }

  init(pointData){
    this.#pointModel = pointData;
    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;

    this.#pointComponent = new PointView(this.#pointModel,this.#offerModel,this.#destinationModel,
      this.#onPointButtonClick,this.#handlePointChange);
    this.#editPointComponent = new EditFormView(this.#pointModel,this.#offerModel,this.#destinationModel,
      this.#onFormSubmit,this.#onEditButtonClick);

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
    this.#handleModeChange();
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

  #onFormSubmit = (evt,editPoint)=> {
    evt.preventDefault();
    this.#handlePointChange(editPoint);
    this.#replaceFormToCard();
  };
}
