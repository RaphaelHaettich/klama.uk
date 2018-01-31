import { combineReducers } from "redux";
import pluralize from "pluralize";
import changeCase from "change-case";

export const createAllIds = (
	name,
	uniqueProperty = "id",
	customCases = null
) => (state = [], action) => {
	switch (action.type) {
		case "FETCH_" + changeCase.snakeCase(name).toUpperCase():
			return action.itemId
				? !action.isFetching && action.item && !action.status
					? state.includes(action.itemId) ? state : [...state, action.itemId]
					: state.filter(item => item[uniqueProperty] !== action.itemId)
				: state;

		case "FETCH_" + changeCase.snakeCase(pluralize(name)).toUpperCase():
			return action.items
				? !action.isFetching && !action.status
					? [
							...state,
							...action.items
								.map(item => item[uniqueProperty])
								.filter(id => !state.includes(id))
						]
					: state.filter(item => !action.items.includes(item[uniqueProperty]))
				: state;
		case "CREATE_" + changeCase.snakeCase(name).toUpperCase():
			return action.item
				? !action.isFetching && action.item && !action.status
					? state.includes(action.item[uniqueProperty])
						? state
						: [...state, action.item[uniqueProperty]]
					: state.filter(
							item => item[uniqueProperty] !== action.item[uniqueProperty]
						)
				: state;
		default:
			if (customCases) {
				return customCases(state, action);
			}
			return state;
	}
};

export const createById = (name, uniqueProperty = "id", customCases = null) => (
	state = {},
	action
) => {
	switch (action.type) {
		case "FETCH_" + changeCase.snakeCase(name).toUpperCase():
			return {
				...state,
				[action.itemId]: {
					...action.item,
					_isFetching: action.isFetching,
					_status: action.status
				}
			};
		case "FETCH_" + changeCase.snakeCase(pluralize(name)).toUpperCase():
			return action.isFetching || action.status || !action.items
				? state
				: {
						...state,
						...action.items.reduce((object, item) => {
							object[item[uniqueProperty]] = {
								...item,
								_isFetching: action.isFetching,
								_status: action.status
							};
							return object;
						}, {})
					};
		case "CREATE_" + changeCase.snakeCase(name).toUpperCase():
			return action.isFetching
				? state
				: {
						...state,
						[action.item[uniqueProperty]]: {
							...action.item,
							_isFetching: action.isFetching,
							_status: action.status
						}
					};
		default:
			if (customCases) {
				return customCases(state, action);
			}
			return state;
	}
};

/**
 * Creates a normalized reducer
 * @param {string} name The item name used for the actions
 * @return {function} The reducer
 */
export const createReducer = (name, uniqueProperty = "id") =>
	combineReducers({
		byId: createById(name, uniqueProperty),
		allIds: createAllIds(name, uniqueProperty)
	});

/**
 * Gets a single item based on its id
 * @param {object} state The correct part of the redux state
 * @param {number} itemId The items id to look for
 * @return {object} The item
 */
export const getItemById = (state, itemId) => state.byId[itemId];

/**
 * Gets all items
 * @param {object} state The correct part of the redux state
 * @return {array} All items
 */
export const getAllItems = state => state.allIds.map(id => state.byId[id]);

/**
 * Wraps a function, useful for redux getters
 * @param {function} target The function to wrap
 * @param {function} mapState Maps the state to the part that should be passed
 * @return {function} The wrapped function
 */
export const wrap = (target, mapState) => (...args) =>
	target(mapState(args[0]), ...args.slice(1));
