export interface Prayer {
  imsyak: string;
  shubuh: string;
  terbit: string;
  dhuha: string;
  dzuhur: string;
  ashr: string;
  magrib: string;
  isya: string;
}

export interface PrayerResponse extends Prayer {
  tanggal?: string;
}

export interface Event {
  seatalk_challenge: string;
  employee_code: string;
  message: {
    tag: string;
    text: { content: string };
  };
  group: any;
  inviter: any;
  message_id: string;
  value: string;
  group_id: string;
  remover: any;
}
