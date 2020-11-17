export function authenticateSession(user, session):void {
  session.user = {
    username: user.username
  }
}