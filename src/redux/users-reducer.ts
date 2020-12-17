import {InferActionsTypes, BaseThunkType} from './redux-store';
import {Dispatch} from 'redux';

import {updateObjectArray} from '../utils/objectHelpers';
import {UserType} from '../types/types';

import {usersAPI} from '../api/users-api';
import {APIResponseType} from "../api/api";


let initialState = {
    users: [] as Array<UserType>,
    pageSize: 50,
    totalUsersCount: 0,
    currentPage: 1,
    isFetching: false,
    followingInProgress: [] as Array<number>, // array of users ids
    filter: {
        term: "",
        friend: null as null | boolean
    }
};
console.log("-> initialState", initialState.users);

const usersReducer = (state = initialState, action: ActionsTypes): initialStateType => {
    switch (action.type) {
        case 'FOLLOW':
            return {
                ...state,
                users: updateObjectArray(state.users, action.userId, "id",{followed: true})
            };
        case 'UN_FOLLOW':
            return {
                ...state,
                users: updateObjectArray(state.users, action.userId, "id",{followed: false})
            };
        case 'SET_USERS':
            return {
                ...state, users: action.users
            };
        case 'SET_CURRENT_PAGE':
            return {
                ...state, currentPage: action.currentPage
            };
        case 'SET_USERS_TOTAL_COUNT':
            return {
                ...state, totalUsersCount: action.count
            };
        case 'TOGGLE_IS_FETCHING':
            return {
                ...state, isFetching: action.isFetching
            };
        case 'SET_FILTER':
            return {
                ...state, filter: action.payload
            };
        case 'TOGGLE_IS_FOLLOWING_PROGRESS':
            return {
                ...state,
                followingInProgress: action.isFetching
                    ? [...state.followingInProgress, action.userId]
                    : state.followingInProgress.filter(id => id !== action.userId)
            };
        default:
            return state;
    }
};

export const actions = {
    followSuccess: (userId: number) => ({
        type: 'FOLLOW', userId
    } as const),
    unFollowSuccess: (userId: number) => ({
        type: 'UN_FOLLOW', userId
    } as const),

    setUsers: (users: Array<UserType>) => ({
        type: 'SET_USERS', users
    } as const),
    setCurrentPage: (currentPage: number) => ({
        type: 'SET_CURRENT_PAGE', currentPage
    } as const),
    setTotalUsersCount: (totalUsersCount: number) => ({
        type: 'SET_USERS_TOTAL_COUNT', count: totalUsersCount
    } as const),
    toggleIsFetching: (isFetching: boolean) => ({
        type: 'TOGGLE_IS_FETCHING', isFetching
    } as const),
    toggleIsFollowingProgress: (isFetching: boolean, userId: number) => ({
        type: 'TOGGLE_IS_FOLLOWING_PROGRESS', isFetching, userId
    } as const),
    setFilter: (filter: FilterType) => ({
        type: 'SET_FILTER', payload: filter
    } as const)
}

export const requestUsers = (page: number,
                             pageSize: number, filter: FilterType): ThunkType => {
    return async (dispatch, getState) => {
        dispatch(actions.toggleIsFetching(true));
        dispatch(actions.setCurrentPage(page));
        dispatch(actions.setFilter(filter));

        let data = await usersAPI.getUsers(page, pageSize, filter.term, filter.friend);
        dispatch(actions.toggleIsFetching(false));
        dispatch(actions.setUsers(data.items));
        dispatch(actions.setTotalUsersCount(data.totalCount));
    }
};

const _followUnfollowFlow = async (dispatch: Dispatch<ActionsTypes>, userId: number, apiMethod: (userId: number) => Promise<APIResponseType>, actionCreator: (userId: number) => ActionsTypes) => {
    dispatch(actions.toggleIsFollowingProgress(true, userId));
    let response = await apiMethod(userId)
    if (response.resultCode === 0) {
        dispatch(actionCreator(userId))
    }
    dispatch(actions.toggleIsFollowingProgress(false, userId));
}


export const follow = (userId: number): ThunkType => {
    return async (dispatch) => {
        // @ts-ignore
        await _followUnfollowFlow(dispatch, userId, usersAPI.follow.bind(usersAPI), actions.followSuccess);

    }
};
export const unFollow = (userId: number): ThunkType => {
    return async (dispatch) => {
        // @ts-ignore
        await _followUnfollowFlow(dispatch, userId, usersAPI.unFollow.bind(usersAPI), actions.unFollowSuccess);
    }
};
export default usersReducer;

export type initialStateType = typeof initialState
export type FilterType = typeof initialState.filter
type ActionsTypes = InferActionsTypes<typeof actions>
type ThunkType = BaseThunkType<ActionsTypes>
