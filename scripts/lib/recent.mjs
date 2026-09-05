export const limitRecent = (entries, next, limit = 12) =>
  [next, ...entries.filter((x) => x.substanceId !== next.substanceId)]
    .sort((a, b) => b.viewedAt - a.viewedAt)
    .slice(0, limit);
export const decodeRecent = (raw) => {
  try {
    const x = JSON.parse(raw);
    return Array.isArray(x)
      ? x
          .filter((v) => v && typeof v.substanceId === 'string' && Number.isFinite(v.viewedAt))
          .sort((a, b) => b.viewedAt - a.viewedAt)
      : [];
  } catch {
    return [];
  }
};
