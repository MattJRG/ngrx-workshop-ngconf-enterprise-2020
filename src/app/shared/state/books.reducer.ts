import { createReducer, on, Action, createSelector } from "@ngrx/store";
import { BookModel, calculateBooksGrossEarnings } from "src/app/shared/models";
import { BooksPageActions, BooksApiActions } from "src/app/books/actions";

// Helper functions
const createBook = (books: BookModel[], book: BookModel) => [...books, book];
// Copy array but if id is the one with changes we copy that books data but adds the changes we have
const updateBook = (books: BookModel[], changes: BookModel) =>
    books.map(book => {
        return book.id === changes.id ? Object.assign({}, book, changes) : book;
    });
const deleteBook = (books: BookModel[], bookId: string) =>
    books.filter(book => bookId !== book.id);
// End of helper functions

export interface State {
    collection: BookModel[];
    activeBookId: string | null;
}

export const initialState: State = {
    collection: [],
    activeBookId: null
};

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
            activeBookId: action.bookId
        };
    }),
    // Pull #5
    // When books are initially loaded we set the collection to be the array of books
    on(BooksApiActions.booksLoaded, (state, action) => {
        return {
            ...state,
            collection: action.books
        };
    }),
    on(BooksApiActions.bookCreated, (state, action) => {
        return {
            ...state,
            collection: createBook(state.collection, action.book),
        };
    }),
    on(BooksApiActions.bookUpdated, (state, action) => {
        return {
            ...state,
            collection: updateBook(state.collection, action.book),
        };
    }),
    on(BooksApiActions.bookDeleted, (state, action) => {
        return {
            ...state,
            collection: deleteBook(state.collection, action.bookId)
        };
    })
);

export function reducer(state: State | undefined, action: Action) {
    return booksReducer(state, action);
}

// Pull #6 - Selectors
// Getter selectors
export const selectAll = (state: State) => state.collection;
export const selectActiveBookId = (state: State) => state.activeBookId;
// Complex selectors - createSelector allows us to pass in other selectors
export const selectActiveBook = createSelector(
    selectAll,
    selectActiveBookId,
    // Projector function to return the data you want
    (books, activeBookId) => books.find(book => book.id === activeBookId) || null
);
export const selectEarningsTotals = createSelector(
    selectAll,
    calculateBooksGrossEarnings,
    // Short for ...
    // (books) => calculateBooksGrossEarnings(books)
);
