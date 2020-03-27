import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';




const DeleteDialog = (props) => {

    return (
    <Dialog
        open={props.open}
        onClose={props.onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete all saved Cases?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
           This action will delete all the data permanently.
           Do you wish to procees?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.onClose(false)} color="primary">
            No
          </Button>
          <Button onClick={() => props.onClose(true)} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
}
 
export default DeleteDialog;