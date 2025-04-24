/* eslint-disable react/prop-types */

import Typography from "@mui/material/Typography";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ContentCut from '@mui/icons-material/ContentCut';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Cloud from '@mui/icons-material/Cloud';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Tooltip from '@mui/material/Tooltip';
import { ContentCopy, ContentPaste } from "@mui/icons-material";
import AddCardIcon from '@mui/icons-material/AddCard';
import { Button } from "@mui/material";
import DragHandleIcon from '@mui/icons-material/DragHandle';
import ListCards from "./ListCards/ListCards";
import Box from '@mui/material/Box';
import React from 'react';
import { mapOrder } from "~/utils/sorts";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import { toast } from 'react-toastify';



function Column({ column, createNewCard }) {
    //DND Kit
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: column._id, data: { ...column } });

    const dndKitColumnStyle = {
        // touchAction: 'none', // dành cho sensor default dạng pointersensor
        transform: CSS.Translate.toString(transform), //Nếu sử dụng transform như docs sẽ bị lỗi dãn 
        transition,
        height: '100%', //Chiều cao phải là 100% để column ngắn di chuyển trông mượt hơn + với {...listen}
        // để trong box để khoảng trống dưới column không bị active khi kéo đi
        opacity: isDragging ? 0.5 : undefined
    };

    //MUI
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const orderedCards = mapOrder(column?.cards, column?.cardOrderIds, '_id')

    const [openNewCardForm, setOpenNewCardForm] = useState(false)
    const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)
    const [newCardTitle, setNewCardTitle] = useState('')

    const addNewCard = async () => {
        if (!newCardTitle) {
            toast.error('Please enter Card title',{position: 'top-left'})
            return
        }

        const newCardData = {
            title: newCardTitle,
            columnId: column._id
        }
        //Gọi lên props func createNewCard nằm ở component cha cao nhất _id.jsx 
        await createNewCard(newCardData)
        //console.log(newCardTitle);
        toggleOpenNewCardForm()
        setNewCardTitle('')

    }

    
    return (
        <div ref={setNodeRef}
            style={dndKitColumnStyle}
            {...attributes}
        >
            <Box
                {...listeners} //Lắng nghe các sự kiện
                sx={{
                    minWidth: '300px',
                    maxWidth: '300px',
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
                    ml: 2,
                    borderRadius: '6px',
                    height: 'fit-content',
                    maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`,
                }}
            >
                {/*Card Header */}
                <Box sx={{
                    height: (theme) => theme.trello.columnHeaderHeight,
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>{column.title}</Typography>
                    <Box>
                        <Tooltip title='More option' >
                            <ExpandMoreIcon
                                id="basic-column-dropdown"
                                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                                sx={{
                                    color: 'text.primary', cursor: 'pointer'

                                }}
                            />
                        </Tooltip>
                        <Menu
                            id="basic-menu-column-dropdown"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-column-dropdown',
                            }}
                        >
                            <MenuItem>
                                <ListItemIcon>
                                    <AddCardIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Add new card</ListItemText>

                            </MenuItem>
                            <Divider />
                            <MenuItem>
                                <ListItemIcon>
                                    <ContentCut fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Cut</ListItemText>

                            </MenuItem>
                            <Divider />
                            <MenuItem>
                                <ListItemIcon>
                                    <ContentCopy fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Copy</ListItemText>

                            </MenuItem>
                            <Divider />
                            <MenuItem>
                                <ListItemIcon>
                                    <ContentPaste fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Paste</ListItemText>

                            </MenuItem>
                            <Divider />
                            <MenuItem>
                                <ListItemIcon>
                                    <DeleteForeverIcon />
                                </ListItemIcon>
                                <ListItemText>Remove this column</ListItemText>
                            </MenuItem>
                            <Divider />
                            <MenuItem>
                                <ListItemIcon>
                                    <Cloud fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Archive this column</ListItemText>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Box>

                {/*List Card Content */}
                <ListCards cards={orderedCards} />


                {/*Card Footer */}
                <Box sx={{
                    height: (theme) => theme.trello.FooterHeight,
                    p: 2,
                }}>
                    {!openNewCardForm
                        ?
                        <Box
                            sx={{
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Button startIcon={<AddCardIcon />} onClick={toggleOpenNewCardForm}>Add new card</Button>
                            <Tooltip title='Drag to move' >
                                <DragHandleIcon sx={{ cursor: 'pointer' }} />
                            </Tooltip>
                        </Box>
                        :
                        <Box
                            sx={{
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            <TextField
                                id="outlined-search"
                                label="Enter card title..."
                                type="text"
                                size='small'
                                variant='outlined'
                                autoFocus
                                data-no-dnd='true'
                                value={newCardTitle}
                                onChange={(e) => setNewCardTitle(e.target.value)}
                                sx={{
                                    '& label': { color: 'text.primary' },
                                    '& input': {
                                        color: (theme) => theme.palette.primary.main,
                                        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'white')
                                    },
                                    '& label.Mui-focused': { color: (theme) => theme.palette.primary.main },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                                        '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main },
                                        '&.Mui-focesed fieldset': { borderColor: (theme) => theme.palette.primary.main }
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        borderRadius: 1
                                    }
                                }}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                                <Button
                                    data-no-dnd='true'
                                    onClick={addNewCard}
                                    variant='contained'
                                    color='success'
                                    size='small'
                                    sx={{
                                        boxShadow: 'none',
                                        border: '0.5px solid',
                                        borderColor: (theme) => theme.palette.success.main,
                                        '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                                    }}
                                >
                                    Add
                                </Button>
                                <CloseIcon
                                    data-no-dnd='true'
                                    fontSize='small'
                                    sx={{
                                        color: (theme) => theme.palette.warning.light,
                                        cursor: 'pointer',
                                        marginLeft: 0.5
                                    }}
                                    onClick={toggleOpenNewCardForm}
                                />
                            </Box>
                        </Box>
                    }
                </Box>
            </Box>
        </div>
    );
}

export default Column;