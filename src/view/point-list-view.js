import AbstractView from '../framework/view/abstract-view.js';

function createPointTemplate() {
  return `
        <ul class="trip-events__list"></ul>`;
}

export default class PointsList extends AbstractView{
  constructor(){
    super();
  }

  get template(){
    return createPointTemplate();
  }
}
