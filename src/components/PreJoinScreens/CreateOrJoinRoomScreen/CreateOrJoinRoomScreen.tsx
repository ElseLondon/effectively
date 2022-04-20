import React, { ChangeEvent, FormEvent } from 'react';
import { Typography, makeStyles, TextField, Grid, Button, InputLabel, Theme, Switch, FormControlLabel } from '@material-ui/core';
import { useAppState } from '../../../state';

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
  continueButton: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
}));

interface CreateOrJoinRoomScreenProps {
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function CreateOrJoinRoomScreen({ handleSubmit }: CreateOrJoinRoomScreenProps) {
  const classes = useStyles();

  const [checked, setChecked] = React.useState(true);

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <>
      <Typography variant="h5" className={classes.gutterBottom}>
        Create or Join a Room
      </Typography>

      <form onSubmit={handleSubmit}>
        <div className={classes.inputContainer}>

          {/*  */}
          <FormControlLabel control={<Switch checked={checked} onChange={handleSwitchChange} />} label={ checked ? 'Create' : 'Join' } />

          {checked ? <div>
            <TextField
              label="Size"
              id="outlined-size-small"
              defaultValue="Small"
              size="small"
            />
          </div> : null}
          {/*  */}
          
        </div>
        <Grid container justifyContent="flex-end">
          <Button
            variant="contained"
            type="submit"
            color="primary"
            className={classes.continueButton}
          >
            Continue
          </Button>
        </Grid>
      </form>
    </>
  );
}
