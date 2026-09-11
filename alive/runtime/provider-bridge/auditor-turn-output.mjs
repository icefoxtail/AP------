export function completedTurnFor(notifications, threadId, turnId) {
  return notifications.find(message => (
    message.method === 'turn/completed'
    && message.params?.threadId === threadId
    && message.params?.turn?.id === turnId
  )) || null;
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
