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
import { AgendaItem } from '../RoomNameScreen/RoomNameScreen';
import { RoomAgenda } from '../../../App';

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

const setRoomAgenda = async(
  room_name: string,
  room_duration: number,
  agenda_items: AgendaItem[]
) => {
  return fetch('https://effectively-server.ew.r.appspot.com/setRoomAgenda', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      [room_name]: {
        room_duration,
        agenda_items
      }
    }),
  }).then(async res => res.json());
};

const getRoomAgenda = async(room_name: string) => {
  return fetch('https://effectively-server.ew.r.appspot.com/getRoomAgenda', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ room_name }),
  }).then(async res => res.json());
};

export default function DeviceSelectionScreen({ 
  name,
  roomName,
  duration,
  durationCheckboxChecked,
  agendaItems,
  setStep,
  // setRoomAgendaInAppState
}: DeviceSelectionScreenProps) {

  const classes = useStyles();
  const { getToken, /* setRoomAgenda, getRoomAgenda, */ isFetching } = useAppState();
  const { connect: chatConnect } = useChatContext();
  const { connect: videoConnect, isAcquiringLocalTracks, isConnecting } = useVideoContext();
  const disableButtons = isFetching || isAcquiringLocalTracks || isConnecting;

  const handleJoin = async () => {
    const saveMeetingAgenda = durationCheckboxChecked && duration > 0;
    let allRoomAgendas;

    if (saveMeetingAgenda) {
      allRoomAgendas = await setRoomAgenda(roomName, duration, agendaItems);
    } else {
      allRoomAgendas = await getRoomAgenda(roomName);
    };

    // leave this logging in for debugging // // // // 
    console.log('allRoomAgendas', allRoomAgendas);  // 
    // // // // // // // // // // // // // // // // // 


    // setRoomAgendaInAppState({
    //   roomName,
    //   duration: allRoomAgendas[roomName].room_duration,
    //   agendaItems: allRoomAgendas[roomName].agenda_items
    // });

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
