import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Close'
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  GridValidRowModel,
} from '@mui/x-data-grid'
import { randomId } from '@mui/x-data-grid-generator'
import { deleteData, postData, updateData } from '../api/client'
import { useFoodItems } from '../api/useFoodItems'
import { IFoodItem } from '../api/data-response.interface'
import { useCallback, useEffect, useRef, useState } from 'react'
import Alert, { AlertProps } from '@mui/material/Alert'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from '@mui/material'

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props

  const handleClick = () => {
    const key = randomId()
    setRows(oldRows => [
      {
        _id: key,
        name: '',
        energy: '',
        protein: '',
        fat: '',
        ch: '',
        notes: '',
        isNew: true,
      },
      ...oldRows,
    ])
    setRowModesModel(oldModel => ({
      ...oldModel,
      [key]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }))
  }

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  )
}

export default function FoodItemsDataGrid() {
  const { foodItems, isLoading, isError } = useFoodItems()
  const initialRows: GridRowsProp = foodItems as IFoodItem[]
  const [rows, setRows] = useState(initialRows)
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
  /***/
  const noButtonRef = useRef<HTMLButtonElement>(null)
  const [promiseArguments, setPromiseArguments] = useState<any>(null)

  const [snackbar, setSnackbar] = useState<Pick<
    AlertProps,
    'children' | 'severity'
  > | null>(null)

  const handleCloseSnackbar = () => setSnackbar(null)

  const handleNo = () => {
    const { oldRow, resolve } = promiseArguments
    resolve(oldRow) // Resolve with the old row to not update the internal state
    setPromiseArguments(null)
  }

  const handleYes = async () => {
    const { newRow, oldRow, reject, resolve } = promiseArguments

    try {
      // Make the HTTP request to save in the backend
      const response = await updateData(`/api/food/${oldRow._id}`, newRow)
      setSnackbar({
        children:
          response.status === 'OK' ? 'Food item successfully saved' : null,
        severity: 'success',
      })
      resolve(newRow)
      setPromiseArguments(null)
    } catch (error) {
      setSnackbar({
        children: 'Saving not succeeded :-/',
        severity: 'error',
      })
      reject(oldRow)
      setPromiseArguments(null)
    }
  }

  const handleEntered = () => {
    // The `autoFocus` is not used because, if used, the same Enter that saves
    // the cell triggers "No". Instead, we manually focus the "No" button once
    // the dialog is fully open.
    // noButtonRef.current?.focus();
  }

  const renderConfirmDialog = () => {
    if (!promiseArguments) {
      return null
    }

    const { newRow, oldRow } = promiseArguments
    const mutation = computeMutation(newRow, oldRow)

    return (
      <Dialog
        maxWidth="xs"
        TransitionProps={{ onEntered: handleEntered }}
        open={!!promiseArguments}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent dividers>
          {`Pressing 'Yes' will change ${mutation}.`}
        </DialogContent>
        <DialogActions>
          <Button ref={noButtonRef} onClick={handleNo}>
            No
          </Button>
          <Button onClick={handleYes}>Yes</Button>
        </DialogActions>
      </Dialog>
    )
  }

  function computeMutation(newRow: GridRowModel, oldRow: GridRowModel) {
    if (newRow.name !== oldRow.name) {
      return `Name from '${oldRow.name}' to '${newRow.name}'`
    }
    if (newRow.energy !== oldRow.energy) {
      return `Energy from '${oldRow.energy || ''}' to '${newRow.energy || ''}'`
    }
    if (newRow.protein !== oldRow.protein) {
      return `Protein from '${oldRow.protein || ''}' to '${
        newRow.protein || ''
      }'`
    }
    if (newRow.fat !== oldRow.fat) {
      return `Fat from '${oldRow.fat || ''}' to '${newRow.fat || ''}'`
    }
    if (newRow.ch !== oldRow.ch) {
      return `Carbon hidrate from '${oldRow.ch || ''}' to '${newRow.ch || ''}'`
    }
    if (newRow.notes !== oldRow.notes) {
      return `Notes from '${oldRow.notes || ''}' to '${newRow.notes || ''}'`
    }
    return null
  }
  /***/

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  }

  const handleDeleteClick = (id: GridRowId) => () => {
    deleteData(`api/food/${id}`)
    setRows(rows.filter(row => row._id !== id))
  }

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    })

    const editedRow = rows.find(row => row._id === id)
    if (editedRow!.isNew) {
      setRows(rows.filter(row => row._id !== id))
    }
  }

  // const processRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel) => {
  //   console.log(oldRow.isNew)
  //   const updatedRow = { ...newRow, isNew: false }
  //   setRows(rows.map(row => (row._id === newRow._id ? updatedRow : row)))
  //   postData('/api/food', newRow)
  //   return updatedRow
  // }

  const processRowUpdate = useCallback(
    (newRow: GridRowModel, oldRow: GridRowModel) => {
      if (oldRow.isNew) {
        const updatedRow = { ...newRow, isNew: false }
        setRows(rows.map(row => (row._id === newRow._id ? updatedRow : row)))
        postData('/api/food', newRow)
        return updatedRow
      }
      return new Promise<GridRowModel>((resolve, reject) => {
        const mutation = computeMutation(newRow, oldRow)
        if (mutation) {
          // Save the arguments to resolve or reject the promise later
          setPromiseArguments({ resolve, reject, newRow, oldRow })
        } else {
          resolve(oldRow) // Nothing was changed
        }
      })
    },
    []
  )

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 180, editable: true },
    {
      field: 'energy',
      headerName: 'Energy',
      type: 'number',
      width: 80,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'protein',
      headerName: 'Protein',
      type: 'number',
      width: 80,
      editable: true,
    },
    {
      field: 'fat',
      headerName: 'Fat',
      type: 'number',
      width: 80,
      editable: true,
    },
    {
      field: 'ch',
      headerName: 'Carbs',
      type: 'number',
      width: 80,
      editable: true,
    },
    {
      field: 'notes',
      headerName: 'Notes',
      type: 'text',
      width: 196,
      editable: true,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ]
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ]
      },
    },
  ]

  useEffect(() => {
    if (foodItems) {
      setRows(foodItems)
    }
  }, [foodItems])

  function handleProcessRowUpdateError(error: any): void {
    throw new Error(error)
  }

  return (
    <Box
      sx={{
        height: 500,
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      {renderConfirmDialog()}
      {isLoading ? <span>Loading ...</span> : null}
      {isError ? <span>Something went wrong :-/</span> : null}
      {rows ? (
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={handleProcessRowUpdateError}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
          getRowId={row => row._id}
          autoHeight
        />
      ) : null}
      {!!snackbar && (
        <Snackbar open onClose={handleCloseSnackbar} autoHideDuration={6000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </Box>
  )
}
