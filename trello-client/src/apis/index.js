import axios from "axios";
import { API_ROOT } from "~/utils/constants";

export const fetchBoardDetailAPI = async (boardId) => {
    const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
    // Axios sẽ trả về kết quả qua property của nó là data
    return response.data
}

export const updateBoardDetailAPI = async (boardId, updateData) => {
    const response = await axios.put(`${API_ROOT}/v1/boards/${boardId}`,updateData)
    // Axios sẽ trả về kết quả qua property của nó là data
    return response.data
}

export const createNewColumnAPI = async (newColumnData) => {
    const response = await axios.post(`${API_ROOT}/v1/columns`,newColumnData)
    // Axios sẽ trả về kết quả qua property của nó là data
    return response.data
}

export const updateColumnDetailAPI = async (columnId, updateData) => {
    const response = await axios.put(`${API_ROOT}/v1/columns/${columnId}`,updateData)
    // Axios sẽ trả về kết quả qua property của nó là data
    return response.data
}

export const createNewCardAPI = async (newCardData) => {
    const response = await axios.post(`${API_ROOT}/v1/cards`,newCardData)
    // Axios sẽ trả về kết quả qua property của nó là data
    return response.data
}

