import React, { ChangeEvent, FormEvent } from 'react';
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
    margin: '1.5em 0 0em',
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

export interface AgendaItem {
  description: string;
  duration: number;
}

interface RoomNameScreenProps {
  name: string;
  roomName: string;
  duration: number;
  durationCheckboxChecked: boolean | undefined;
  agendaItems: AgendaItem[];
  setName: (name: string) => void;
  setRoomName: (roomName: string) => void;
  setDuration: (duration: number) => void;
  setDurationCheckboxChecked: (checked: boolean | undefined) => void;
  setAgendaItems: (agendaItems: AgendaItem[]) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}



export default function RoomNameScreen({ 
  name, 
  roomName, 
  duration, 
  durationCheckboxChecked, 
  agendaItems, 
  setName,
  setRoomName, 
  setDuration, 
  setDurationCheckboxChecked, 
  setAgendaItems, 
  handleSubmit
}: RoomNameScreenProps) {
  const classes = useStyles();

  const { user } = useAppState();
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
    const incrementedDescriptions = [...agendaItems];
    incrementedDescriptions.push({ description : '', duration: 0 });
    setAgendaItems(incrementedDescriptions);
  };

  const removeAgendaItem = () => {
    const decrementedDescriptions = [...agendaItems];
    decrementedDescriptions.pop();
    setAgendaItems(decrementedDescriptions);
  };

  const handleAgendaItemDescriptionChange = (agendaItemIndex: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const agendaItemsWithUpdatedDescription = [...agendaItems];
    agendaItemsWithUpdatedDescription[agendaItemIndex].description = event.target.value;
    setAgendaItems(agendaItemsWithUpdatedDescription);
    console.log('!*!', agendaItemsWithUpdatedDescription); //
  };

  const handleAgendaItemDurationChange = (agendaItemIndex: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const agendaItemsWithUpdatedDuration = [...agendaItems];
    agendaItemsWithUpdatedDuration[agendaItemIndex].duration = parseInt(event.target.value);
    setAgendaItems(agendaItemsWithUpdatedDuration);
    console.log('!*!', agendaItemsWithUpdatedDuration); //
  }


  const disableContinue = () => {
    const checkboxCheckedAndDurationSelected = durationCheckboxChecked && (duration > 0);
    // //
    //~Add Checks for All Present Agenda Item Fields~// 
    // 
    // const allAgendaItemDescriptionsComplete;           // agenda item descriptions entered
    // const allAgendaItemDurationsComplete;              // agenda item durations entered
    // const allAgendaItemDurationsEqualOverallDuration;  // agenda item durations come to same amount as overall duration
    // //
    return !name || !roomName || !checkboxCheckedAndDurationSelected;
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
              {[...Array(agendaItems.length).keys()].map((agendaItemKey) => {
                return (
                  <ListItem key={agendaItemKey}>
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
                        value={agendaItems[agendaItemKey].description}
                        onChange={handleAgendaItemDescriptionChange(agendaItemKey)}
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
                        type="number"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        value={agendaItems[agendaItemKey].duration}
                        onChange={handleAgendaItemDurationChange(agendaItemKey)}
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
