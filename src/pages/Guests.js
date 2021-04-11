import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import PageTitle from '../components/PageTitle';
import Notifications from '../components/UI/Notifications';

import AddEditGuest from '../components/Guest/AddEditGuest';
import GuestsTable from '../components/Guest/GuestsTable';
import PopUp from '../components/UI/PopUp';
import ConfirmDialog from '../components/UI/ConfirmDialog';
import GuestService from '../services/GuestService';

const useStyles = makeStyles({
  
});

function Guests () {
  const classes = useStyles();
  const [ guests, setGuests ] = useState([]);
  const [ loadingGuests, setLoadingGuests ] = useState(false);
  const [ openPopUp, setOpenPopUp ] = useState(false);
  const [ currentlyEditedGuest, setCurrentlyEditedGuest ] = useState(null);
  const [ deletingGuest, setDeletingGuest ] = useState(false);
  const [ errorsDuringDelete, setErrorsDuringDelete ] = useState([]);
  const [ notify, setNotify ] = useState({
    isOpen: false,
    message: '',
    type: ''
  });
  const [ confirmDialog, setConfirmDialog ] = useState({
    isOpen: false,
    title: '',
    subtitle: ''
  });

  const getGuests = () => {
    setLoadingGuests(true);
    GuestService.getGuests()
      .then(({ data }) => {
        setGuests(data);
      }).finally(() => {
        setLoadingGuests(false);
      });
  };

  const handleDeleteGuest = (guestId) => {
    GuestService.deleteGuest(guestId)
      .then(() => {
        getGuests();
        setConfirmDialog({
          ...confirmDialog,
          isOpen: false
        });
        setNotify({
          isOpen: true,
          type: 'error',
          message: 'Guest Deleted Successfully'
        });
      });
  };

  const handleVipStatusChange = (event, guest) => {
    setLoadingGuests(true);
    guest.isVIP = event.target.checked;
    GuestService.updateGuest(guest._id, guest)
      .then(() => {
        getGuests();
        setNotify({
          isOpen: true,
          type: 'success',
          message: 'Guest Updated Successfully'
        });
      }).finally(() => {
        setLoadingGuests(false);
      });
  };

  useEffect(() => {
    getGuests();
  }, []);

  return (
    <div>
      <PageTitle title="Guests" />

      <PopUp
        openPopUp={openPopUp}
        setOpenPopUp={setOpenPopUp}
        title={currentlyEditedGuest ? 'Edit Guest' : 'Add Guest'}
      >
        <AddEditGuest 
          setOpenPopUp={setOpenPopUp}
          getGuests={getGuests}
          guest={currentlyEditedGuest}
          setNotify={setNotify}
          setCurrentlyEditedGuest={setCurrentlyEditedGuest}
        />
      </PopUp>

      <GuestsTable 
        guests={guests}
        loadingGuests={loadingGuests}
        setOpenPopUp={setOpenPopUp}
        handleVipStatusChange={handleVipStatusChange}
        setCurrentlyEditedGuest={setCurrentlyEditedGuest}
        setConfirmDialog={setConfirmDialog}
        handleDeleteGuest={handleDeleteGuest}
      />

      <Notifications
        notify={notify}
        setNotify={setNotify}
      ></Notifications>

      <ConfirmDialog 
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
        errorsDuringDelete={errorsDuringDelete}
        setErrorsDuringDelete={setErrorsDuringDelete}
        performingConfirmAction={deletingGuest}
      />
    </div>
  )
}

export default Guests;
