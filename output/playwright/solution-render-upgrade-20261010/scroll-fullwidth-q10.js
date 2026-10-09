(() => {
  const box = [...document.querySelectorAll('.sol-box')].find(item => String(item.dataset.sourceRef || '').endsWith('#ordinal:10'));
  if (box) box.closest('.page')?.scrollIntoView({ block: 'center' });
  return { found: Boolean(box), pageNo: box ? [...document.querySelectorAll('#print-area .page')].indexOf(box.closest('.page')) + 1 : null };
})()
