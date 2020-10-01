import user from "@/plugins/jwt/user";

/*
|--------------------------------------------------------------------------
| Mutation Types
|--------------------------------------------------------------------------
*/
export const SET_USER = 'SET_USER';
export const UNSET_USER = 'UNSET_USER';

/*
|--------------------------------------------------------------------------
| Initial State
|--------------------------------------------------------------------------
*/
const state = {
	user: {
		id: null,
		firstname: null,
		lastname: null,
		email: null,
		admin: null,
		photo: null,
	}
};

/*
|--------------------------------------------------------------------------
| Mutations
|--------------------------------------------------------------------------
*/
const mutations = {
	[SET_USER](state, payload) {
		state.user.id = payload.user.id;
		state.user.firstname = payload.user.firstname;
		state.user.lastname = payload.user.lastname;
		state.user.email = payload.user.email;
		state.user.admin = payload.user.admin;
		state.user.photo = payload.user.photo;
	},
	[UNSET_USER](state, payload) {
		state.user.id = null;
		state.user.firstname = null;
		state.user.lastname = null;
		state.user.email = null;
		state.user.admin = null;
		state.user.photo = null;
	},
};

/*
|--------------------------------------------------------------------------
| Actions
|--------------------------------------------------------------------------
*/
const actions = {
	setAuthUser: (context, user) => {
		context.commit(SET_USER, {user})
	},
	unsetAuthUser: (context) => {
		context.commit(UNSET_USER)
	}
};

/*
|--------------------------------------------------------------------------
| Getters
|--------------------------------------------------------------------------
*/
const getters = {
	isLoggedIn: (state) => {
		return !!(state.user.firstname && state.user.email);
	},
	getUser: (state) => {
		return (state.user);
	},
	whoami: (state) => {
		return state.user.id;
	},

};

/*
|--------------------------------------------------------------------------
| Export the module
|--------------------------------------------------------------------------
*/
export default {
	state,
	mutations,
	actions,
	getters
}