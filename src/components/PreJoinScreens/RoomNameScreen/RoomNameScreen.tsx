import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useAppState } from '../../../state';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  Button, Checkbox, IconButton, FormControl, FormControlLabel, InputLabel, List, ListItem, 
  ListItemSecondaryAction, makeStyles, MenuItem, Select, TextField, Theme, Typography,
} from '@material-ui/core';


const useStyles = makeStyles((theme: Theme) => ({
  gutterBottom: {
    marginBottom: '1em',
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '1.5em 0 3.5em',
    '& div:not(:last-child)': {
      marginRight: '1em',
    },
    [theme.breakpoints.down('sm')]: {
      margin: '1.5em 0 2em',
    },
  },
  agendaItemInputContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '1.5em 0 0em', // can we somehow copy above styling and just add for this field
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
  durationTextFieldContainer: {
    width: '50%'
  },
  durationCheckboxAndSelectContainer: {
    marginBottom: "3em",
    display: 'flex'
  },
  continueButton: {
    position: 'absolute',
    bottom: '1em',
    right: '1em',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  }, 
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  formControlLabel: {
    margin: '0',
    marginTop: '1em',
  },
  agendaItemForm: {
    display: 'flex',
    flexDirection: 'row',
  },
  addAgendaItemButton: {
    bottom: 12
  },
  agendaItemDeleteIcon: {
    marginTop: 40
  },
}));

interface RoomNameScreenProps {
  name: string;
  roomName: string;
  duration: number;
  setName: (name: string) => void;
  setRoomName: (roomName: string) => void;
  setDuration: (duration: number) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function RoomNameScreen({ name, roomName, duration, setName, setRoomName, setDuration, handleSubmit }: RoomNameScreenProps) {
  const classes = useStyles();
  const { user } = useAppState();

  // in general might be worth lifting state to PreJoinScreens
  const [durationCheckboxChecked, setDurationCheckboxChecked] = useState(false);
  const [agendaItems, setAgendaItems] = useState(0);
  const [descriptions, setDescriptions] = useState([]);

  const hasUsername = !window.location.search.includes('customIdentity=true') && user?.displayName;

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleRoomNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  };

  const chooseToSetDurationAndAgendaItems = (event: ChangeEvent<HTMLInputElement>) => {
    setDurationCheckboxChecked(event.target.checked);
  };

  const handleDurationChange = (event: ChangeEvent<{ value: unknown }>) => {
    setDuration(event.target.value as number);
  };

  const addAgendaItem = () => {
    const incrementedAgendaItems = agendaItems + 1;
    // should add an empty string to the agenda descriptions array
    // convert agenda items to array with that number of empty string entries
    
    // We have to do checks and see if the array is empty or 
    // has item descriptions first
    // const res = [...Array(incrementedAgendaItems)].map((_, i) => {
    //   return '';
    // });

    // console.log('incrementedAgendaItems', incrementedAgendaItems);
    // console.log('res', res);
    setAgendaItems(incrementedAgendaItems);
  };

  const removeAgendaItem = () => {
    const reducedAgendaItems = agendaItems - 1;
    // should remove an empty string to the agenda descriptions array
    setAgendaItems(reducedAgendaItems);
  };

  const handleAgendaItemDescriptionChange = (agendaItemIndex: number) => (event: ChangeEvent<HTMLInputElement>) => {
    console.log('handleAgendaItemDescriptionChange |agendaItemIndex|', agendaItemIndex);
    console.log('handleAgendaItemDescriptionChange |event.target.value|', event.target.value);
    // 
    // 1. Create copy of existing descriptions array
    // 2. Take the index
    // 3. Insert new string value into correct Index of descriptions 
    // 
  };

  const disableContinue = () => {
    const checkboxCheckedAndDurationSelected = durationCheckboxChecked && (duration > 0)
    // Add checks for All Present Agenda Item Fields // 
    // - basically descriptions cannot be array of empty strings //
    return !name || !roomName || !checkboxCheckedAndDurationSelected
  }

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
            control={<Checkbox checked={durationCheckboxChecked} onChange={chooseToSetDurationAndAgendaItems} name="checkedA" />}
            label="Set Duration?"
            labelPlacement="start"
          />

          {durationCheckboxChecked ? (
            <div className={classes.durationTextFieldContainer}>
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Duration</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={duration}
                  onChange={handleDurationChange}
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={15}>15</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={30}>30</MenuItem>
                </Select>
              </FormControl>
            </div>
          ) : null}
        </div>

        {durationCheckboxChecked && (duration > 0) ? (
          <>
            <div className={classes.agendaItemForm}>
              <Typography variant="body1">Press the + Button to Add Agenda Points</Typography>
              <IconButton 
                color="secondary"
                aria-label="add agenda item"
                onClick={addAgendaItem}
                className={classes.addAgendaItemButton}
              >
                <AddCircleIcon />
              </IconButton>
            </div>

            <List>
              {[...Array(agendaItems).keys()].map((agendaItemNumber) => {
                return (
                  <ListItem key={agendaItemNumber}>
                  <div className={classes.agendaItemInputContainer}>
                    <div className={classes.textFieldContainer}>
                      <InputLabel shrink htmlFor="input-room-name">
                        Description
                      </InputLabel>
                      <TextField
                        autoCapitalize="false"
                        id="input-agenda-item-description"
                        variant="outlined"
                        fullWidth
                        size="small"
                        // value={roomName} value={descriptions[agendaItemKey]}
                        onChange={handleAgendaItemDescriptionChange(agendaItemNumber)}
                      />
                    </div>

                    <div className={classes.textFieldContainer}>
                      <InputLabel shrink htmlFor="input-room-name">
                        Duration
                      </InputLabel>
                      <TextField
                        autoCapitalize="false"
                        id="input-agenda-item-duration"
                        variant="outlined"
                        fullWidth
                        size="small"
                        // value={roomName}
                        // onChange={handleRoomNameChange}
                      />
                    </div>
                  </div>

                  <ListItemSecondaryAction>
                    <IconButton className={classes.agendaItemDeleteIcon} edge="end" aria-label="delete" onClick={removeAgendaItem}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                );
              })}
            </List>
          </>
        ) : null}

        <Button
          variant="contained"
          type="submit"
          color="primary"
          disabled={disableContinue()}
          className={classes.continueButton}
        >
          Continue
        </Button>
      </form>
    </>
  );
}
