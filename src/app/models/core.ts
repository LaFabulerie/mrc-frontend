export type Area = {
  id: number;
  name: string;
}

export type Room = {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  image: string;
  items: Item[];
  mainColor: string;
  video: string;
  position: number;
}

export type Item = {
  id: number;
  uuid: string;
  name: string;
  description: string;
  slug: string;
  image: string;
  room: Room;
  uses: DigitalUse[];
  lightCtrl: number;
  lightPin: string;
}

export type DigitalUse = {
  id: number;
  uuid: string;
  title: string;
  description: string;
  slug: string;
  tags: string[];
  items: Item[];
  services: DigitalService[];
  itemIds: number[];
};

export type DigitalService = {
  id: number;
  uuid: string;
  title: string;
  description: string;
  slug: string;
  url: string;
  area: Area
};
