import {Action, ActionReducer, ActionReducerMap, createSelector, MetaReducer} from "@ngrx/store";
import * as fromAuth from "./auth.reducer";
import * as fromBooks from "./books.reducer";
import {BooksPageActions} from "../../books/actions";
import {logoutMetareducer} from "./logout.metareducer";
import {logout} from "../../auth/actions/auth-user.actions";

export interface State {
    auth: fromAuth.State;
    books: fromBooks.State;
}

export const reducers: ActionReducerMap<State> = {
    auth: fromAuth.reducer,
    books: fromBooks.reducer,
};

// Example meta reducers
// export function loggerMetaReducer(reducer: ActionReducer<any>) {
//     return function (state: any, action: Action) {
//         console.log("Previous State:", state);
//         console.log("Action", action);
//
//         const nextState = reducer(state, action);
//
//         console.log("Next state", nextState);
//
//         return nextState;
//     };
// }
//
// export function resetStateMetaReducer(reducer: ActionReducer<any>) {
//     return function (state: any, action: Action) {
//         if (action.type === BooksPageActions.enter.type) {
//             return reducer(undefined, action);
//         }
//
//         return reducer(state, action);
//     };
// }



export const metaReducers: MetaReducer<State>[] = [logoutMetareducer];

/**
 * Lifting books selectors So they can be used globally *
 **/
// Getter selector to get the books state
export const selectBooksState = (state: State) => state.books;
// Complex selectors
export const selectAllBooks = createSelector(
    selectBooksState,
    fromBooks.selectAll
);
export const selectActiveBook = createSelector(
    selectBooksState,
    fromBooks.selectActiveBook
);
export const selectBooksEarningsTotals = createSelector(
    selectBooksState,
    fromBooks.selectEarningsTotals
);

// Just for fun
// export const selectCheeseNoIndex = createSelector(
//   selectBooksState,
//   fromBooks.selectCheeseNo
// );

/**
 * Lifting auth selectors So they can be used globally *
 **/
// Getter selectors
export const selectAuthState = (state: State) => state.auth;
// Complex Selectors
export const selectGettingAuthStatus = createSelector(
  selectAuthState,
  fromAuth.selectGettingStatus
);
export const selectGettingAuthUser = createSelector(
  selectAuthState,
  fromAuth.selectUser
);
export const selectGettingAuthError = createSelector(
  selectAuthState,
  fromAuth.selectError
);
