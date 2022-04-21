import React, { ChangeEvent, FormEvent } from 'react';
import { useAppState } from '../../../state';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import {
  Button, 
  Checkbox,
  IconButton,
  FormControl,
  FormControlLabel,
  InputLabel, 
  makeStyles, 
  MenuItem,
  Select,
  TextField, 
  Theme, 
  Typography,
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
  durationCheckboxAndSelectContainer: {
    marginBottom: "3em",
    display: 'flex',
    flexDirection: 'row',
  },
  continueButton: {
    position: 'absolute',
    bottom: '1em',
    right: '1em',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  textFieldAndSwitch: {
    display: 'inline-block',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  formControlLabel: {
    margin: '0',
    marginBottom: '1em',
  },
  agendaItemForm: {
    display: 'flex',
    flexDirection: 'row',
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
  const [checked, setChecked] = React.useState(false); // change name to be more descriptive

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => { // change name to be more descriptive
    console.log('Switch Changed', event.target.checked);
    setChecked(event.target.checked);
  };

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

        <div className={classes.durationCheckboxAndSelectContainer}>
          <FormControlLabel
            className={classes.formControlLabel}
            control={<Checkbox checked={checked} onChange={handleChange} name="checkedA" />}
            label="Set Duration"
            labelPlacement="start"
          />

          {checked ? (
            <FormControl className={classes.formControl}>
              <InputLabel shrink htmlFor="input-room-duration">
                Duration
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                // value={age}
                // onChange={handleChange}
              >
                <MenuItem value={15}>15</MenuItem>
                <MenuItem value={30}>30</MenuItem>
                <MenuItem value={45}>45</MenuItem>
                <MenuItem value={60}>60</MenuItem>
              </Select>
            </FormControl>
          ) : null}
        </div>

        {checked ? (
          <div className={classes.agendaItemForm}>
            <Typography variant="body1">Press the +/- Button to Add/Remove Agenda Points</Typography>
            <IconButton 
              color="primary"
              aria-label="add agenda item"
              onClick={() => { console.log('add agenda item'); }}
            >
              <AddCircleIcon />
            </IconButton>
            <IconButton
              color="primary"
              aria-label="remove agenda item"
              onClick={() => { console.log('remove agenda item'); }}
            >
              <RemoveCircleIcon />
            </IconButton>
          </div>
        ) : null}

        {/* AGENDA ITEMS & DURATION */}{/*  */}
        {/* Dynamic List for Agenda Items: description|duration|order */}
        {/* 2 Buttons to Add/Remove Agenda Items to/from List  */}
        

        <Button
          variant="contained"
          type="submit"
          color="primary"
          disabled={!name || !roomName}
          className={classes.continueButton}
        >
          Continue
        </Button>
      </form>
    </>
  );
}
