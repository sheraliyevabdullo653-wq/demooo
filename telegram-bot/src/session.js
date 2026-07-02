import { getSession, saveSession } from './db.js';

export function sessionMiddleware() {
  return async (ctx, next) => {
    if (!ctx.from) return next();
    
    const telegramId = ctx.from.id.toString();
    
    // Load session from db
    const sessionData = await getSession(telegramId);
    ctx.session = sessionData.data;
    ctx.sessionState = sessionData.state;
    
    // Attach helper to update state
    ctx.setSessionState = async (state, data = {}) => {
      ctx.session = { ...ctx.session, ...data };
      ctx.sessionState = state;
      await saveSession(telegramId, state, ctx.session);
    };
    
    await next();
  };
}
export default sessionMiddleware;
