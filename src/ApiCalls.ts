import { AgendaItem } from "./types";

export const getRoomAgenda = async(room_name: string) => {
  // return fetch('https://effectively-server.ew.r.appspot.com/getRoomAgenda', {
  return fetch('http://localhost:8080/getRoomAgenda', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ room_name }),
  }).then(async res => res.json());
};

export const setRoomAgenda = async(
  name: string,
  room_name: string,
  room_duration: number,
  agenda_items: AgendaItem[]
) => {
  // return fetch('https://effectively-server.ew.r.appspot.com/setRoomAgenda', {
  return fetch('http://localhost:8080/setRoomAgenda', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      [room_name]: {
        room_duration,
        agenda_items,
        meeting_started: false,
        meeting_host: name
      }
    }),
  }).then(async res => res.json());
};

export const startMeetingTimer = async(room_name: string) => {
  // return fetch('https://effectively-server.ew.r.appspot.com/startMeetingTimer', {
  return fetch('http://localhost:8080/startMeetingTimer', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ room_name }),
  }).then(async res => res.json());
};