import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import PageTitle from '../../components/PageTitle';
import Notifications from '../../components/UI/Notifications';

import AddEditFloor from '../../components/Floor/AddEditFloor';
import FloorsTable from '../../components/Floor/FloorsTable';
import PopUp from '../../components/UI/PopUp';
import ConfirmDialog from '../../components/UI/ConfirmDialog';
import FloorService from '../../services/FloorService';

const useStyles = makeStyles({
  
});


function Floors ({getDashboardMetrics}) {
  const classes = useStyles();
  const [ floors, setFloors ] = useState([]);
  const [ loadingFloors, setLoadingFloors ] = useState(false);
  const [ openPopUp, setOpenPopUp ] = useState(false);
  const [ currentlyEditedFloor, setCurrentlyEditedFloor ] = useState(null);
  const [ deletingFloor, setDeletingFloor ] = useState(false);
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

  const getFloors = () => {
    setLoadingFloors(true);
    FloorService.getFloors()
      .then(({ data }) => {
        setFloors(data);
      }).finally(() => {
        setLoadingFloors(false);
      });
  };

  const handleDeleteFloor = (floorId) => {
    setDeletingFloor(true);
    FloorService.deleteFloor(floorId)
      .then(() => {
        getFloors();
        getDashboardMetrics();
        setConfirmDialog({
          ...confirmDialog,
          isOpen: false
        });
        setNotify({
          isOpen: true,
          type: 'error',
          message: 'Floor Deleted Successfully'
        });
      }).catch((err) => {
        constructErrorData(err);
      }).finally(() => {
        setDeletingFloor(false);
      });
  };

  const handleFloorStatusChange = (event, floor) => {
    setLoadingFloors(true);
    floor.isActive = event.target.checked;
    FloorService.updateFloor(floor._id, floor)
      .then(() => {
        getFloors();
        getDashboardMetrics();
        setNotify({
          isOpen: true,
          type: 'success',
          message: 'Floor Updated Successfully'
        });
      }).finally(() => {
        setLoadingFloors(false);
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
    getFloors();
  }, []);

  return (
    <div>
      <PageTitle title="Floors" />

      <PopUp
        openPopUp={openPopUp}
        setOpenPopUp={setOpenPopUp}
        title={currentlyEditedFloor ? 'Edit Floor' : 'Add Floor'}
      >
        <AddEditFloor 
          setOpenPopUp={setOpenPopUp}
          getFloors={getFloors}
          floor={currentlyEditedFloor}
          setNotify={setNotify}
          setCurrentlyEditedFloor={setCurrentlyEditedFloor}
          getDashboardMetrics={getDashboardMetrics}
        />
      </PopUp>

      <FloorsTable 
        floors={floors}
        loadingFloors={loadingFloors}
        setOpenPopUp={setOpenPopUp}
        handleFloorStatusChange={handleFloorStatusChange}
        setCurrentlyEditedFloor={setCurrentlyEditedFloor}
        setConfirmDialog={setConfirmDialog}
        handleDeleteFloor={handleDeleteFloor}
      />

      <Notifications
        notify={notify}
        setNotify={setNotify}
      ></Notifications>

      <ConfirmDialog 
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
        performingConfirmAction={deletingFloor}
        errorsDuringDelete={errorsDuringDelete}
        setErrorsDuringDelete={setErrorsDuringDelete}
      />
    </div>
  )
}

export default Floors;