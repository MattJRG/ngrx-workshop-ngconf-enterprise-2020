import { ActionReducerMap, createSelector, MetaReducer } from "@ngrx/store";
import * as fromAuth from "./auth.reducer";
import * as fromBooks from "./books.reducer";

export interface State {
    books: fromBooks.State;
}

export const reducers: ActionReducerMap<State> = {
    books: fromBooks.reducer
};

export const metaReducers: MetaReducer<State>[] = [];

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
