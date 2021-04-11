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
  { id: 'shortCode', label: 'Code' },
  { id: 'isActive', label: 'Active', align: 'center' },
  { id: 'actions', label: 'Actions', disableSort: true, align: 'center' }
];

function AmenitiesTable ({setOpenPopUp, amenities, loadingAmenities, handleAmenityStatusChange, handleDeleteAmenity, setCurrentlyEditedAmenity, setConfirmDialog}) {
  const classes = useStyles();
  const [ filterFn, setFilterFn ] = useState({ fn: (amenities) => amenities});

  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPaginationAndSorting
  } = useTable(amenities, headCells, filterFn);

  const deleteAmenity = (amenity) => {
    setCurrentlyEditedAmenity(amenity);
    setConfirmDialog({
      isOpen: true,
      title: 'Are you sure to delete this Amenity',
      subtitle: 'You cannot undo this once the amenity is deleted.',
      onConfirm: () => handleDeleteAmenity(amenity._id)
    });
  }

  const handleAddNewAmenity = ()  => {
    setCurrentlyEditedAmenity(null);
    setOpenPopUp(true);
  }

  const handleEditAmenity= (amenity) => {
    setCurrentlyEditedAmenity(amenity);
    setOpenPopUp(true);
  }

  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (amenities) => {
        if (target.value === '') {
          return amenities;
        } else {
          return amenities.filter((amenity) => `${amenity.name}${amenity.shortCode}`.toLowerCase().includes(target.value.toLowerCase()));
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
          onClick={ handleAddNewAmenity }
        >
          Add
        </Button>
      </div>
      <Paper>
        <TblContainer>
          <TblHead></TblHead>
          {
            !amenities.length && !loadingAmenities &&(
              <TableBody>
                <TableRow>
                  <StyledTableCell colSpan="12" className={classes.emptyPlaceholderCell}>No Amenities added yet.</StyledTableCell>
                </TableRow>
              </TableBody>
            )
          }
          <TableBody>
            {
              loadingAmenities ?
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
                !recordsAfterPaginationAndSorting().length && amenities.length
                ? (
                  <TableRow>
                    <StyledTableCell colSpan="12" className={classes.emptyPlaceholderCell}>Nothing matches your search criteria.</StyledTableCell>
                  </TableRow>
                ) : (
                  recordsAfterPaginationAndSorting().map((amenity) => (
                    <StyledTableRow key={ amenity._id }>
                      <StyledTableCell>
                        {amenity.name}
                      </StyledTableCell>
  
                      <StyledTableCell>
                        {amenity.shortCode}
                      </StyledTableCell>
  
                      <StyledTableCell align="center">
                        <Switch
                          checked={amenity.isActive}
                          onChange={(e) => handleAmenityStatusChange(e, amenity)  }
                          color="primary"
                        />
                      </StyledTableCell>
  
                      <StyledTableCell align="center">
                        <IconButton onClick={() => handleEditAmenity(amenity) }>
                          <EditIcon color="primary" />
                        </IconButton>
                        <IconButton onClick={() => deleteAmenity(amenity) }>
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
          !!amenities.length && <TblPagination />
        }
      </Paper>
    </div>
  )
}

export default AmenitiesTable;