(async () => {
  const area = document.querySelector('#print-area');
  const boxes = [...area.querySelectorAll('.sol-box')];
  const digest = async value => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))].map(byte => byte.toString(16).padStart(2, '0')).join('');
  const values = {
    areaText: area.innerText,
    areaContent: area.textContent,
    expTextContentLines: boxes.map(box => box.querySelector('.sol-exp')?.textContent || '').join('\n'),
    expInnerTextLines: boxes.map(box => box.querySelector('.sol-exp')?.innerText || '').join('\n'),
    answerExpTextContentLines: boxes.map(box => `${box.querySelector('.sol-ans')?.textContent || ''}\n${box.querySelector('.sol-exp')?.textContent || ''}`).join('\n'),
    boxTextContentLines: boxes.map(box => box.textContent).join('\n'),
    boxInnerTextLines: boxes.map(box => box.innerText).join('\n'),
    sourceBodies: (AppState.data || []).map(question => String(question.solution || question.explanation || question.sol || '')).join('\n'),
    sourceAnswerBodies: (AppState.data || []).map(question => `${question.answer || ''}\n${question.solution || question.explanation || question.sol || ''}`).join('\n'),
  };
  const result = {};
  for (const [name, value] of Object.entries(values)) result[name] = { sha256: await digest(value), length: value.length };
  return result;
})()
