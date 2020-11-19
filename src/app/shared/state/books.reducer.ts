import { createReducer, on, Action, createSelector } from "@ngrx/store";
import { BookModel, calculateBooksGrossEarnings } from "src/app/shared/models";
import { BooksPageActions, BooksApiActions } from "src/app/books/actions";
import {createEntityAdapter, EntityState} from "@ngrx/entity";

export interface State extends EntityState<BookModel> {
    activeBookId: string | null;
}

export const adapter = createEntityAdapter<BookModel>({
    // Can use if the data id isn't just "id" e.g. "key" or "_id"
    selectId: book => book.id,
    // Can use the adapter to sort the collection
    sortComparer: (bookA, bookB) => bookA.name.localeCompare(bookB.name)
});

export const initialState: State = adapter.getInitialState({
    activeBookId: null,
});

export const booksReducer = createReducer(
    initialState,
    on(BooksPageActions.clearSelectedBook, BooksPageActions.enter, state => {
        return {
            ...state,
            activeBookId: null
        };
    }),
    on(BooksPageActions.selectBook, (state, action) => {
        return {
            ...state,
            activeBookId: action.bookId,
        };
    }),
    // Pull #5
    // When books are initially loaded we set the collection to be the array of books
    on(BooksApiActions.booksLoaded, (state, action) => {
        return adapter.setAll(action.books, state);
    }),
    on(BooksApiActions.bookCreated, (state, action) => {
        // Also have upsertOne method to add if it's not there or update if it is
        return adapter.addOne(action.book, {
            ...state,
            activeBookId: null,
        });
    }),
    on(BooksApiActions.bookUpdated, (state, action) => {
        return adapter.updateOne({id: action.book.id, changes: action.book},
          {
                ...state,
                activeBookId: null,
            });
    }),
    on(BooksApiActions.bookDeleted, (state, action) => {
        return adapter.removeOne(action.bookId, state);
    }),
);

export function reducer(state: State | undefined, action: Action) {
    return booksReducer(state, action);
}

// Pull #6 - Selectors
// Getter selectors
export const { selectAll, selectEntities } = adapter.getSelectors();
export const selectActiveBookId = (state: State) => state.activeBookId;

// Complex selectors - createSelector allows us to pass in other selectors
export const selectActiveBook = createSelector(
    selectEntities,
    selectActiveBookId,
    (booksEntities, activeBookId) => {
        return activeBookId ? booksEntities[activeBookId]! : null;
    }
);

// export const selectCheeseNo = (state: State) => state.cheeseNo;

export const selectEarningsTotals = createSelector(
    selectAll,
    calculateBooksGrossEarnings,
);
