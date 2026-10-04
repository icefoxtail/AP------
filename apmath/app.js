window.onload = async () => {
    await loadData(true);
    if (navigator.onLine) await processSyncQueue();
};