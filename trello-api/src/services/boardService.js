/* eslint-disable no-useless-catch */

import { slugify } from '~/utils/fomatters'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'

const createNew = async (reqBody) => {
    try {
        const newBoard = {
            ...reqBody,
            slug: slugify(reqBody.title)
        }
        const createdBoard = await boardModel.createNew(newBoard)
        // console.log("🚀 ~ createNew ~ createdBoard:", createdBoard)
        const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)
        // console.log("🚀 ~ createNew ~ getNewBoard:", getNewBoard)
        return getNewBoard
    } catch (error) {
        throw error
    }
}

const getDetail = async (boardId) => {
    try {
        const board = await boardModel.getDetail(boardId)
        if (!board) {
            throw new ApiError(StatusCodes.NOT_FOUND)
        }

        const resBoard = cloneDeep(board)
        resBoard.columns.forEach(column => {
            column.cards = resBoard.cards.filter(card => card.columnId.toString() === column._id.toString())
        })
        delete resBoard.cards

        return resBoard
    } catch (error) {
        throw error
    }
}

const update = async (boardId, reqBody) => {
    try {
        const updateData = {
            ...reqBody,
            updatedAt: Date.now()
        }
        const updatedBoard = await boardModel.update(boardId, updateData)
        return updatedBoard
    } catch (error) {
        throw error
    }
}

export const boardService = {
    createNew,
    getDetail,
    update
}