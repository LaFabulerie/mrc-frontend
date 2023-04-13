export type Area = {
  id: number;
  name: string;
}

export type Room = {
  id: number;
  name: string;
  description: string;
  slug: string;
  image: string;
  items: Item[];
}

export type Item = {
  id: number;
  name: string;
  description: string;
  slug: string;
  image: string;
  room: Room;
}

export type DigitalUse = {
  id: number;
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
  title: string;
  description: string;
  slug: string;
  url: string;
  area: Area;
};
