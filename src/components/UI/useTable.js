import React, { useState } from 'react';
import { Table, TableCell, TableHead, TablePagination, TableRow, TableSortLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  table: {
    marginTop: theme.spacing(3),
    '& thead th': {
      fontWeight: '700',
      color: theme.palette.common.primary,
      backgroundColor: theme.palette.grey['400']
    },
    '& tbody td': {
      fontWeight: '500'
    },
    '& tbody tr:hover': {
      backgroundColor: theme.palette.grey['300'],
      cursor: 'pointer'
    }
  }
}));

function useForm (records, headCells, filterFn) {
  const classes = useStyles();
  const pages = [5, 10, 15];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[0]);
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();

  
  const TblContainer = (props) => (
    <Table className={classes.table}>
      { props.children }
    </Table>
  )
  
  const TblHead = (props) => {
    const handleSortRequest = (cellId) => {
      const isAsc = orderBy === cellId && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(cellId);
    }

    return (<TableHead>
      <TableRow>
        {
          headCells.map((headCell) => (
            <TableCell 
              key={ headCell.id }
              align={headCell.align || 'left'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              {
                headCell.disableSort ?
                headCell.label :
                (
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'desc'}
                    onClick={ () => handleSortRequest(headCell.id) }
                  >
                    { headCell.label }
                  </TableSortLabel>
                )
              }
            </TableCell>
          ))
        }
      </TableRow>
    </TableHead>)
  }
  
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

  const TblPagination = (props) => (
    <TablePagination
      component="div"
      page={page}
      count={records.length}
      rowsPerPageOptions={pages}
      rowsPerPage={rowsPerPage}
      onChangePage={handlePageChange}
      onChangeRowsPerPage={handleRowsPerPageChange}
    />
  )

  function stableSort (arr, comparator) {
    const stabilizedThis = arr.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    return stabilizedThis.map((el) => el[0]);
  }

  function getComparator (order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy)
  }

  function descendingComparator (a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  const recordsAfterPaginationAndSorting = () => {
    return stableSort(filterFn.fn(records), getComparator(order, orderBy))
            .slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  }

  return {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPaginationAndSorting
  }
}

export default useForm;
