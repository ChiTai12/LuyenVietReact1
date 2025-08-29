export async function shareLink(url, title = "Chia sẻ") {
  try {
    if (navigator.share) {
      await navigator.share({ title, url });
      return { ok: true, method: "webshare" };
    }
    await navigator.clipboard.writeText(url);
    return { ok: true, method: "clipboard" };
  } catch (e) {
    try {
      await navigator.clipboard.writeText(url);
      return { ok: true, method: "clipboard" };
    } catch (err) {
      return { ok: false, error: err };
    }
  }
}
