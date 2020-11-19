import { Injectable } from "@angular/core";
import { createEffect, Actions, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import {concatMap, catchError, tap, map} from "rxjs/operators";
import { AuthService } from "../shared/services/auth.service";
import { AuthApiActions, AuthUserActions } from "./actions";
import {BooksApiActions, BooksPageActions} from "../books/actions";

@Injectable()

export class AuthEffects {

  constructor(private actions$: Actions, private auth: AuthService) {}

  // Effects dont need to rely on an action this one will load once the AuthEffects is loaded
  getAuthStatus$ = createEffect(() =>
    this.auth
      .getStatus()
      .pipe(map(userOrNull =>
      AuthApiActions.getAuthStatusSuccess(userOrNull)))
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthUserActions.login),
      concatMap(action => {
        return this.auth.login(action.username, action.password).pipe(
          map(user => AuthApiActions.loginSuccess(user)),
          catchError(reason => of(AuthApiActions.loginFailure(reason)))
        );
      })
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthUserActions.logout),
      tap(() => this.auth.logout())
    ),
    { dispatch: false }
  );

}
