import { UpdateType } from '../const.js';
import Observable from '../framework/observable.js';

export default class DestinationsModel extends Observable {
  #destinations = [];
  #destinationsApiService;
  #isLoaded = false;

  constructor(destinationsApiService) {
    super();
    this.#destinationsApiService = destinationsApiService;
  }

  get destinations() {
    return this.#destinations;
  }

  get isLoaded() {
    return this.#isLoaded;
  }

  getDestinationById(id) {
    return this.#destinations.find((destination) => destination.id === id) || {
      name: '',
      description: '',
      pictures: [],
    };
  }

  async init() {
    try {
      this.#destinations = await this.#destinationsApiService.destinations;
    } catch (err) {
      this.#destinations = [];
    }

    this.#isLoaded = true;
    this._notify(UpdateType.INIT);
  }
}
