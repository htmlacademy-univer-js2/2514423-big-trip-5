import { mockDestinations } from '../mock/destination';

export default class DestinationModel {
  #destinationList = mockDestinations;

  get destinations() {
    return this.#destinationList;
  }

  getDestinationById(destinationId) {
    return this.#destinationList.find((item) => item.id === destinationId) || { name: '', description: '', pictures: [] };
  }
}
