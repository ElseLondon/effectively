import React from 'react';
import { makeStyles, Typography, Grid, Button, Theme, Hidden } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import LocalVideoPreview from './LocalVideoPreview/LocalVideoPreview';
import SettingsMenu from './SettingsMenu/SettingsMenu';
import { Steps } from '../PreJoinScreens';
import ToggleAudioButton from '../../Buttons/ToggleAudioButton/ToggleAudioButton';
import ToggleVideoButton from '../../Buttons/ToggleVideoButton/ToggleVideoButton';
import { useAppState } from '../../../state';
import useChatContext from '../../../hooks/useChatContext/useChatContext';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { AgendaItem } from '../../../types';
import { RoomAgenda } from '../../../state';
import { getRoomAgenda, setRoomAgenda } from '../../../ApiCalls';

const useStyles = makeStyles((theme: Theme) => ({
  gutterBottom: {
    marginBottom: '1em',
  },
  marginTop: {
    marginTop: '1em',
  },
  deviceButton: {
    width: '100%',
    border: '2px solid #aaa',
    margin: '1em 0',
  },
  localPreviewContainer: {
    paddingRight: '2em',
    [theme.breakpoints.down('sm')]: {
      padding: '0 2.5em',
    },
  },
  joinButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column-reverse',
      width: '100%',
      '& button': {
        margin: '0.5em 0',
      },
    },
  },
  mobileButtonBar: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'space-between',
      margin: '1.5em 0 1em',
    },
  },
  mobileButton: {
    padding: '0.8em 0',
    margin: 0,
  },
}));

interface DeviceSelectionScreenProps {
  name: string;
  roomName: string;
  duration: number;
  durationCheckboxChecked: boolean | undefined;
  agendaItems: AgendaItem[];
  setStep: (step: Steps) => void;
  setRoomAgendaInAppState: (roomAgenda: RoomAgenda) => void;
}

export default function DeviceSelectionScreen({ 
  name,
  roomName,
  duration,
  durationCheckboxChecked,
  agendaItems,
  setStep,
  setRoomAgendaInAppState
}: DeviceSelectionScreenProps) {

  const classes = useStyles();
  const { getToken, isFetching } = useAppState();
  const { connect: chatConnect } = useChatContext();
  const { connect: videoConnect, isAcquiringLocalTracks, isConnecting } = useVideoContext();
  const disableButtons = isFetching || isAcquiringLocalTracks || isConnecting;

  const handleJoin = async () => {
    const saveMeetingAgenda = durationCheckboxChecked && duration > 0;
    let allRoomAgendas;

    if (saveMeetingAgenda) {
      allRoomAgendas = await setRoomAgenda(name, roomName, duration, agendaItems);
      setRoomAgendaInAppState({
        [roomName]: {
          room_duration: allRoomAgendas[roomName].room_duration,
          agenda_items: allRoomAgendas[roomName].agenda_items,
          meeting_started: false,
          meeting_host: name,
        }
      });

    } else {
      allRoomAgendas = await getRoomAgenda(roomName);
      setRoomAgendaInAppState({ 
        [roomName]: { 
          room_duration: allRoomAgendas[roomName] ? allRoomAgendas[roomName].room_duration : 0,
          agenda_items: allRoomAgendas[roomName] ? allRoomAgendas[roomName].agenda_items : [],
          meeting_host: allRoomAgendas[roomName] ? allRoomAgendas[roomName].meeting_host : "",
          meeting_started: false,
        }
      });

    };

    getToken(
      name,
      roomName,
    ).then(({ token }) => {
      videoConnect(token);
      process.env.REACT_APP_DISABLE_TWILIO_CONVERSATIONS !== 'true' && chatConnect(token);
    });
  };

  if (isFetching || isConnecting) {
    return (
      <Grid container justifyContent="center" alignItems="center" direction="column" style={{ height: '100%' }}>
        <div>
          <CircularProgress variant="indeterminate" />
        </div>
        <div>
          <Typography variant="body2" style={{ fontWeight: 'bold', fontSize: '16px' }}>
            Joining Meeting
          </Typography>
        </div>
      </Grid>
    );
  }

  return (
    <>
      <Typography variant="h5" className={classes.gutterBottom}>
        Join {roomName}
      </Typography>

      <Grid container justifyContent="center">
        <Grid item md={7} sm={12} xs={12}>
          <div className={classes.localPreviewContainer}>
            <LocalVideoPreview identity={name} />
          </div>
          <div className={classes.mobileButtonBar}>
            <Hidden mdUp>
              <ToggleAudioButton className={classes.mobileButton} disabled={disableButtons} />
              <ToggleVideoButton className={classes.mobileButton} disabled={disableButtons} />
            </Hidden>
            <SettingsMenu mobileButtonClass={classes.mobileButton} />
          </div>
        </Grid>
        <Grid item md={5} sm={12} xs={12}>
          <Grid container direction="column" justifyContent="space-between" style={{ height: '100%' }}>
            <div>
              <Hidden smDown>
                <ToggleAudioButton className={classes.deviceButton} disabled={disableButtons} />
                <ToggleVideoButton className={classes.deviceButton} disabled={disableButtons} />
              </Hidden>
            </div>
            <div className={classes.joinButtons}>
              <Button variant="outlined" color="primary" onClick={() => setStep(Steps.roomNameStep)}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                data-cy-join-now
                onClick={handleJoin}
                disabled={disableButtons}
              >
                Join Now
              </Button>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
