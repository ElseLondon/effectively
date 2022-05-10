import React, { useState } from 'react';
import { styled, Theme } from '@material-ui/core/styles';

import MenuBar from './components/MenuBar/MenuBar';
import MobileTopMenuBar from './components/MobileTopMenuBar/MobileTopMenuBar';
import PreJoinScreens from './components/PreJoinScreens/PreJoinScreens';
import ReconnectingNotification from './components/ReconnectingNotification/ReconnectingNotification';
import RecordingNotifications from './components/RecordingNotifications/RecordingNotifications';
import Room from './components/Room/Room';
import { AgendaItem } from './components/PreJoinScreens/RoomNameScreen/RoomNameScreen';

import useHeight from './hooks/useHeight/useHeight';
import useRoomState from './hooks/useRoomState/useRoomState';

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

export interface RoomAgenda {
  roomName: string;
  duration: number;
  agendaItems: AgendaItem[];
};

export default function App() {
  const roomState = useRoomState();
  const [roomAgendaInAppState, setRoomAgendaInAppState] = useState<RoomAgenda>({roomName: '', duration: 0, agendaItems: []});

  // Here we would like the height of the main container to be the height of the viewport.
  // On some mobile browsers, 'height: 100vh' sets the height equal to that of the screen,
  // not the viewport. This looks bad when the mobile browsers location bar is open.
  // We will dynamically set the height with 'window.innerHeight', which means that this
  // will look good on mobile browsers even after the location bar opens or closes.
  const height = useHeight();

  // 
  // //
  // // //
  // console.log('App.tsx|roomAgendaInAppState|', roomAgendaInAppState);
  // // //
  // //
  // 

  return (
    <Container style={{ height }}>
      {roomState === 'disconnected' ? (
        <PreJoinScreens setRoomAgendaInAppState={setRoomAgendaInAppState}/>
      ) : (
        <Main>
          <ReconnectingNotification />
          <RecordingNotifications />
          <MobileTopMenuBar />
          <Room    /*roomAgendaInAppState={roomAgendaInAppState}*//>
          <MenuBar /*roomAgendaInAppState={roomAgendaInAppState}*//>
        </Main>
      )}
    </Container>
  );
}
