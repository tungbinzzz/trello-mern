/* eslint-disable react/prop-types */

import { Card as MuiCard } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import GroupIcon from '@mui/icons-material/Group';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import AttachmentIcon from '@mui/icons-material/Attachment';
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function Card({ card }) {
    //DND Kit
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: card._id, data: { ...card } });

    const dndKitCardStyle = {
        // touchAction: 'none', // dành cho sensor default dạng pointersensor
        transform: CSS.Translate.toString(transform), //Nếu sử dụng transform như docs sẽ bị lỗi dãn 
        transition,
        opacity: isDragging ? 0.5 : undefined,
        border: isDragging ? '1px solid white' : undefined
    };

    const sholdShowCardActions = () => {
        return !!card?.memberIds?.length || !!card?.comments?.length || !!card?.attachments?.length
    }
    return (
        <MuiCard
            ref={setNodeRef}
            style={dndKitCardStyle}
            {...attributes}
            {...listeners}
            sx={{
                cursor: 'pointer',
                boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
                overflow: 'unset',
                display: card?.FE_PlaceholderCard ? 'none' : 'block',
                border: '1px solid transparent',
                '&:hover': {borderColor:(theme) => theme.palette.primary.main}
            }}
        >
            {card?.cover &&

                <CardMedia
                    sx={{ height: 140 }}
                    image={card?.cover}

                />
            }
            <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                <Typography>
                    {card?.title}
                </Typography>

            </CardContent>
            {sholdShowCardActions() &&
                <CardActions sx={{ p: '0 4px 8px 4px' }}>
                    {!!card?.memberIds?.length /* Nếu có giá trị thì trả về true */ &&
                        <Button size="small" startIcon={<GroupIcon />}>{card?.memberIds.length}</Button>
                    }
                    {!!card?.comments?.length /* Nếu có giá trị thì trả về true */ &&
                        <Button size="small" startIcon={<ModeCommentIcon />}>{card?.comments.length}</Button>
                    }
                    {!!card?.attachments?.length /* Nếu có giá trị thì trả về true */ &&
                        <Button size="small" startIcon={<AttachmentIcon />}>{card?.attachments.length}</Button>
                    }
                </CardActions>
            }
        </MuiCard>
    );
}

export default Card;