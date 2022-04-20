import React, { ChangeEvent, FormEvent } from 'react';
import { useAppState } from '../../../state';
import {
  Box, 
  Button, 
  FormControl,
  Grid, 
  InputLabel, 
  makeStyles, 
  MenuItem,
  Select,
  Switch,
  TextField, 
  Theme, 
  Typography
} from '@material-ui/core';


const useStyles = makeStyles((theme: Theme) => ({
  gutterBottom: {
    marginBottom: '1em',
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '1.5em 0 2.5em',
    '& div:not(:last-child)': {
      marginRight: '1em',
    },
    [theme.breakpoints.down('sm')]: {
      margin: '1.5em 0 2em',
    },
  },
  textFieldContainer: {
    width: '100%',
  },
  continueButton: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  textFieldAndSwitch: {
    display: 'inline-block',
  }
}));

interface RoomNameScreenProps {
  name: string;
  roomName: string;
  setName: (name: string) => void;
  setRoomName: (roomName: string) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function RoomNameScreen({ name, roomName, setName, setRoomName, handleSubmit }: RoomNameScreenProps) {
  const classes = useStyles();
  const { user } = useAppState();
  // 
  const [checked, setChecked] = React.useState(false); // change name to be more descriptive: setDurationAndAgenda

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => { // change name to be more descriptive: handleSettingDurationAndAgenda
    console.log('Switch Changed', event.target.checked);
    setChecked(event.target.checked);
  };
  // 

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleRoomNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  };

  const hasUsername = !window.location.search.includes('customIdentity=true') && user?.displayName;

  return (
    <>
      <Typography variant="h5" className={classes.gutterBottom}>
        Join a Room
      </Typography>
      <Typography variant="body1">
        {hasUsername
          ? "Enter the name of a room you'd like to join."
          : "Enter your name and the name of a room you'd like to join"}
      </Typography>
      <form onSubmit={handleSubmit}>
        <div className={classes.inputContainer}>
          {!hasUsername && (
            <div className={classes.textFieldContainer}>
              <InputLabel shrink htmlFor="input-user-name">
                Your Name
              </InputLabel>
              <TextField
                id="input-user-name"
                variant="outlined"
                fullWidth
                size="small"
                value={name}
                onChange={handleNameChange}
              />
            </div>
          )}
          <div className={classes.textFieldContainer}>
            <InputLabel shrink htmlFor="input-room-name">
              Room Name
            </InputLabel>
            <TextField
              autoCapitalize="false"
              id="input-room-name"
              variant="outlined"
              fullWidth
              size="small"
              value={roomName}
              onChange={handleRoomNameChange}
            />
          </div>
        </div>

        {/*  */}{/*  */}
        {/* REDO THE FOLLOWING WITH ATTENTION TO V4 DOCUMENTATION! */}
        <div>
          <Typography className={classes.textFieldAndSwitch} variant="body1">Set Meeting Duration & Agenda?</Typography>
          <Switch checked={checked} onChange={handleChange} />
        </div>

        {checked ? (
          <Box sx={{ width: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Duration</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Duration"
                // value={age}
                // onChange={handleChange}
              >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Box>
        ) : null}

        {/* Input Label and Text Field for Room Duration */}
        {/* Dynamic List for Agenda Items: description|duration|order */}
        {/* 2 Buttons to Add/Remove Agenda Items to/from List  */}
        {/*  */}{/*  */}

        <Grid container justifyContent="flex-end">
          <Button
            variant="contained"
            type="submit"
            color="primary"
            disabled={!name || !roomName}
            className={classes.continueButton}
          >
            Continue
          </Button>
        </Grid>
      </form>
    </>
  );
}
