import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import EndCallButton from '../Buttons/EndCallButton/EndCallButton';
import { isMobile } from '../../utils';
import Menu from './Menu/Menu';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { Typography, Grid, Hidden } from '@material-ui/core';
import ToggleAudioButton from '../Buttons/ToggleAudioButton/ToggleAudioButton';
import ToggleChatButton from '../Buttons/ToggleChatButton/ToggleChatButton';
import ToggleVideoButton from '../Buttons/ToggleVideoButton/ToggleVideoButton';
import ToggleScreenShareButton from '../Buttons/ToogleScreenShareButton/ToggleScreenShareButton';
import { RoomAgenda } from '../../state';
import { startMeetingTimer } from '../../ApiCalls';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.background.default,
      bottom: 0,
      left: 0,
      right: 0,
      height: `${theme.footerHeight}px`,
      position: 'fixed',
      display: 'flex',
      padding: '0 1.43em',
      zIndex: 10,
      [theme.breakpoints.down('sm')]: {
        height: `${theme.mobileFooterHeight}px`,
        padding: 0,
      },
    },
    screenShareBanner: {
      position: 'fixed',
      zIndex: 8,
      bottom: `${theme.footerHeight}px`,
      left: 0,
      right: 0,
      height: '104px',
      background: 'rgba(0, 0, 0, 0.5)',
      '& h6': {
        color: 'white',
      },
      '& button': {
        background: 'white',
        color: theme.brand,
        border: `2px solid ${theme.brand}`,
        margin: '0 2em',
        '&:hover': {
          color: '#600101',
          border: `2px solid #600101`,
          background: '#FFE9E7',
        },
      },
    },
    hideMobile: {
      display: 'initial',
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    startMeetingButton: {
      marginRight: '15px'
    }
  })
);

interface MenuBarProps {
  roomAgendaInAppState: RoomAgenda;
  meetingStarted: boolean;
}

export default function MenuBar({ roomAgendaInAppState, meetingStarted }: MenuBarProps) {
  const classes = useStyles();
  const { room, isSharingScreen, toggleScreenShare } = useVideoContext();
  const roomState = useRoomState();
  const isReconnecting = roomState === 'reconnecting';

  const { room_duration: duration, meeting_host: roomHost } = roomAgendaInAppState[room!.name]
  const amIHost = roomHost === room!.localParticipant.identity;

  const hoursMinSecs = { hours:0, minutes: duration, seconds: 0 };
  const { hours = 0, minutes = 0, seconds = 60 } = hoursMinSecs;
  const [[hrs, mins, secs], setTime] = useState([hours, minutes, seconds]);

  const tick = () => {
    if (!meetingStarted) return;

    if (hrs === 0 && mins === 0 && secs === 0) {
      return;
    } else if (mins === 0 && secs === 0) {
      setTime([hrs - 1, 59, 59]);
    } else if (secs === 0) {
      setTime([hrs, mins - 1, 59]);
    } else {
      setTime([hrs, mins, secs - 1]);
    }
  };

  useEffect(() => {
    const timerId = setInterval(() => tick(), 1000);
    return () => clearInterval(timerId);
  });

  const formatTimeRemaining = (h: number, m: number, s: number) => {
    return ` | 
      ${h.toString().padStart(2, '0')}:
      ${m.toString().padStart(2, '0')}:
      ${s.toString().padStart(2, '0')}`
  };

  const startMeeting = async () => await startMeetingTimer(room!.name);

  const meetingParticipantStatus = (meetingStarted: boolean) => {
    return (
      meetingStarted ?
      null :
      <p className={classes.startMeetingButton}>Waiting for {roomHost} to start meeting...</p>
    );
  };

  return (
    <>
      {isSharingScreen && (
        <Grid container justifyContent="center" alignItems="center" className={classes.screenShareBanner}>
          <Typography variant="h6">You are sharing your screen</Typography>
          <Button onClick={() => toggleScreenShare()}>Stop Sharing</Button>
        </Grid>
      )}
      <footer className={classes.container}>
        <Grid container justifyContent="space-around" alignItems="center">
          <Hidden smDown>
            <Grid style={{ flex: 1 }}>
              <Typography variant="body1">
                {room!.name}{duration && formatTimeRemaining(hrs, mins, secs)}
              </Typography>
            </Grid>
          </Hidden>
          <Grid item>
            <Grid container justifyContent="center">
              <ToggleAudioButton disabled={isReconnecting} />
              <ToggleVideoButton disabled={isReconnecting} />
              {!isSharingScreen && !isMobile && <ToggleScreenShareButton disabled={isReconnecting} />}
              {process.env.REACT_APP_DISABLE_TWILIO_CONVERSATIONS !== 'true' && <ToggleChatButton />}
              <Hidden smDown>
                <Menu />
              </Hidden>
            </Grid>
          </Grid>
          <Hidden smDown>
            <Grid style={{ flex: 1 }}>
              <Grid container justifyContent="flex-end">
                {
                  amIHost ?
                  <Button
                    className={classes.startMeetingButton} 
                    variant="contained" 
                    color="primary"
                    onClick={startMeeting}
                    disabled={meetingStarted}
                  >
                    Start Meeting
                  </Button>
                  : meetingParticipantStatus(meetingStarted)
                }
                <EndCallButton />
              </Grid>
            </Grid>
          </Hidden>
        </Grid>
      </footer>
    </>
  );
}
