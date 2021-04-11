import React, { useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Skeleton from '@material-ui/lab/Skeleton';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import useTable from '../UI/useTable';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.grey['500'],
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5)
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 700,
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: '0.75rem',
    gap: '1rem'
  },
  emptyPlaceholderCell: {
    padding: theme.spacing(3),
    fontSize: '1.1rem',
    textAlign: 'center'
  }
}));

const headCells = [
  { id: 'roomNumber', label: 'Room Number' },
  { id: 'floorId', label: 'Floor Number' },
  { id: 'roomTypeId', label: 'Room Type' },
  { id: 'isActive', label: 'Active', align: 'center' },
  { id: 'actions', label: 'Actions', disableSort: true, align: 'center' }
]

function RoomsTable ({setOpenPopUp, rooms, loadingRooms, handleRoomStatusChange, handleDeleteRoom, setCurrentlyEditedRoom, setConfirmDialog, roomTypes, floors}) {
  const classes = useStyles();
  const [ filterFn, setFilterFn ] = useState({ fn: (rooms) => rooms});

  const roomsWithAllDetails = rooms.map((room) => {
    let newRoom = {...room}
    let mappedRoomType = roomTypes.find((roomType) => roomType._id === room.roomTypeId);
    let mappedFloor = floors.find((floor) => floor._id === room.floorId);
    if (mappedRoomType) {
      newRoom.roomTypeName = mappedRoomType.title;
    }
    if (mappedFloor) {
      newRoom.floorNumberName = mappedFloor.name;
    }
    return newRoom;
  });

  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPaginationAndSorting
  } = useTable(roomsWithAllDetails, headCells, filterFn);

  const deleteRoom = (room) => {
    setCurrentlyEditedRoom(room);
    setConfirmDialog({
      isOpen: true,
      title: 'Are you sure to delete this Room',
      subtitle: 'You cannot undo this once the room is deleted.',
      onConfirm: () => handleDeleteRoom(room._id)
    });
  }

  const handleAddNewRoom = ()  => {
    setCurrentlyEditedRoom(null);
    setOpenPopUp(true);
  }

  const handleEditRoom = (room) => {
    setCurrentlyEditedRoom(room);
    setOpenPopUp(true);
  }

  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (rooms) => {
        if (target.value === '') {
          return rooms;
        } else {
          return rooms.filter((room) => `${room.roomNumber}${room.floorNumberName}${room.roomTypeName}`.toLowerCase().includes(target.value.toLowerCase()));
        }
      }
    })
  };

  return (
    <div>
      <div className={classes.searchContainer}>
        <TextField
          id="outlined-basic"
          label="Search"
          variant="outlined"
          size="small"
          onChange={handleSearch}
        />
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          startIcon={<AddIcon />}
          onClick={ handleAddNewRoom }
        >
          Add
        </Button>
      </div>
      <Paper>
        <TblContainer>
          <TblHead></TblHead>
          {
            !rooms.length && !loadingRooms &&(
              <TableBody>
                <TableRow>
                  <StyledTableCell colSpan="12" className={classes.emptyPlaceholderCell}>No Rooms added yet.</StyledTableCell>
                </TableRow>
              </TableBody>
            )
          }
          <TableBody>
            {
              loadingRooms ?
              (
                [1, 2, 3, 4, 5].map((el) => (
                  <TableRow key={el}>
                    <StyledTableCell><Skeleton animation="wave" height={35} /></StyledTableCell>
                    <StyledTableCell><Skeleton animation="wave" height={35} /></StyledTableCell>
                    <StyledTableCell><Skeleton animation="wave" height={35} /></StyledTableCell>
                    <StyledTableCell><Skeleton animation="wave" height={35} /></StyledTableCell>
                    <StyledTableCell><Skeleton animation="wave" height={35} /></StyledTableCell>
                  </TableRow>
                ))
              ) :
              (
                !recordsAfterPaginationAndSorting().length && rooms.length
                ? (
                  <TableRow>
                    <StyledTableCell colSpan="12" className={classes.emptyPlaceholderCell}>Nothing matches your search criteria.</StyledTableCell>
                  </TableRow>
                ) : (
                  recordsAfterPaginationAndSorting().map((room) => (
                    <StyledTableRow key={ room._id }>
                      <StyledTableCell>
                        {room.roomNumber}
                      </StyledTableCell>

                      <StyledTableCell>
                        {room.floorNumberName}
                      </StyledTableCell>

                      <StyledTableCell>
                        {room.roomTypeName}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <Switch
                          checked={room.isActive}
                          onChange={(e) => handleRoomStatusChange(e, room)  }
                          color="primary"
                        />
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <IconButton onClick={() => handleEditRoom(room) }>
                          <EditIcon color="primary" />
                        </IconButton>
                        <IconButton onClick={() => deleteRoom(room) }>
                          <DeleteIcon color="error" />
                        </IconButton>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                )
              )
            }
          </TableBody>
        </TblContainer>
        {
          !!rooms.length && <TblPagination />
        }
      </Paper>
    </div>
  )
}

export default RoomsTable;