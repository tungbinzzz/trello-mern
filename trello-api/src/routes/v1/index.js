
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRouter } from './boardRoute'
import {columnRouter } from './columnRoute'
import { cardRouter } from './cardRoute'


const Router = express.Router()

Router.get('/status', (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'api v1 ' })
})

Router.use('/boards', boardRouter)

Router.use('/columns', columnRouter)

Router.use('/cards', cardRouter)


export const APIs_V1 = Router