import React, { useState, useContext, useRef } from 'react';
import GoogleMapReact from 'google-map-react';
import { StoreContext } from '../store';
import { useObserver } from 'mobx-react';
import { Paper, makeStyles, Popper } from '@material-ui/core';
import { distanceToMouse, apiIsLoaded, getMapBounds } from './tools';
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
      width: theme.spacing(16),
      height: theme.spacing(16),
    },
  },
}));

const InfoWindow = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Popper id={props.data.caseId} open={props.show} anchorEl={props.anchorEl}>
        <div className={classes.paper}>
          <Paper elevation={3}>
              <h3>Case Id:{props.data.caseId}</h3>
              <h6>Comments: {props.data.comments}</h6>
              <h6>Address: {props.data.location.address}</h6>
              <h6>Infected on: {props.data.date.toString()}</h6>
          </Paper>
        </div>
    </Popper>
    </div>
  )
};

const Marker = props => {
  const [showMarkerInfo, setShowMarkerInfo] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const onClick = (event) => {
    event.preventDefault();
    setShowMarkerInfo(!showMarkerInfo);
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  return ( 
    <div className="markerContainer">   
        <InfoWindow show={showMarkerInfo}  data={props.data} anchorEl={anchorEl}/>
        <div>
          <button className="marker" onClick={onClick}>
            <img src="./coronavirus.png" alt="patient"/>
          </button>
        </div>
      </div>
  )
};

const CovidMap = () => {

  const zoom = 10;
  const mapRef = useRef();
  const store = useContext(StoreContext)
  
  const fitBounds = () =>{
    let bounds = getMapBounds(store.cases);
    mapRef.current.fitBounds(bounds);
  };

  return useObserver(() =>(  
      <div className="map">
        <GoogleMapReact 
        bootstrapURLKeys={{key: process.env.REACT_APP_GOOGLE_KEY}}
        defaultCenter={{lat:32.0668267 , lng:34.76303}}
        defaultZoom={zoom}
        distanceToMouse={distanceToMouse}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps}) => {
          mapRef.current = map;
          apiIsLoaded(map, maps, store.cases);
        }}
        >
          
        {
          store.cases.map((patient, index) => {
            console.log(patient);
            let lng = patient.location.lng;
            let lat = patient.location.lat;
            if (index === store.cases.length - 1){
              console.log("LastItem");
              if (mapRef.current){
                fitBounds();
              }
            }
            return (
              <Marker key={patient.caseId} lng={lng} lat={lat}
              data={patient} className="markerContainer"/>
            )
          })
          
        }
        </GoogleMapReact>
        
      </div>
    )
  )
}
export default CovidMap;
