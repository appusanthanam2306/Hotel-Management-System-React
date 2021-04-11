import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import PageTitle from '../../components/PageTitle';
import Notifications from '../../components/UI/Notifications';

import AddEditAmenity from '../../components/Amenity/AddEditAmenity';
import AmenitiesTable from '../../components/Amenity/AmenitiesTable';
import PopUp from '../../components/UI/PopUp';
import ConfirmDialog from '../../components/UI/ConfirmDialog';
import AmenityService from '../../services/AmenityService';

const useStyles = makeStyles({
  
});


function Amenities ({getDashboardMetrics}) {
  const classes = useStyles();
  const [ amenities, setAmenities ] = useState([]);
  const [ loadingAmenities, setLoadingAmenities ] = useState(false);
  const [ openPopUp, setOpenPopUp ] = useState(false);
  const [ currentlyEditedAmenity, setCurrentlyEditedAmenity ] = useState(null);
  const [ deletingAmenity, setDeletingAmenity ] = useState(false);
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

  const getAmenities = () => {
    setLoadingAmenities(true);
    AmenityService.getAmenities()
      .then(({ data }) => {
        setAmenities(data);
      }).finally(() => {
        setLoadingAmenities(false);
      });
  };

  const handleDeleteAmenity = (amenityId) => {
    setDeletingAmenity(true);
    AmenityService.deleteAmenity(amenityId)
      .then(() => {
        getAmenities();
        getDashboardMetrics();
        setConfirmDialog({
          ...confirmDialog,
          isOpen: false
        });
        setNotify({
          isOpen: true,
          type: 'error',
          message: 'Amenity Deleted Successfully'
        });
      }).catch((err) => {
        constructErrorData(err);
      }).finally(() => {
        setDeletingAmenity(false);
      });
  };

  function constructErrorData (error) {
    if (error.response.data.errors) {
      let errors = [
        {
          ...error.response.data.errors.title
        }
      ]
      setErrorsDuringDelete(errors);
    }
  }

  const handleAmenityStatusChange = (event, amenity) => {
    setLoadingAmenities(true);
    amenity.isActive = event.target.checked;
    AmenityService.updateAmenity(amenity._id, amenity)
      .then(() => {
        getAmenities();
        getDashboardMetrics();
        setNotify({
          isOpen: true,
          type: 'success',
          message: 'Amenity Updated Successfully'
        });
      }).finally(() => {
        setLoadingAmenities(false);
      });
  };

  useEffect(() => {
    getAmenities();
  }, []);

  return (
    <div>
      <PageTitle title="Amenities" />

      <PopUp
        openPopUp={openPopUp}
        setOpenPopUp={setOpenPopUp}
        title={currentlyEditedAmenity ? 'Edit Amenity' : 'Add Amenity'}
      >
        <AddEditAmenity 
          setOpenPopUp={setOpenPopUp}
          getAmenities={getAmenities}
          amenity={currentlyEditedAmenity}
          setNotify={setNotify}
          setCurrentlyEditedAmenity={setCurrentlyEditedAmenity}
          getDashboardMetrics={getDashboardMetrics}
        />
      </PopUp>

      <AmenitiesTable 
        amenities={amenities}
        loadingAmenities={loadingAmenities}
        setOpenPopUp={setOpenPopUp}
        handleAmenityStatusChange={handleAmenityStatusChange}
        setCurrentlyEditedAmenity={setCurrentlyEditedAmenity}
        setConfirmDialog={setConfirmDialog}
        handleDeleteAmenity={handleDeleteAmenity}
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
        performingConfirmAction={deletingAmenity}
      />
    </div>
  )
}

export default Amenities;