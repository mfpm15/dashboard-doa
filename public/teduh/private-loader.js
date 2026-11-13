/* Importing a user's original offline file takes place entirely in their browser. */
(() => {
  try {
    const json = localStorage.getItem('doa-teduh-local-v34');
    if (!json) return;
    const parsed = JSON.parse(json);
    if (parsed.data && Array.isArray(parsed.data.chapters) && parsed.data.chapters.length === 13) {
      window.DOA_DATA = parsed.data;
      if (parsed.extras && Array.isArray(parsed.extras.items)) window.DOA_EXTRAS = parsed.extras;
    }
  } catch (error) {
    console.warn('Local prayer library could not be loaded; using public dataset.',error);
  }
})();
