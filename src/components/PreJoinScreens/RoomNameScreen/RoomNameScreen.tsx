import React, { ChangeEvent, FormEvent } from 'react';
import { useAppState } from '../../../state';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  Button, Checkbox, IconButton, FormControl, FormControlLabel, InputLabel, List, 
  ListItem, ListItemSecondaryAction, makeStyles, MenuItem, Select, TextField, Theme, Typography,
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
  textFieldAndSwitch: {
    display: 'inline-block',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    // bottom: 22
  },
  // 
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  // 
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
  removeAgendaItemButton: {
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

  const [agendaItems, setAgendaItems] = React.useState(0);
  const [chosenToAddDurationAndAgendaItems, setChosenToAddDurationAndAgendaItems] = React.useState(false);

  const chooseToSetDurationAndAgendaItems = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChosenToAddDurationAndAgendaItems(event.target.checked);
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleRoomNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  };

  const handleDurationChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setDuration(event.target.value as number);
  };

  const addAgendaItem = () => setAgendaItems(agendaItems + 1);

  const removeAgendaItem = () => setAgendaItems(agendaItems - 1);

  const generate = (element: React.ReactElement) => {
    const agendaArray = [...Array(agendaItems).keys()];
    
    return agendaArray.map((value) =>
      React.cloneElement(element, {
        key: value,
      }),
    );
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
            control={<Checkbox checked={chosenToAddDurationAndAgendaItems} onChange={chooseToSetDurationAndAgendaItems} name="checkedA" />}
            label="Set Duration?"
            labelPlacement="start"
          />

          {chosenToAddDurationAndAgendaItems ? (
            <div className={classes.durationTextFieldContainer}>
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Age</InputLabel>
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

        {chosenToAddDurationAndAgendaItems ? (
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
              {generate(
                <ListItem>
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
                        // value={roomName}
                        // onChange={handleRoomNameChange}
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
                </ListItem>,
              )}
            </List>
          </>
        ) : null}

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
