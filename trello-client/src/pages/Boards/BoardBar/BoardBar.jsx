/* eslint-disable react/prop-types */
import { Box } from "@mui/material";
import Chip from '@mui/material/Chip';
import DashboardIcon from '@mui/icons-material/Dashboard';
import VpnLockIcon from '@mui/icons-material/VpnLock';
import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import BoltIcon from '@mui/icons-material/Bolt';
import FilterListIcon from '@mui/icons-material/FilterList';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import {capitalizeFirstLetter} from '~/utils/formatters'


const MENU_STYLE = {
    color: 'white',
    bgcolor: 'transparent',
    border: 'none',
    paddingX: '5px',
    borderRadius: '4px',
    '& .MuiSvgIcon-root': {
        color: 'white'
    },
    "&:hover": {
        bgcolor: 'primary.50'
    },
    '& .MuiChip-label': {
        marginTop: '2px'
    }
}


function BoardBar({ board }) {
    return (
        <div>
            <Box px={2} sx={{
                width: "100%",
                height: (theme) => theme.trello.boardBarHeight,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                overflowX: 'auto',
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2')

            }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }} >
                    <Chip
                        sx={MENU_STYLE}
                        icon={<DashboardIcon />}
                        
                        label={board?.title}
                        onClick={() => { }}
                    />

                    <Chip
                        sx={MENU_STYLE}
                        icon={<VpnLockIcon />}
                        label={capitalizeFirstLetter(board?.type)}
                        onClick={() => { }}
                    />

                    <Chip
                        sx={MENU_STYLE}
                        icon={<AddToDriveIcon />}
                        label="Add To Google Driver"
                        onClick={() => { }}
                    />

                    <Chip
                        sx={MENU_STYLE}
                        icon={<BoltIcon />}
                        label="Automation"
                        onClick={() => { }}
                    />

                    <Chip
                        sx={MENU_STYLE}
                        icon={<FilterListIcon />}
                        label="Filters"
                        onClick={() => { }}
                    />


                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }} >
                    <Button
                        variant="outlined"
                        startIcon={<PersonAddIcon />}
                        sx={{
                            color: 'white',
                            borderColor: 'white',
                            '&:hover ': { borderColor: 'white' }
                        }}
                    >
                        Invite
                    </Button>
                    <AvatarGroup
                        max={4}
                        sx={{
                            gap: '10px',
                            '& .MuiAvatar-root': {
                                width: 34,
                                height: 34,
                                fontSize: 16,
                                border: 'none'
                            }
                        }}
                    >
                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                        <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                        <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
                        <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
                        <Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg" />
                    </AvatarGroup>
                </Box>
            </Box>
        </div>
    );
}

export default BoardBar;