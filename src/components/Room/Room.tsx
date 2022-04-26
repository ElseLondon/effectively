import React from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core';
import ChatWindow from '../ChatWindow/ChatWindow';
import ParticipantList from '../ParticipantList/ParticipantList';
import MainParticipant from '../MainParticipant/MainParticipant';
import BackgroundSelectionDialog from '../BackgroundSelectionDialog/BackgroundSelectionDialog';
import useChatContext from '../../hooks/useChatContext/useChatContext';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import LinearProgress from '@material-ui/core/LinearProgress';

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
      zIndex: 999
    },
  };
});

export default function Room() {
  const classes = useStyles();
  const { isChatWindowOpen } = useChatContext();
  const { room, isBackgroundSelectionOpen } = useVideoContext();

  const [data, setData] = React.useState({});
  const [timerClock, setTimerClock] = React.useState(300);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    fetch('/fetchMeetingAgendaDetails', {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    }).then(res => res.json())
      .then((res) => {
        console.log('our room data', res[room!.name]);
        const meetingRoomDetails = res[room!.name];
        setData(meetingRoomDetails);
      });
  }, []);

  // React.useEffect(() => {
  //   const timer = setInterval(() => {
  //     setProgress((oldProgress) => {
  //       if (oldProgress === 100) {
  //         return 0;
  //       }
  //       const diff = 1 * 10;
  //       return Math.min(oldProgress + diff, 100);
  //     });
  //   }, 500);

  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);

  // const MIN = 0   // MIN = Minimum expected value
  // const MAX = 300 // MAX = Maximium expected value
  // // Function to normalise the values (MIN / MAX could be integrated)
  // const normalise = (value: number) => (value - MIN) * 100 / (MAX - MIN);

  React.useEffect(() => {
    const timer = setTimeout(function() {
      const timeElapsed = 300 - timerClock;
      const currentProgress = timeElapsed / 3;
      console.log('-------------------');
      console.log("minus: ",       timerClock);
      console.log('timeElapsed: ', timeElapsed);
      console.log('currentProgress: ', currentProgress);
      setProgress(currentProgress);
      setTimerClock(timerClock - 1);
    }, 1000)

    return () => { // this should work flawlessly besides some milliseconds lost here and there 
       clearTimeout(timer)
    }
   }, [timerClock]);

  return (
    <div
      className={clsx(classes.container, {
        [classes.rightDrawerOpen]: isChatWindowOpen || isBackgroundSelectionOpen,
      })}
    >
      <div className={classes.root}>
        <LinearProgress variant="determinate" value={progress} color="secondary" />
      </div>
      <MainParticipant />
      <ParticipantList />
      <ChatWindow />
      <BackgroundSelectionDialog />
    </div>
  );
}
