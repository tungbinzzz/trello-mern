/* eslint-disable react/prop-types */
import Box from '@mui/material/Box';
import Card from './Card/Card';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';


function ListCards({ cards }) {
    return (
        <SortableContext items={cards?.map(c => c._id)} strategy={verticalListSortingStrategy}>
            <Box
                sx={{
                    p: '0 5px 5px 5px',
                    m: '0 5px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    overflowX: 'hidden',
                    overflowY: 'auto',
                    maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)} - ${theme.trello.columnHeaderHeight} - ${theme.trello.columnFooterHeight})`,

                    '&::-webkit-scrollbar-thumb': { //Chưa ăn css
                        backgroundColor: '#dcdde1',
                        borderRadius: '1px'
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: '#black',
                        borderRadius: '1px'
                    },
                    '*::-webkit-scrollbar': {
                        with: '1px',
                        height: '1px'
                    },
                }}>
                {cards?.map(card => <Card key={card._id} card={card} />)}

            </Box>
        </SortableContext>
    );
}

export default ListCards;