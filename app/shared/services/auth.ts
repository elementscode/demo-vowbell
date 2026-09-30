import { sql, session, redirect, AuthError, ForbiddenError } from "@elements/app";

/** The account the seed creates, shown on the sign-in page. */
export const DEMO_LOGIN = { email: "couple@vowbell.dev", password: "vowbell2026" };

/** @rpc */
export function signin(email: string, password: string) {
  let address = email.trim().toLowerCase();

  if (!address || !password) {
    throw new AuthError("Enter your email and password.");
  }

  let user = sql<{ id: string; name: string }>(
    `select id, name from users
     where email = ${address}
       and passwordHash = crypt(${password}, passwordHash)`,
  ).first();

  if (!user) {
    throw new AuthError("That email and password don't match.");
  }

  session.login({ userId: user.id, userName: user.name });
}

/** @rpc */
export function signout() {
  session.logout();
}

/** Every signed-in user is one of the couple. Guards each admin rpc. */
export function coupleOrThrow() {
  session.isLoggedInOrThrow();

  let id = session.getOrThrow("userId");

  if (sql(`select 1 from users where id = ${id}`).empty()) {
    throw new ForbiddenError("Only the couple can do that.");
  }
}

/** The route-side guard: a visitor who isn't signed in goes to /signin. */
export function coupleOrRedirect(): boolean {
  if (!session.isLoggedIn()) {
    redirect("/signin");
    return false;
  }

  coupleOrThrow();

  return true;
}
