import {getRandomArrayElement} from '../utils/utils.js';
const mockPoints = [
  {
    'id': '18354941-b6e7-4b3a-8018-f37535953ee2',
    'base_price': 7535,
    'date_from': '2025-02-10T01:54:14.857Z',
    'date_to': '2025-02-10T18:13:14.857Z',
    'destination': '9a6007b0-5264-4c36-8a88-6922b41eec3c',
    'is_favorite': false,
    'offers': [],
    'type': 'drive'
  },

  {
    'id': 'e5bf700e-da71-400c-bab7-19bd7732fe63',
    'base_price': 1367,
    'date_from': '2025-02-11T18:18:14.857Z',
    'date_to': '2025-02-13T03:59:14.857Z',
    'destination': '9a6007b0-5264-4c36-8a88-6922b41eec3c',
    'is_favorite': false,
    'offers': [],
    'type': 'check-in'
  },
  {
    'id': '51a1c11a-aa54-4ad2-ab18-4f64a3c752ae',
    'base_price': 7549,
    'date_from': '2025-02-13T18:58:14.857Z',
    'date_to': '2025-02-14T22:39:14.857Z',
    'destination': '4120ceda-ff48-4cb8-8a1f-eca7d5d76409',
    'is_favorite': true,
    'offers': [
      '9792b095-9ba3-49dd-aa89-294fa766a8b5',
      'e4e4d5ec-a2d4-49d0-91ba-c69051434409',
      '2c412c01-0236-4b5a-bc47-ed451484691a'
    ],
    'type': 'train'
  },
  {
    'id': 'bc7fc77d-1e0b-477f-a26f-100fa46108da',
    'base_price': 836,
    'date_from': '2025-02-16T17:14:14.857Z',
    'date_to': '2025-02-17T12:48:14.857Z',
    'destination': '14f0beed-df7b-4df0-a646-6dad26c4ca56',
    'is_favorite': false,
    'offers': [
      '64c7e8f6-4a63-4aa0-b57f-997c5cf3a92c',
      '51a9d6a6-2c45-49f5-a7ff-ae56a91183f2',
      '42dbb7a5-bb63-4429-90c4-51f9c8e18dea',
      'ae9cdb8e-23b9-4efe-a6fc-d17688097dcb'
    ],
    'type': 'taxi'
  },
  {
    'id': '45b35c5d-8edc-4baa-b082-abc048f594a5',
    'base_price': 2062,
    'date_from': '2025-02-19T11:32:14.857Z',
    'date_to': '2025-02-19T19:11:14.857Z',
    'destination': '94fc72b2-5614-4b1d-b3be-6ac331e66bf5',
    'is_favorite': true,
    'offers': [],
    'type': 'bus'
  },
  {
    'id': '392c4f7a-ceda-4306-8171-7e7c7f01ee9a',
    'base_price': 5346,
    'date_from': '2025-02-21T12:42:14.857Z',
    'date_to': '2025-02-22T02:09:14.857Z',
    'destination': 'acc9c42e-e6b0-43b7-afc3-daf2a00f81ab',
    'is_favorite': false,
    'offers': [
      '1a047ae5-3cd2-49cf-b097-5515a51922a8',
      '19e4d1e9-c6e0-4a3c-934f-f037c64cfb77'
    ],
    'type': 'bus'
  },
  {
    'id': '8ae0820b-a843-41ca-b856-df9dfe8d56fe',
    'base_price': 6809,
    'date_from': '2025-02-22T11:06:14.857Z',
    'date_to': '2025-02-23T04:29:14.857Z',
    'destination': '656b79bb-6ed3-4fe8-a192-1f443e54db05',
    'is_favorite': true,
    'offers': [],
    'type': 'restaurant'
  },
  {
    'id': 'cca2abdb-3b4b-4b44-bd61-77b61d73c265',
    'base_price': 4414,
    'date_from': '2025-02-24T12:19:14.857Z',
    'date_to': '2025-02-25T23:24:14.857Z',
    'destination': 'acc9c42e-e6b0-43b7-afc3-daf2a00f81ab',
    'is_favorite': true,
    'offers': [
      '52863e5d-fd8b-4c8b-8e30-cc928591575c'
    ],
    'type': 'check-in'
  },
  {
    'id': '3ba485b5-0202-4c6e-bca0-81239b97ce8a',
    'base_price': 3945,
    'date_from': '2025-02-27T17:36:14.857Z',
    'date_to': '2025-03-01T03:31:14.857Z',
    'destination': '668323ce-bf78-4087-a47c-ba2653618630',
    'is_favorite': true,
    'offers': [
      'e4e4d5ec-a2d4-49d0-91ba-c69051434409',
      '2c412c01-0236-4b5a-bc47-ed451484691a'
    ],
    'type': 'train'
  },
  {
    'id': '5e4fca0c-d8d5-454f-95a1-e8c34f09a90e',
    'base_price': 8407,
    'date_from': '2025-03-02T04:45:14.857Z',
    'date_to': '2025-03-04T01:19:14.857Z',
    'destination': '656b79bb-6ed3-4fe8-a192-1f443e54db05',
    'is_favorite': true,
    'offers': [
      '520bc29f-33ae-4967-be90-66d3e2814780',
      '9cb90f34-6d85-4b6b-9bfd-2e6c7b49edcc',
      '544d05b7-4ea4-433d-b762-ad36526a2441',
      '632fb37e-8f25-4366-9e47-6ad37f427eac',
      'c6ae1f94-8ca3-48ed-80e9-8ffd9980fa3a'
    ],
    'type': 'ship'
  },
];

const getRandomPoint = () => getRandomArrayElement(mockPoints);

export {getRandomPoint, mockPoints};
