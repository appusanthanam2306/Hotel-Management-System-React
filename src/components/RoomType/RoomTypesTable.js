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
  { id: 'title', label: 'Name' },
  { id: 'shortCode', label: 'Short Code' },
  { id: 'allowExtraBeds', label: 'Allow Extra Beds', align: 'center' },
  { id: 'basePrice', label: 'Base Price (Rs)', align: 'right' },
  { id: 'actions', label: 'Actions', disableSort: true, align: 'center' }
]

function RoomTypesTable ({setOpenPopUp, roomTypes, loadingRoomTypes, handleAllowExtraBedChange, handleDeleteRoomType, setCurrentlyEditedRoomType, setConfirmDialog}) {
  const classes = useStyles();
  const [ filterFn, setFilterFn ] = useState({ fn: (roomTypes) => roomTypes});

  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPaginationAndSorting
  } = useTable(roomTypes, headCells, filterFn);

  const deleteRoomType = (roomType) => {
    setCurrentlyEditedRoomType(roomType);
    setConfirmDialog({
      isOpen: true,
      title: 'Are you sure to delete this Room Type',
      subtitle: 'You cannot undo this once the room type is deleted.',
      onConfirm: () => handleDeleteRoomType(roomType._id)
    });
  }

  const handleAddNewRoomType = ()  => {
    setCurrentlyEditedRoomType(null);
    setOpenPopUp(true)
  }

  const handleEditRoomType = (roomType) => {
    setCurrentlyEditedRoomType(roomType);
    setOpenPopUp(true);
  }

  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (roomTypes) => {
        if (target.value === '') {
          return roomTypes;
        } else {
          return roomTypes.filter((roomType) => `${roomType.title}${roomType.shortCode}${roomType.basePrice}`.toLowerCase().includes(target.value.toLowerCase()));
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
          onClick={ handleAddNewRoomType }
        >
          Add
        </Button>
      </div>
      <Paper>
        <TblContainer>
          <TblHead></TblHead>
          {
            !roomTypes.length && !loadingRoomTypes &&(
              <TableBody>
                <TableRow>
                  <StyledTableCell colSpan="12" className={classes.emptyPlaceholderCell}>No Room Types added yet.</StyledTableCell>
                </TableRow>
              </TableBody>
            )
          }
          <TableBody>
            {
              loadingRoomTypes ?
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
                !recordsAfterPaginationAndSorting().length && roomTypes.length
                ? (
                  <TableRow>
                    <StyledTableCell colSpan="12" className={classes.emptyPlaceholderCell}>Nothing matches your search criteria.</StyledTableCell>
                  </TableRow>
                ) : (
                  recordsAfterPaginationAndSorting().map((roomType) => (
                    <StyledTableRow key={ roomType._id }>
                      <StyledTableCell>
                        {roomType.title}
                      </StyledTableCell>

                      <StyledTableCell>
                        {roomType.shortCode}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <Switch
                          checked={roomType.allowExtraBeds}
                          onChange={(e) => handleAllowExtraBedChange(e, roomType)  }
                          color="primary"
                        />
                      </StyledTableCell>

                      <StyledTableCell align="right">
                        {roomType.basePrice}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <IconButton onClick={() => handleEditRoomType(roomType) }>
                          <EditIcon color="primary" />
                        </IconButton>
                        <IconButton onClick={() => deleteRoomType(roomType) }>
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
          !!roomTypes.length && <TblPagination />
        }
      </Paper>
    </div>
  )
}

export default RoomTypesTable;
