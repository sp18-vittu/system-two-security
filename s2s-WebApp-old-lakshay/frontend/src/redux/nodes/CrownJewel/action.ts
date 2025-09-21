import Axios from "axios"
import local from "../../../utils/local"
import { environment } from "../../../environment/environment"
import api from "../api"

export const CROWNJEWEL_POST_REQUEST = 'CROWNJEWEL_POST_REQUEST'
export const CROWNJEWEL_POST_SUCCESS = 'CROWNJEWEL_POST_SUCCESS'
export const CROWNJEWEL_POST_FAILED = 'CROWNJEWEL_POST_FAILED'
export const CROWNJEWEL_POST_RESET = 'CROWNJEWEL_POST_RESET'

export const CROWNJEWEL_DOWNLOAD_TEMPLATE_REQUEST = 'CROWNJEWEL_DOWNLOAD_TEMPLATE_REQUEST'
export const CROWNJEWEL_DOWNLOAD_TEMPLATE_SUCCESS = 'CROWNJEWEL_DOWNLOAD_TEMPLATE_SUCCESS'
export const CROWNJEWEL_DOWNLOAD_TEMPLATE_FAILED = 'CROWNJEWEL_DOWNLOAD_TEMPLATE_FAILED'
export const CROWNJEWEL_DOWNLOAD_TEMPLATE_RESET = 'CROWNJEWEL_DOWNLOAD_TEMPLATE_RESET'

export const CURRENT_CONFIG_GET_REQUEST = 'CURRENT_CONFIG_GET_REQUEST'
export const CURRENT_CONFIG_GET_SUCCESS = 'CURRENT_CONFIG_GET_SUCCESS'
export const CURRENT_CONFIG_GET_FAILED = 'CURRENT_CONFIG_GET_FAILED'
export const CURRENT_CONFIG_GET_RESET = 'CURRENT_CONFIG_GET_RESET'

export const CROWNJEWEL_PUT_REQUEST = 'CROWNJEWEL_PUT_REQUEST'
export const CROWNJEWEL_PUT_SUCCESS = 'CROWNJEWEL_PUT_SUCCESS'
export const CROWNJEWEL_PUT_FAILED = 'CROWNJEWEL_PUT_FAILED'
export const CROWNJEWEL_PUT_RESET = 'CROWNJEWEL_PUT_RESET'

export const CROWNJEWEL_ADD_SOURCE_REQUEST = 'CROWNJEWEL_ADD_SOURCE_REQUEST'
export const CROWNJEWEL_ADD_SOURCE_SUCCESS = 'CROWNJEWEL_ADD_SOURCE_SUCCESS'
export const CROWNJEWEL_ADD_SOURCE_FAILED = 'CROWNJEWEL_ADD_SOURCE_FAILED'
export const CROWNJEWEL_ADD_SOURCE_RESET = 'CROWNJEWEL_ADD_SOURCE_RESET'


export const CROWNJEWEL_DELETE_REQUEST = 'CROWNJEWEL_DELETE_REQUEST'
export const CROWNJEWEL_DELETE_SUCCESS = 'CROWNJEWEL_DELETE_SUCCESS'
export const CROWNJEWEL_DELETE_FAILED = 'CROWNJEWEL_DELETE_FAILED'
export const CROWNJEWEL_DELETE_RESET = 'CROWNJEWEL_DELETE_RESET'


export const CrownJewelPost = (postValue: any) => async (dispatch: any) => {
    const localStorage = local.getItem('bearerToken')
    const token = JSON.parse(localStorage as any)
    try {
        const { data } = await Axios.post(`${environment.baseUrl}/data/crownjewel/upload-csv`, postValue, {
            headers: { Authorization: `${token.bearerToken}`, 'Content-Type': 'multipart/form-data' },
        })
        return dispatch({ type: CROWNJEWEL_POST_SUCCESS, payload: data })
    } catch (error: any) {
        return dispatch({ type: CROWNJEWEL_POST_FAILED, payload: error.message })
    }
}

export const crouwndownloadtemplate = () => async (dispatch: any) => {
    const localStorage = local.getItem('bearerToken')
    const token = JSON.parse(localStorage as any)
    try {
        const { data } = await api.get(`/data/crownjewel/download-template`, {
            headers: { Authorization: `${token.bearerToken}` },
        })
        return dispatch({ type: CROWNJEWEL_DOWNLOAD_TEMPLATE_SUCCESS, payload: data })
    } catch (error: any) {
        return dispatch({ type: CROWNJEWEL_DOWNLOAD_TEMPLATE_FAILED, payload: error.message })
    }
}

export const currentCrownConfig = () => async (dispatch: any) => {
    const localStorage = local.getItem('bearerToken')
    const token = JSON.parse(localStorage as any)
    try {
        const { data } = await api.get(`/data/crownjewel/current-config`, {
            headers: { Authorization: `${token.bearerToken}` },
        })
        return dispatch({ type: CURRENT_CONFIG_GET_SUCCESS, payload: data })
    } catch (error: any) {
        return dispatch({ type: CURRENT_CONFIG_GET_FAILED, payload: error.message })
    }
}

export const CrownJewelAddsource = (putValue: any) => async (dispatch: any) => {
    const localStorage = local.getItem('bearerToken')
    const token = JSON.parse(localStorage as any)
    try {
        const { data } = await Axios.post(`${environment.baseUrl}/data/crownjewel/add-source`, putValue, {
            headers: { Authorization: `${token.bearerToken}` },
        })
        return dispatch({ type: CROWNJEWEL_ADD_SOURCE_SUCCESS, payload: data })
    } catch (error: any) {
        return dispatch({ type: CROWNJEWEL_ADD_SOURCE_FAILED, payload: error.message })
    }
}

export const CrownJewelUpdate = (putValue: any, id: any) => async (dispatch: any) => {
    const localStorage = local.getItem('bearerToken')
    const token = JSON.parse(localStorage as any)
    try {
        const { data } = await Axios.put(`${environment.baseUrl}/data/crownjewel/${id}`, putValue, {
            headers: { Authorization: `${token.bearerToken}` },
        })
        return dispatch({ type: CROWNJEWEL_PUT_SUCCESS, payload: data })
    } catch (error: any) {
        return dispatch({ type: CROWNJEWEL_PUT_FAILED, payload: error.message })
    }
}

export const CrownJewelDelete = (sourceid: any) => async (dispatch: any) => {
    const localStorage = local.getItem('bearerToken')
    const token = JSON.parse(localStorage as any)
    try {
        const { data } = await Axios.delete(`${environment.baseUrl}/data/crownjewel/${sourceid}`, {
            headers: { Authorization: `${token.bearerToken}` },
        })
        return dispatch({ type: CROWNJEWEL_DELETE_SUCCESS, payload: data })
    } catch (error: any) {
        return dispatch({ type: CROWNJEWEL_DELETE_FAILED, payload: error.message })
    }
}
