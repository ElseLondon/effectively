import React, { ChangeEvent, FormEvent } from 'react';
import { useAppState } from '../../../state';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  Avatar,
  Button, 
  Checkbox,
  IconButton,
  FormControl,
  FormControlLabel,
  InputLabel, 
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  makeStyles, 
  MenuItem,
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
    margin: '1.5em 0 3.5em',
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
    bottom: 22
  },
  formControlLabel: {
    margin: '0',
    marginBottom: '1em',
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
  agendaItemList: {
    paddingTop: 0
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
  const [chosenToSetDurationAndAgendaItems, setChosenToSetDurationAndAgendaItems] = React.useState(false); // change name to be more descriptive
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);
  const [duration, setDuration] = React.useState(0)
  const [agendaItems, setAgendaItems] = React.useState(0);
  // 

  const chooseToSetDurationAndAgendaItems = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChosenToSetDurationAndAgendaItems(event.target.checked);
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleRoomNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  };

  const handleDurationChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log('Chosen Duration', event.target.value);
    setDuration(parseInt(event.target.value));
  };

  const handleAgendaItemChange = () => {
    console.log('AgendaItems:', agendaItems + 1);
    setAgendaItems(agendaItems+1);
  };

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
            control={<Checkbox checked={chosenToSetDurationAndAgendaItems} onChange={chooseToSetDurationAndAgendaItems} name="checkedA" />}
            label="Set Duration"
            labelPlacement="start"
          />

          {chosenToSetDurationAndAgendaItems ? (
            <FormControl variant="outlined" className={classes.formControl}>
              <TextField
                value={duration}
                onChange={handleDurationChange}
                select
                label="Duration"
              >
                <MenuItem value={15}>15</MenuItem>
                <MenuItem value={30}>30</MenuItem>
                <MenuItem value={45}>45</MenuItem>
                <MenuItem value={60}>60</MenuItem>
              </TextField>
            </FormControl>
          ) : null}
        </div>

        {chosenToSetDurationAndAgendaItems ? (
          <div>
            <div className={classes.agendaItemForm}>
              <Typography variant="body1">Press the + Button to Add Agenda Points</Typography>
              <IconButton 
                color="primary"
                aria-label="add agenda item"
                onClick={handleAgendaItemChange}
                className={classes.addAgendaItemButton}
              >
                <AddCircleIcon />
              </IconButton>
            </div>
            <div>
              <List className={classes.agendaItemList} dense={dense}>
                {generate(
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <CreateIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Agenda Item"
                      secondary={secondary ? 'Secondary text' : null}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="delete" onClick={() => { console.log('remove agenda item'); }}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>,
                )}
              </List>
            </div>
          </div>
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
