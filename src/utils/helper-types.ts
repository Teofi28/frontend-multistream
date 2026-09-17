export type Url = {
  id: string;
  url: string;
  roomId: number;
  roomName: string;
};

export type Room = {
  id: number;
  name: string;
  active: boolean;
};