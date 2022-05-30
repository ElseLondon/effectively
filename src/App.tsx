import React, { useState, useEffect } from 'react';
import { styled, Theme } from '@material-ui/core/styles';

import MenuBar from './components/MenuBar/MenuBar';
import MobileTopMenuBar from './components/MobileTopMenuBar/MobileTopMenuBar';
import PreJoinScreens from './components/PreJoinScreens/PreJoinScreens';
import ReconnectingNotification from './components/ReconnectingNotification/ReconnectingNotification';
import RecordingNotifications from './components/RecordingNotifications/RecordingNotifications';
import Room from './components/Room/Room';
import { RoomAgenda } from './state';

import useHeight from './hooks/useHeight/useHeight';
import useRoomState from './hooks/useRoomState/useRoomState';
import useVideoContext from './hooks/useVideoContext/useVideoContext';
import { getRoomAgenda } from './ApiCalls';


const Container = styled('div')({
  display: 'grid',
  gridTemplateRows: '1fr auto',
});

const Main = styled('main')(({ theme }: { theme: Theme }) => ({
  overflow: 'hidden',
  paddingBottom: `${theme.footerHeight}px`, // Leave some space for the footer
  background: 'black',
  [theme.breakpoints.down('sm')]: {
    paddingBottom: `${theme.mobileFooterHeight + theme.mobileTopBarHeight}px`, // Leave some space for the mobile header and footer
  },
}));

export default function App() {
  const { room } = useVideoContext();
  const roomState = useRoomState();
  const [meetingStarted, setMeetingStarted] = useState<boolean>(false);
  const [roomAgendaInAppState, setRoomAgendaInAppState] = useState<RoomAgenda>({
    'default': {
      room_duration: 0,
      agenda_items: [],
      meeting_started: false,
      meeting_host: '',
    }});

  useEffect(() => {
    const interval = setInterval(async () => {
      const roomName = Object.keys(roomAgendaInAppState)[0] || "default";
      const roomAgendas = await getRoomAgenda(roomName);
      const currentAgenda = roomAgendas[roomName];

      if (currentAgenda) {
        const meetingStarted = currentAgenda["meeting_started"];
        if (meetingStarted) setMeetingStarted(true);
      }
      
    }, 1000);
    return () => clearInterval(interval);
  }, [room, roomAgendaInAppState]);

  // Here we would like the height of the main container to be the height of the viewport.
  // On some mobile browsers, 'height: 100vh' sets the height equal to that of the screen,
  // not the viewport. This looks bad when the mobile browsers location bar is open.
  // We will dynamically set the height with 'window.innerHeight', which means that this
  // will look good on mobile browsers even after the location bar opens or closes.
  const height = useHeight();

  return (
    <Container style={{ height }}>
      {roomState === 'disconnected' ? (
        <PreJoinScreens setRoomAgendaInAppState={setRoomAgendaInAppState}/>
      ) : (
        <Main>
          <ReconnectingNotification />
          <RecordingNotifications />
          <MobileTopMenuBar />
          <Room
            roomAgendaInAppState={roomAgendaInAppState}
            meetingStarted={meetingStarted}
          />
          <MenuBar 
            roomAgendaInAppState={roomAgendaInAppState} 
            meetingStarted={meetingStarted}
          />
        </Main>
      )}
    </Container>
  );
}
