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
  { id: 'name', label: 'Name' },
  { id: 'floorNumber', label: 'Floor Number' },
  { id: 'isActive', label: 'Active', align: 'center' },
  { id: 'actions', label: 'Actions', disableSort: true, align: 'center' }
]

function FloorsTable ({setOpenPopUp, floors, loadingFloors, handleFloorStatusChange, handleDeleteFloor, setCurrentlyEditedFloor, setConfirmDialog}) {
  const classes = useStyles();
  const [ filterFn, setFilterFn ] = useState({ fn: (floors) => floors});

  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPaginationAndSorting
  } = useTable(floors, headCells, filterFn);

  const deleteFloor = (floor) => {
    setCurrentlyEditedFloor(floor);
    setConfirmDialog({
      isOpen: true,
      title: 'Are you sure to delete this Floor',
      subtitle: 'You cannot undo this once the floor is deleted.',
      onConfirm: () => handleDeleteFloor(floor._id)
    });
  }

  const handleAddNewFloor = ()  => {
    setCurrentlyEditedFloor(null);
    setOpenPopUp(true);
  }

  const handleEditFloor = (floor) => {
    setCurrentlyEditedFloor(floor);
    setOpenPopUp(true);
  }

  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (floors) => {
        if (target.value === '') {
          return floors;
        } else {
          return floors.filter((floor) => floor.name.toLowerCase().includes(target.value.toLowerCase()));
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
          onClick={ handleAddNewFloor }
        >
          Add
        </Button>
      </div>
      <Paper>
        <TblContainer>
          <TblHead></TblHead>
          {
            !floors.length && !loadingFloors &&(
              <TableBody>
                <TableRow>
                  <StyledTableCell colSpan="12" className={classes.emptyPlaceholderCell}>No Floors added yet.</StyledTableCell>
                </TableRow>
              </TableBody>
            )
          }
          <TableBody>
            {
              loadingFloors ?
              (
                [1, 2, 3, 4, 5].map((el) => (
                  <TableRow key={el}>
                    <StyledTableCell><Skeleton animation="wave" height={35} /></StyledTableCell>
                    <StyledTableCell><Skeleton animation="wave" height={35} /></StyledTableCell>
                    <StyledTableCell><Skeleton animation="wave" height={35} /></StyledTableCell>
                    <StyledTableCell><Skeleton animation="wave" height={35} /></StyledTableCell>
                  </TableRow>
                ))
              ) :
              (
                !recordsAfterPaginationAndSorting().length && floors.length
                ? (
                  <TableRow>
                    <StyledTableCell colSpan="12" className={classes.emptyPlaceholderCell}>Nothing matches your search criteria.</StyledTableCell>
                  </TableRow>
                ) : (
                  recordsAfterPaginationAndSorting().map((floor) => (
                    <StyledTableRow key={ floor._id }>
                      <StyledTableCell>
                        {floor.name}
                      </StyledTableCell>

                      <StyledTableCell>
                        {floor.floorNumber}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <Switch
                          checked={floor.isActive}
                          onChange={(e) => handleFloorStatusChange(e, floor)  }
                          color="primary"
                        />
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <IconButton onClick={() => handleEditFloor(floor) }>
                          <EditIcon color="primary" />
                        </IconButton>
                        <IconButton onClick={() => deleteFloor(floor) }>
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
          !!floors.length && <TblPagination />
        }
      </Paper>
    </div>
  )
}

export default FloorsTable;