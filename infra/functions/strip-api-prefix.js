function handler(event) {
    event.request.uri = event.request.uri.replace(/^\/api/, '') || '/';
    return event.request;
}
