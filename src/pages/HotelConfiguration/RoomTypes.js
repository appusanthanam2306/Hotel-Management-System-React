import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import PageTitle from '../../components/PageTitle';
import Notifications from '../../components/UI/Notifications';

import AddEditRoomType from '../../components/RoomType/AddEditRoomType';
import RoomTypesTable from '../../components/RoomType/RoomTypesTable';
import PopUp from '../../components/UI/PopUp';
import RoomTypeService from '../../services/RoomTypeService';
import ConfirmDialog from '../../components/UI/ConfirmDialog';

const useStyles = makeStyles({

});

function RoomTypes ({ getDashboardMetrics }) {
  const classes = useStyles();
  const [ roomTypes, setRoomTypes ] = useState([]);
  const [ loadingRoomTypes, setLoadingRoomTypes ] = useState(false);
  const [ openPopUp, setOpenPopUp ] = useState(false);
  const [ currentlyEditedRoomType, setCurrentlyEditedRoomType ] = useState(null);
  const [ deletingRoomType, setDeletingRoomType ] = useState(false);
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

  const getRoomTypes = () => {
    setLoadingRoomTypes(true);
    RoomTypeService.getRoomTypes()
      .then(({ data }) => {
        setRoomTypes(data);
      }).finally(() => {
        setLoadingRoomTypes(false);
      });
  };

  const handleDeleteRoomType = (roomTypeId) => {
    setDeletingRoomType(true);
    RoomTypeService.deleteRoomType(roomTypeId)
      .then(() => {
        getRoomTypes();
        getDashboardMetrics();
        setConfirmDialog({
          ...confirmDialog,
          isOpen: false
        });
        setNotify({
          isOpen: true,
          type: 'error',
          message: 'Room Type Deleted Successfully'
        });
      }).catch((err) => {
        constructErrorData(err);
      }).finally(() => {
        setDeletingRoomType(false);
      });
  };

  const handleAllowExtraBedChange = (event, roomType) => {
    setLoadingRoomTypes(true);
    roomType.allowExtraBeds = event.target.checked;
    RoomTypeService.updateRoomType(roomType._id, roomType)
      .then(() => {
        getRoomTypes();
        getDashboardMetrics();
        setNotify({
          isOpen: true,
          type: 'success',
          message: 'Room Type Updated Successfully'
        });
      }).finally(() => {
        setLoadingRoomTypes(false);
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

  useEffect(() => {
    getRoomTypes();
  }, []);

  return (
    <div>
      <PageTitle title="Room Types" />

      <PopUp
        openPopUp={openPopUp}
        setOpenPopUp={setOpenPopUp}
        title={currentlyEditedRoomType ? 'Edit Room Type' : 'Add Room Type'}
        dialogWidth="md"
      >
        <AddEditRoomType 
          setOpenPopUp={setOpenPopUp}
          getRoomTypes={getRoomTypes}
          roomType={currentlyEditedRoomType}
          setNotify={setNotify}
          setCurrentlyEditedRoomType={setCurrentlyEditedRoomType}
          getDashboardMetrics={getDashboardMetrics}
          />
      </PopUp>
      
      <RoomTypesTable 
        roomTypes={roomTypes}
        loadingRoomTypes={loadingRoomTypes}
        setOpenPopUp={setOpenPopUp}
        handleAllowExtraBedChange={handleAllowExtraBedChange}
        setCurrentlyEditedRoomType={setCurrentlyEditedRoomType}
        setConfirmDialog={setConfirmDialog}
        handleDeleteRoomType={handleDeleteRoomType}
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
        performingConfirmAction={deletingRoomType}
      />
    </div>
  )
}

export default RoomTypes;