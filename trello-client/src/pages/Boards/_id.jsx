
import Container from '@mui/material/Container';
import BoardContent from './BoardContent/BoardContent';
import AppBar from '../../components/AppBar/AppBar';
import BoardBar from './BoardBar/BoardBar';
//import {mockData} from '~/apis/mock-data'
import { useEffect, useState } from 'react';
import { fetchBoardDetailAPI, createNewColumnAPI, createNewCardAPI, updateBoardDetailAPI, updateColumnDetailAPI } from '~/apis/index'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash';
function Board() {

    const [board, setBoard] = useState(null)

    useEffect(() => {
        const boardId = '6721fb3c4a232d9c43a2bb5a'
        fetchBoardDetailAPI(boardId).then((board) => {
            board.columns.forEach(c => {
                if (isEmpty(c.cards)) {
                    c.cards = [generatePlaceholderCard(c)]
                    c.cardOrderIds = [generatePlaceholderCard(c)._id]
                }
            })
            setBoard(board)
        })
    }, [])

    const createNewColumn = async (newColumnData) => {
        const newColumn = await createNewColumnAPI({
            ...newColumnData,
            boardId: board._id
        })

        newColumn.cards = [generatePlaceholderCard(newColumn)]
        newColumn.cardOrderIds = [generatePlaceholderCard(newColumn)._id]
        //FE phải tự làm đúng lại state data board (thay vì phải gọi lại api fetchBoardDetailAPI)
        //Lưu ý: cách này tùy thuộc vào từng đặc thù của dự án
        const newBoard = { ...board }
        newBoard.columns.push(newColumn)
        newBoard.columnOrderIds.push(newColumn._id)
        setBoard(newBoard)
    }

    const createNewCard = async (newCardData) => {
        const newCard = await createNewCardAPI({
            ...newCardData,
            boardId: board._id
        })
        //FE phải tự làm đúng lại state data board (thay vì phải gọi lại api fetchBoardDetailAPI)
        //Lưu ý: cách này tùy thuộc vào từng đặc thù của dự án
        const newBoard = { ...board }
        const columnToUpdate = newBoard.columns.find(c => c._id === newCard.columnId)
        if (columnToUpdate) {
            columnToUpdate.cards.push(newCard)
            columnToUpdate.cardOrderIds.push(newCard._id)
        }
        setBoard(newBoard)
    }

    const moveColumns = (dndOrderedColumns) => {
        const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
        const newBoard = { ...board }
        newBoard.columns = dndOrderedColumns
        newBoard.columnOrderIds = dndOrderedColumnsIds
        setBoard(newBoard)
        updateBoardDetailAPI(newBoard._id, { columnOrderIds: newBoard.columnOrderIds })
    }

    const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
        //Update cho chuẩn dữ liệu stateBoard
        const newBoard = { ...board }
        const columnToUpdate = newBoard.columns.find(c => c._id === columnId)
        if (columnToUpdate) {
            columnToUpdate.cards = dndOrderedCards
            columnToUpdate.cardOrderIds = dndOrderedCardIds
        }
        setBoard(newBoard)

        //Gọi API update column
       // updateColumnDetailAPI(columnId, { cardOrderIds: dndOrderedCardIds })
    }

    return (
        <>
            <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>

                <AppBar />

                <BoardBar board={board} />

                <BoardContent
                    board={board}
                    createNewColumn={createNewColumn}
                    createNewCard={createNewCard}
                    moveColumns={moveColumns}
                    moveCardInTheSameColumn={moveCardInTheSameColumn}
                />

            </Container>
        </>
    )
}

export default Board;