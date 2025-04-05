import { render } from '../render';
import CreateForm from '../view/create-form-view';
import EditForm from '../view/edit-form-view';
import PointView from '../view/point-view';
import PointsList from '../view/point-list-view.js';

export default class Presenter {
  createFormViewComponent = new CreateForm();
  editFormViewComponent = new EditForm();
  pointsListViewComponent = new PointsList();

  constructor({container}) {
    this.container = container;
  }

  init(){
    render(this.pointsListViewComponent, this.container);
    render(this.editFormViewComponent, this.pointsListViewComponent.getElement());
    render(this.createFormViewComponent, this.pointsListViewComponent.getElement());
    for(let i = 0; i < 3; i++){
      render(new PointView(), this.pointsListViewComponent.getElement());
    }
  }
}
