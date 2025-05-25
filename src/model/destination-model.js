import { UpdateType } from '../const';
import Observable from '../framework/observable';

export default class DestinationModel extends Observable {
  #destinationList = [];
  #destinationsApi;
  #loaded = false;

  constructor(destinationsApi) {
    super();
    this.#destinationsApi = destinationsApi;
  }

  async init() {
    try {
      this.#destinationList = await this.#destinationsApi.destinationList;
    } catch (err) {
      this.#destinationList = [];
    }
    this.#loaded = true;
    this._notify(UpdateType.INIT);
  }

  get destinationList() {
    return this.#destinationList;
  }

  get loaded() {
    return this.#loaded;
  }

  getDestinationById(destinationId) {
    return this.#destinationList.find((item) => item.destinationId === destinationId) || { name: '', description: '', pictures: [] };
  }
}
