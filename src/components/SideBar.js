import React, { useState, useContext } from 'react';
import {useObserver} from 'mobx-react';

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import PeopleIcon from '@material-ui/icons/People';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import DateFnsUtils from "@date-io/date-fns";

import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import { Input, Button, ListItemText, ListItemIcon } from '@material-ui/core';
import {StoreContext} from '../store';
import DeleteDialog from './DeleteDialog';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
}));

export default function SideBar() {
  const store = useContext(StoreContext)
  const classes = useStyles();
  const [buttonState, setbuttonState] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [comments, setComments] = useState("")
  const [address, setAddress]  =  useState("");
  const [location, setLocation] = useState(
    {
      lat: null,
      lng: null,
      address: null
    }
  );
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  
  const handleDateChange = date => {
    setSelectedDate(date);
  };
  
  const handleClickOpen = () => {
    setOpenDeleteDialog(true);
  };
  const handleClose = (isOk) => {
    setOpenDeleteDialog(false);
    if (isOk){
      store.delCases()
    }
  };

  const handleSelect = async (value) => {
    const results  = await geocodeByAddress(value);
    const latlng = await getLatLng(results[0]);
    setAddress(value);
    
    latlng['address'] = address;
    setLocation(latlng);
    setbuttonState(true)
    console.log('Success', location);

  };

  const onSubmit = (e) => {
    e.preventDefault();
    const newCase = {
      caseId: store.cases.length + 1,
      date: selectedDate,
      location: {
        lat:location.lat,
        lng:location.lng,
        address: location.address
      },
      comments: comments
    };
    console.log(newCase);
    store.addCase(newCase);
    resetForm();
  };

  const resetForm = () => {
    setAddress("");
    setLocation(null);
    setbuttonState(false)
  }

  return useObserver(() =>(
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            COVID-19 Confirmed Cases Map
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.toolbar} />
        <form onSubmit={onSubmit}>
          <div>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDateTimePicker
                  disableToolbar
                  variant="inline"
                  format="dd/mm/yyyy HH:mm"
                  margin="normal"
                  id="date-picker-inline"
                  label="Date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
          </div>

          <div className="">
              <Input name="comments" onChange={e => setComments(e.target.value)} placeholder="comments"/>
          </div>
        <div className="">
        <PlacesAutocomplete
          value={address}
          onChange={setAddress}
          onSelect={handleSelect}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <Input
                {...getInputProps({
                  placeholder: 'Type address',
                  className : 'location-search-input',
                })}
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map(suggestion => {
                  const className = suggestion.active
                    ? 'suggestion-item-active'
                    : 'suggestion-item';
                  // inline style for demonstration purpose
                  const style = suggestion.active
                    ? { backgroundColor: 'blue', cursor: 'pointer' }
                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style,
                      })}
                    >
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
        </PlacesAutocomplete>
        </div>
        <div>
          <Button type="submit" disabled={!buttonState} >Add Case</Button>
        </div>
        </form>

        <Divider/>
        <List>
            <ListItem key="total_cases">
              <ListItemIcon><PeopleIcon/></ListItemIcon>
              <ListItemText primary={`Total Cases : ${ store.cases.length }`} />
            </ListItem>
        </List>
        <Divider/>
        <List>
          <ListItem button key="clear_all" onClick={handleClickOpen}>
              <ListItemIcon><DeleteForeverIcon/></ListItemIcon>
              <ListItemText primary="Clear All" />
          </ListItem>
          <DeleteDialog open={openDeleteDialog} onClose={handleClose}/>
        </List>
      </Drawer>
    </div>
  ));
}
