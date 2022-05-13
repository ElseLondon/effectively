import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core';
import ChatWindow from '../ChatWindow/ChatWindow';
import ParticipantList from '../ParticipantList/ParticipantList';
import MainParticipant from '../MainParticipant/MainParticipant';
import BackgroundSelectionDialog from '../BackgroundSelectionDialog/BackgroundSelectionDialog';
import useChatContext from '../../hooks/useChatContext/useChatContext';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import LinearProgress from '@material-ui/core/LinearProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { RoomAgenda } from '../../state';

const useStyles = makeStyles((theme: Theme) => {
  const totalMobileSidebarHeight = `${theme.sidebarMobileHeight +
    theme.sidebarMobilePadding * 2 +
    theme.participantBorderWidth}px`;
  return {
    mainContainer: {
      height: '98%'
    },
    subContainer: {
      position: 'relative',
      height: '100%',
      display: 'grid',
      gridTemplateColumns: `1fr ${theme.sidebarWidth}px`,
      gridTemplateRows: '100%',
      [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: `100%`,
        gridTemplateRows: `calc(100% - ${totalMobileSidebarHeight}) ${totalMobileSidebarHeight}`,
      },
    },
    rightDrawerOpen: { gridTemplateColumns: `1fr ${theme.sidebarWidth}px ${theme.rightDrawerWidth}px` },
    progressBar: {
      height: '18px'
    },
    snackbarRoot: {
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    }
  };
});

interface RoomProps {
  roomAgendaInAppState: RoomAgenda;
}

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Room({ roomAgendaInAppState }: RoomProps) {
  const classes = useStyles();
  const { isChatWindowOpen } = useChatContext();
  const { room, isBackgroundSelectionOpen } = useVideoContext();

  const durationInSeconds = roomAgendaInAppState[room!.name].room_duration * 60;
  const agendaItems = roomAgendaInAppState[room!.name].agenda_items;

  const [timerClock, setTimerClock] = useState(durationInSeconds);
  const [progress, setProgress] = useState(0);
  const [agendaPointOverallDurations, setAgendaPointOverallDurations] = useState<number[]>([])
  const [currentAgendaPointIndex, setCurrentAgendaPointIndex] = useState<number>(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let overallDuration = 0;

    const agendaTimeline = agendaItems.map((agendaItem) => {
      const duration = agendaItem.duration * 60;
      overallDuration = overallDuration + duration;
      return overallDuration
    });

    setAgendaPointOverallDurations(agendaTimeline);
  }, []);

  useEffect(() => {
    const timer = setTimeout(function() {
      const timeElapsed = durationInSeconds - timerClock;
      const currentProgress = (timeElapsed / durationInSeconds) * 100;
  
      setProgress(currentProgress);
      setTimerClock(timerClock - 1);

      if (agendaPointOverallDurations.indexOf(timeElapsed) !== -1) {
        setOpen(true);
        setCurrentAgendaPointIndex(currentAgendaPointIndex + 1);
      };

    }, 1000)
  
    return () => clearTimeout(timer);
  }, [timerClock]);

  const handleClose = (_event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <div className={classes.mainContainer}>
      {
        durationInSeconds ? 
          <LinearProgress variant="determinate" value={progress} color="secondary" className={classes.progressBar} /> 
          : null
      }
      <div
        className={clsx(classes.subContainer, {
          [classes.rightDrawerOpen]: isChatWindowOpen || isBackgroundSelectionOpen,
        })}
      >  
        {
          durationInSeconds ?
          <div className={classes.snackbarRoot} >
            <Snackbar 
              open={open} 
              autoHideDuration={6000} 
              onClose={handleClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "center"
              }}
            >
              <Alert onClose={handleClose} severity="info">
                Please move onto next topic: {agendaItems[currentAgendaPointIndex].description}.
              </Alert>
            </Snackbar>
          </div>
          : null
        }

        <MainParticipant />
        <ParticipantList />
        <ChatWindow />
        <BackgroundSelectionDialog />
      </div>
    </div>
  );
}
