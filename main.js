const messageInput = document.getElementById('message');
const targetOriginInput = document.getElementById('target-origin');
const sendBtn = document.getElementById('send-btn');
const resetBtn = document.getElementById('reset-btn');
const loadBtn = document.getElementById('load-btn');
const frameSrcInput = document.getElementById('frame-src');
const frameLabel = document.getElementById('frame-label');
const frameOpen = document.getElementById('frame-open');
const reloadBtn = document.getElementById('reload-btn');
const statusText = document.getElementById('status-text');
const iframe = document.getElementById('demo-frame');
const modeText = document.getElementById('mode-text');
const modeJson = document.getElementById('mode-json');

let frameReady = false;
const DEFAULT_SRC = 'receiver.html';
let currentFrameUrl = DEFAULT_SRC;

const setStatus = (text) => {
  statusText.textContent = text;
};

const loadIframe = (src) => {
  const url = (src || DEFAULT_SRC).trim() || DEFAULT_SRC;
  frameReady = false;
  currentFrameUrl = url;
  setStatus(`Loading iframe: ${url}`);
  iframe.src = url;
  frameLabel.textContent = url;
  frameOpen.href = url;
  frameSrcInput.value = url;
  try {
    const parsed = new URL(url, window.location.href);
    targetOriginInput.value = parsed.origin;
  } catch {
    // Keep existing target origin if URL cannot be parsed.
  }
};

const sendMessage = () => {
  if (!frameReady) {
    setStatus('Iframe not ready yet');
    return;
  }

  const raw = messageInput.value.trim();
  if (!raw) {
    setStatus('Type a message first');
    return;
  }

  const isJsonMode = modeJson.checked;
  let payload = raw;

  if (isJsonMode) {
    try {
      payload = JSON.parse(raw);
    } catch (err) {
      setStatus('Invalid JSON. Please fix and try again.');
      console.error('[host] JSON parse failed', err);
      return;
    }
  } else {
    payload = {
      text: raw,
      sentAt: new Date().toISOString(),
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(16).slice(2),
    };
  }

  const targetOrigin = targetOriginInput.value || '*';

  console.info('[host] sending postMessage ->', payload, 'target:', targetOrigin);
  try {
    iframe.contentWindow?.postMessage(payload, targetOrigin);
    setStatus('Message sent to iframe');
  } catch (err) {
    console.error('[host] postMessage failed', err);
    setStatus('PostMessage failed. Check target origin / iframe availability.');
  }
};

const resetIframe = () => {
  // Force reload to clear any message state within the iframe.
  frameSrcInput.value = DEFAULT_SRC;
  loadIframe(DEFAULT_SRC);
};

sendBtn.addEventListener('click', sendMessage);
resetBtn.addEventListener('click', resetIframe);
loadBtn.addEventListener('click', () => loadIframe(frameSrcInput.value));
reloadBtn.addEventListener('click', () => loadIframe(currentFrameUrl));

iframe.addEventListener('load', () => {
  frameReady = true;
  setStatus('Iframe ready');
});

iframe.addEventListener('error', () => {
  frameReady = false;
  setStatus('Iframe failed to load');
});

window.addEventListener('message', (event) => {
  // This captures the iframe's acknowledgement.
  console.info('[host] received message <-', event.data, 'from:', event.origin || 'file://');
  if (event.data && typeof event.data === 'object' && event.data.type === 'ack') {
    setStatus(`Iframe ack: ${event.data.text || 'received'}`);
  }
});

// Initial load in case the iframe was blocked or cleared.
loadIframe(frameSrcInput.value);
