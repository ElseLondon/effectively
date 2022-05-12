import React, { useEffect } from 'react';
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
    container: {
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
    root: {
      width: '121%',
      height: '18px',
      zIndex: 999
    },
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

  const [timerClock, setTimerClock] = React.useState(300);
  const [progress, setProgress] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  // 
  // //
  // // //
  useEffect(() => {
    console.log('Room.tsx|roomAgendaInAppState[room!.name].room_duration|', roomAgendaInAppState[room!.name].room_duration);
    console.log('Room.tsx|roomAgendaInAppState[room!.name].agenda_items|',  roomAgendaInAppState[room!.name].agenda_items);
  }, []);
  // // //
  // //
  // 

  useEffect(() => {
    const timer = setTimeout(function() {
      const timeElapsed = 300 - timerClock;
      const currentProgress = timeElapsed / 3;

      // console.log('-------------------');
      // console.log("minus: ",       timerClock);
      // console.log('timeElapsed: ', timeElapsed);
      // console.log('currentProgress: ', currentProgress);

      if (timeElapsed === 10) { setOpen(true) };
      if (timeElapsed === 20) { setOpen(true) };
      if (timeElapsed === 30) { setOpen(true) };

      setProgress(currentProgress);
      setTimerClock(timerClock - 1);
    }, 1000)

    return () => clearTimeout(timer);
  }, [timerClock]);

  const handleClose = (_event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <div
      className={clsx(classes.container, {
        [classes.rightDrawerOpen]: isChatWindowOpen || isBackgroundSelectionOpen,
      })}
    >
      {/* Refactor to own TimeBar Component */}
      <div className={classes.root}>
        <LinearProgress variant="determinate" value={progress} color="secondary" className={classes.progressBar} />
      </div>
      {/*  */}

      {/* Refactor to own Component? */}
      <div className={classes.snackbarRoot} >
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="info">
            Please move onto next topic!
          </Alert>
        </Snackbar>
      </div>
      {/*  */}

      <MainParticipant />
      <ParticipantList />
      <ChatWindow />
      <BackgroundSelectionDialog />
    </div>
  );
}
