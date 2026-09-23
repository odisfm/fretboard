function handler(event) {
    var uri = event.request.uri;
    // No file extension in the last segment means it's an SPA route, not an asset.
    if (!/\.[^\/]+$/.test(uri)) {
        event.request.uri = '/index.html';
    }
    return event.request;
}
