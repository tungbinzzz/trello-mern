/* eslint-disable react/prop-types */
import Box from "@mui/material/Box";
import ListColumns from "./ListColumns/ListColumns";
import { mapOrder } from "~/utils/sorts";
import {
    DndContext,
    useSensor,
    useSensors,
    // MouseSensor,
    // TouchSensor,
    DragOverlay,
    defaultDropAnimationSideEffects,
    closestCorners,
    pointerWithin,
    getFirstCollision,
        closestCenter
    } from '@dnd-kit/core';
import {MouseSensor, TouchSensor} from '~/customLib/DndKitSensors'
import { useEffect, useState, useCallback, useRef } from "react";
import { arrayMove } from '@dnd-kit/sortable';
import { cloneDeep, isEmpty } from "lodash";
import Column from "./ListColumns/Column/Column";
import Card from "./ListColumns/Column/ListCards/Card/Card";
import { generatePlaceholderCard } from '~/utils/formatters'
const ACTIVE_DRAG_ITEM_TYPE = {
    COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
    CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD',
}

function BoardContent({ board, createNewColumn, createNewCard, moveColumns, moveCardInTheSameColumn }) {

    // const pointerSensor = useSensor(PointerSensor, {
    //     // Require the mouse to move by 10 pixels before activating
    //     activationConstraint: {  
    //         distance: 10,
    //     }
    // },)

    const mouseSensor = useSensor(MouseSensor, {
        // Require the mouse to move by 10 pixels before activating
        activationConstraint: {
            distance: 10,
        }
    },)
    // nhấn dữ 250ms và dung sai trên màn hình cảm ứng thì mới active
    const touchSensor = useSensor(TouchSensor, {

        activationConstraint: {
            delay: 250, tolerance: 500
        }
    },)

    //const sensor = useSensors(pointerSensor)
    const sensor = useSensors(mouseSensor, touchSensor)

    const [orderedColumns, setOrderedColumns] = useState([])
    //Cùng một thời điểm chỉ có một phần tử được kéo là column hoặc card
    const [activeDragItemId, setActiveDragItemId] = useState(null)
    const [activeDragItemType, setActiveDragItemType] = useState(null)
    const [activeDragItemData, setActiveDragItemData] = useState(null)
    const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)
    //Điểm va chạm cuối cùng (Xử lý thuật toán và chạm)
    const lastOverId = useRef(null)

    useEffect(() => {
        setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
    }, [board])

    const moveCardBetweenDifferentColumn = (
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
    ) => {
        setOrderedColumns(prevColumns => {
            //Tìm vị trí index của overCard trong column đích nơi card sẽ được thả
            const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)
            //logic tính toán vị trí index mới cho card được thêm vào column khác
            let newCardIndex
            const isBelowOverItem = active.rect.current.translated &&
                active.rect.current.translated.top > over.rect.top + over.rect.height;

            const modifier = isBelowOverItem ? 1 : 0;

            newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1;

            //Clone mảng OrderedColumnState cũ ra một cái mới để xử lý rồi
            // return - cập nhật lại OrderedColumnState mới
            const nextColumns = cloneDeep(prevColumns)
            const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
            const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

            //Colum cũ
            if (nextActiveColumn) {
                //Xóa card ở column active (cũ) 
                nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)
                //Thêm card placeholder để dữ chỗ trong trường hợp card bị kéo hết đi khỏi column
                if (isEmpty(nextActiveColumn.cards)) {
                    nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
                }
                //Cập nhật lại mảng OrderIds cho chuẩn dữ liệu 
                nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
            }
            //Column mới
            if (nextOverColumn) {
                //Kiểm tra xem card đang kéo đã tồn tại ở overColumn chưa, nếu có thì xóa đi
                nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)
                //Đối với trường hợp dragEnd thì phải cập nhật lại chuẩn dữ liệu columnId trong card sau khi kéo card giữa 2 column khác nhau
                const rebuild_activeDraggingCardData = {
                    ...activeDraggingCardData,
                    columnId: nextOverColumn._id
                }
                //Thêm card đang kéo vào overColumn theo vị trí index mới
                nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)
                //Xóa placeholderCard đi nếu nó đang tồn tại 
                nextOverColumn.cards = nextOverColumn.cards.filter(c => !c.FE_PlaceholderCard)


                //Cập nhật lại mảng OrderIds cho chuẩn dữ liệu 
                nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
            }


            return nextColumns
        })
    }

    //Trigger khi thả ra
    const handleDragEnd = (event) => {

        const { active, over } = event
        if (!over || !active) return // Nếu kéo linh tinh thì return luôn tránh lỗi 
        //Xử lý kéo thả card 
        if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
            //Lấy dữ liệu và đặt tên biến cho card đang được kéo
            const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
            //card ở trên hoặc ở dưới đang tương tác với card đang được kéo  
            const { id: overCardId } = over
            //Tìm 2 columns theo cardId
            const activeColumn = findColumnByCardId(activeDraggingCardId)
            const overColumn = findColumnByCardId(overCardId)

            if (!activeColumn || !overColumn) return

            /* Phải dùng tới activeDragItemData.columnId hoặc oldColumnWhenDraggingCard._id (set và state từ bước handleDragStart)
            chứ không phải activeData trong scope hanldeDragEnd này vì sau khi đi qua onDragOver tới đây là state của card đẫ được 
            cập nhật một lần rồi.*/
            if (oldColumnWhenDraggingCard._id !== overColumn._id) {

                moveCardBetweenDifferentColumn(overColumn,
                    overCardId,
                    active,
                    over,
                    activeColumn,
                    activeDraggingCardId,
                    activeDraggingCardData)

            } else {
                //hành động kéo thả card trong column
                const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId) //Lấy vị trí cũ từ oldColumnWhenDraggingCard
                const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId) //Lấy vị trí mới từ over
                //Dùng arrayMove vì kéo card trong một column tương tự như kéo column trong một cái board content
                const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)
                const dndOrderedCardIds = dndOrderedCards.map(c => c._id)

                setOrderedColumns(prevColumns => {

                    //Clone mảng OrderedColumnsState cũ ra một cái mới để xử lý data rồi return - cập nhật lại OrderedColumnsState mới
                    const nextColumns = cloneDeep(prevColumns)
                    //Tìm tới column muốn thả
                    const targetColumn = nextColumns.find(c => c._id === overColumn._id)
                    //Cập nhật lại 2 giá trị mới là card và cardOrderIds 
                    targetColumn.cards = dndOrderedCards
                    targetColumn.cardOrderIds = dndOrderedCardIds
                    //Trả về giá trị state mới chuẩn vị trí
                    return nextColumns
                })
                moveCardInTheSameColumn(dndOrderedCards, dndOrderedCardIds, oldColumnWhenDraggingCard._id)
            }
        }


        //Xủ lý kéo thả column
        if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
            //Nếu vị trí thả khác vị trí ban đầu thì cập nhật lại state
            if (active.id !== over.id) {
                const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id) //Lấy vị trí cũ từ active
                const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id) //Lấy vị trí mới từ over

                const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
                
                setOrderedColumns(dndOrderedColumns)
                moveColumns(dndOrderedColumns)
            }

        }
        //Những dữ liệu sau khi kéo thả luôn phải đưa về giá trị mặc định ban đầu
        setActiveDragItemId(null)
        setActiveDragItemType(null)
        setActiveDragItemData(null)
        setOldColumnWhenDraggingCard(null)
    }
    //Trigger khi bắt đầu kéo
    const handleDragStart = (event) => {
        // console.log("handleDragStart: ", event)
        setActiveDragItemId(event?.active?.id)
        setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
        setActiveDragItemData(event?.active?.data?.current)
        //Nếu là kéo card thì mới thực hiện hành động set giá trị OldColumn
        if (event?.active?.data?.current?.columnId) {
            setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
        }
    }
    //Trigger trong quá trình kéo 
    const handleDragOver = (e) => {
        // Không làm gì nếu kéo column
        if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

        //Còn nếu kéo card thì xử lý để có thể kéo card qua lại giữa các column
        //console.log("handleDragOver:", e);
        const { active, over } = e
        //Nếu không tồn tại active và over thì không làm gì cả tránh trường hợp kéo ra khỏi container bị crash 
        if (!over || !active) return

        //Lấy dữ liệu và đặt tên biến cho card đang được kéo
        const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
        //card ở trên hoặc ở dưới đang tương tác với card đang được kéo  
        const { id: overCardId } = over
        //Tìm 2 columns theo cardId
        const activeColumn = findColumnByCardId(activeDraggingCardId)
        const overColumn = findColumnByCardId(overCardId)

        if (!activeColumn || !overColumn) return

        if (activeColumn._id !== overColumn._id) {

            moveCardBetweenDifferentColumn(overColumn,
                overCardId,
                active,
                over,
                activeColumn,
                activeDraggingCardId,
                activeDraggingCardData)

        }
    }
    //Hàm tìm column bằng card Id
    const findColumnByCardId = (cardId) => {
        return orderedColumns.find(column => column.cards.map(card => card._id)?.includes(cardId))
    }
    //Hàm hiệu ứng thả card không bị mất dữ chỗ overlay
    const dropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: "0.5"
                }
            }
        })
    }

    const collisionDetectionStrategy = useCallback((args) => {
        //Trường hợp kéo column thì dùng thuật toán closetCorners 
        if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
            return closestCorners({ ...args })
        }
        //Tìm các điểm giao nhau, va chạm với con trỏ
        const pointerIntersection = pointerWithin(args)

        if (!pointerIntersection?.length) return

        //Thuật toán phát hiện va chạm sẽ trả về một mảng các va chạm ở đây
        // const intersections = pointerIntersection?.length > 0 ? pointerIntersection : rectIntersection(args)
        //Tìm overId đầu tiên trong đám intersectjon ở trên
        let overId = getFirstCollision(pointerIntersection, 'id')
        if (overId) {
            /* Nếu cái over nó là column thì sẽ tìm tới cái cardId gần nhất bên trong khu vực va chạm
            đó dựa vào thuật toán phát hiện va chạm closetCenter hoặc closetCorners đều được. Tuy nhiên 
            ở đây dùng closetCenter sẽ mượt hơn */
            const checkColumn = orderedColumns.find(c => c._id === overId)
            if (checkColumn) {
                overId = closestCenter({
                    ...args,
                    droppableContainers: args.droppableContainers.filter(container => {
                        return (container.id !== overId) && (checkColumn?.cardOrderIds?.includes(container.id))
                    })
                })[0]?.id
            }

            lastOverId.current = overId
            return [{ id: overId }]
        }
        //Nếu overId là null thì trả về mảng rỗng - tránh bug crash trang
        return lastOverId.current ? [{ id: lastOverId.current }] : []
    }, [activeDragItemType, orderedColumns])

    return (

        <DndContext
            onDragEnd={handleDragEnd}
            sensors={sensor} //cảm biến
            onDragOver={handleDragOver}
            onDragStart={handleDragStart}
            //collisionDetection={closestCorners} //thuật toán phát hiện va chạm 
            collisionDetection={collisionDetectionStrategy} //Tự custom thuật toán va chạm
        >
            <Box sx={{
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
                width: "100%",
                height: (theme) => theme.trello.boardContentHeight,
                p: '10px 0'
            }}
            >
                <ListColumns columns={orderedColumns} createNewColumn={createNewColumn} createNewCard={createNewCard} />
                <DragOverlay dropAnimation={dropAnimation} >
                    {(!activeDragItemType) && null}
                    {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData} />}
                    {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData} />}

                </DragOverlay>
            </Box>
        </DndContext>
    );
}

export default BoardContent;