export function completedTurnFor(notifications, threadId, turnId) {
  return notifications.find(message => (
    message.method === 'turn/completed'
    && message.params?.threadId === threadId
    && message.params?.turn?.id === turnId
  )) || null;
}

export function withTimeout(promise, timeoutMs, code) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(code)), timeoutMs);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

export function classifyAppServerMessage(message, pending) {
  if (typeof message?.method === 'string') return 'notification';
  if (message?.id !== undefined && pending?.has(String(message.id))) return 'response';
  return 'orphan';
}

export function summarizeAppServerMessage(message, route, sequence) {
  const params = message?.params || {};
  const turn = params.turn || {};
  const item = params.item || {};
  return {
    sequence,
    route,
    method: message?.method || null,
    hasId: message?.id !== undefined,
    idType: message?.id === undefined ? null : typeof message.id,
    topLevelKeys: Object.keys(message || {}).sort(),
    paramKeys: Object.keys(params).sort(),
    threadId: params.threadId || null,
    turnId: params.turnId || turn.id || null,
    turnStatus: turn.status || null,
    itemId: params.itemId || item.id || null,
    itemType: item.type || null,
    deltaLength: typeof params.delta === 'string' ? params.delta.length : null,
    responseKeys: message?.result && typeof message.result === 'object' ? Object.keys(message.result).sort() : null,
    error: message?.error ? String(message.error.message || message.error.code || 'RPC_ERROR') : null,
  };
}

export function completedTurnText(notifications, threadId, turnId) {
  const deltaText = notifications
    .filter(message => (
      message.method === 'item/agentMessage/delta'
      && message.params?.threadId === threadId
      && message.params?.turnId === turnId
    ))
    .map(message => message.params?.delta || '')
    .join('');
  if (deltaText) return deltaText;
  const completed = completedTurnFor(notifications, threadId, turnId);
  const items = completed?.params?.turn?.items || [];
  return items
    .filter(item => item?.type === 'agentMessage' || item?.type === 'message')
    .map(item => {
      if (typeof item.text === 'string') return item.text;
      if (Array.isArray(item.content)) return item.content.map(content => content?.text || '').join('');
      return '';
    })
    .join('');
}

export function completedTurnFromThreadRead(response, threadId, turnId) {
  if (response?.thread?.id && response.thread.id !== threadId) return null;
  return (response?.thread?.turns || [])
    .find(turn => turn?.id === turnId && ['completed', 'failed', 'interrupted'].includes(turn.status)) || null;
}

export function completedTurnFromTurnsList(response, turnId) {
  return (response?.data || [])
    .find(turn => turn?.id === turnId && ['completed', 'failed', 'interrupted'].includes(turn.status)) || null;
}

export function parseAuditorOutputText(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start < 0 || end <= start) return null;
  try {
    const output = JSON.parse(text.slice(start, end + 1));
    return output && !Array.isArray(output) && Array.isArray(output.evidence) && Array.isArray(output.defects) ? output : null;
  } catch {
    return null;
  }
}
