import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import PageTitle from '../../components/PageTitle';
import Notifications from '../../components/UI/Notifications';

import AddEditRoom from '../../components/Room/AddEditRoom';
import RoomsTable from '../../components/Room/RoomsTable';
import PopUp from '../../components/UI/PopUp';
import ConfirmDialog from '../../components/UI/ConfirmDialog';
import RoomService from '../../services/RoomService';
import FloorService from '../../services/FloorService';
import RoomTypeService from '../../services/RoomTypeService';

const useStyles = makeStyles({
  
});

function Rooms ({getDashboardMetrics}) {
  const classes = useStyles();
  const [ rooms, setRooms ] = useState([]);
  const [ floors, setFloors ] = useState([]);
  const [ roomTypes, setRoomTypes ] = useState([]);
  const [ loadingRooms, setLoadingRooms ] = useState(false);
  const [ openPopUp, setOpenPopUp ] = useState(false);
  const [ currentlyEditedRoom, setCurrentlyEditedRoom ] = useState(null);
  const [ deletingRoom, setDeletingRoom ] = useState(false);
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

  const getRooms = () => {
    setLoadingRooms(true);
    RoomService.getRooms()
      .then(({ data }) => {
        setRooms(data);
      }).finally(() => {
        setLoadingRooms(false);
      });
  };

  const getFloors = () => {
    setLoadingRooms(true);
    FloorService.getFloors()
      .then(({ data }) => {
        setFloors(data);
      }).finally(() => {
        setLoadingRooms(false);
      });
  };
  const getRoomTypes = () => {
    setLoadingRooms(true);
    RoomTypeService.getRoomTypes()
      .then(({ data }) => {
        setRoomTypes(data);
      }).finally(() => {
        setLoadingRooms(false);
      });
  };

  const handleDeleteRoom = (roomId) => {
    setDeletingRoom(true);
    RoomService.deleteRoom(roomId)
      .then(() => {
        getRooms();
        getDashboardMetrics();
        setConfirmDialog({
          ...confirmDialog,
          isOpen: false
        });
        setNotify({
          isOpen: true,
          type: 'error',
          message: 'Room Deleted Successfully'
        });
      }).catch((err) => {
        constructErrorData(err);
      }).finally(() => {
        setDeletingRoom(false);
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

  const handleRoomStatusChange = (event, room) => {
    setLoadingRooms(true);
    room.isActive = event.target.checked;
    RoomService.updateRoom(room._id, room)
      .then(() => {
        getRooms();
        getDashboardMetrics();
        setNotify({
          isOpen: true,
          type: 'success',
          message: 'Room Updated Successfully'
        });
      }).finally(() => {
        setLoadingRooms(false);
      });
  };

  useEffect(() => {
    getRooms();
    getFloors();
    getRoomTypes();
  }, []);

  return (
    <div>
      <PageTitle title="Rooms" />

      <PopUp
        openPopUp={openPopUp}
        setOpenPopUp={setOpenPopUp}
        title={setCurrentlyEditedRoom ? 'Edit Room' : 'Add Room'}
      >
        <AddEditRoom 
          setOpenPopUp={setOpenPopUp}
          getRooms={getRooms}
          room={currentlyEditedRoom}
          setNotify={setNotify}
          setCurrentlyEditedRoom={setCurrentlyEditedRoom}
          roomTypes={roomTypes}
          floors={floors}
          getDashboardMetrics={getDashboardMetrics}
        />
      </PopUp>

      <RoomsTable 
        rooms={rooms}
        loadingRooms={loadingRooms}
        setOpenPopUp={setOpenPopUp}
        handleRoomStatusChange={handleRoomStatusChange}
        setCurrentlyEditedRoom={setCurrentlyEditedRoom}
        setConfirmDialog={setConfirmDialog}
        handleDeleteRoom={handleDeleteRoom}
        roomTypes={roomTypes}
        floors={floors}
      />

      <Notifications
        notify={notify}
        setNotify={setNotify}
      ></Notifications>

      <ConfirmDialog 
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
        performingConfirmAction={deletingRoom}
        errorsDuringDelete={errorsDuringDelete}
        setErrorsDuringDelete={setErrorsDuringDelete}
      />
    </div>
  )
}

export default Rooms;