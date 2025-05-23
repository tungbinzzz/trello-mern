/* eslint-disable react/prop-types */


import Column from './Column/Column';
import Box from '@mui/material/Box';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import { toast } from 'react-toastify';

function ListColumns({ columns, createNewColumn, createNewCard }) {

    const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
    const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)
    const [newColumnTitle, setNewColumnTitle] = useState('')

    const addNewColumn = async () => {
        if(!newColumnTitle) {
            toast.error('Please enter column title')
            return 
        }
        const newColumnData = {
            title: newColumnTitle
        }
        await createNewColumn(newColumnData)

        //console.log(newColumnTitle);
        toggleOpenNewColumnForm()
        setNewColumnTitle('')

    }


    return (
        <SortableContext items={columns?.map(c => c._id)} strategy={horizontalListSortingStrategy}>
            <Box sx={{
                bgcolor: 'inherit',
                width: '100%',
                height: '100%',
                display: "flex",
                overflowX: 'auto',
                overflowY: 'hidden',
                '&::-webkit-scrollbar-track': { m: 2 }
            }}>
                {/*Card*/}
                {columns?.map((column) => {
                    return <Column key={column._id} column={column} createNewCard={createNewCard} />
                })}


                {/*Box add new column */}
                {!openNewColumnForm
                    ?
                    <Box onClick={toggleOpenNewColumnForm} sx={{
                        minWidth: '250px',
                        maxWidth: '250px',
                        mx: 2,
                        borderRadius: '6px',
                        height: 'fit-content',
                        bgcolor: '#ffffff3d'
                    }}>
                        <Button
                            startIcon={<AddToPhotosIcon />}
                            sx={{
                                color: 'white',
                                width: '100%',
                                justifyContent: 'flex-start',
                                pl: 2.5,
                                py: 1
                            }}>
                            Add new column
                        </Button>
                    </Box>
                    :
                    <Box
                        sx={{
                            minWidth: '250px',
                            maxWidth: '250px',
                            mx: 2,
                            p: 1,
                            borderRadius: '6px',
                            height: 'fit-content',
                            bgcolor: '#ffffff3d',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1
                        }}
                    >
                        <TextField
                            id="outlined-search"
                            label="Enter column title..."
                            type="text"
                            size='small'
                            variant='outlined'
                            autoFocus
                            value={newColumnTitle}
                            onChange={(e) => setNewColumnTitle(e.target.value)}
                            sx={{
                                '& label': { color: 'white' },
                                '& input': { color: 'white' },
                                '& label.Mui-focused': { color: 'white' },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: "white" },
                                    '&:hover fieldset': { borderColor: "white" },
                                    '&.Mui-focused fieldset': { borderColor: "white" },
                                }
                            }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center',justifyContent: 'space-between'}} >
                            <Button
                                onClick={addNewColumn}
                                variant='contained'
                                color='success'
                                size='small'
                                sx={{
                                    boxShadow: 'none',
                                    border: '0.5px solid',
                                    borderColor: (theme) => theme.palette.success.main,
                                    '&:hover': {bgcolor: (theme) => theme.palette.success.main}
                                }}
                            >
                                Add Column
                            </Button>
                            <CloseIcon
                                fontSize='small'
                                sx={{
                                    color: 'white   ',
                                    cursor: 'pointer',
                                    '&:hover': {color: (theme) => theme.palette.warning.light}
                                }}
                                onClick={toggleOpenNewColumnForm}
                            />
                        </Box>
                    </Box>

                }


                {/*End Card */}
            </Box>
        </SortableContext>
    );
}

export default ListColumns;