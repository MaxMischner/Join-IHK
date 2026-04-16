/** @type {Array<{name:string, type:string, size:number, data:string}>} */
let viewerAttachments = [];

/** @type {number} Currently displayed image index inside the viewer. */
let viewerIndex = 0;

/**
 * Builds the inner HTML structure for the image viewer modal.
 * Includes header with metadata, navigation buttons, and the image element.
 * @returns {string} HTML string for the full viewer modal content.
 */
function buildViewerHTML() {
  return `
    <div class="image-viewer-backdrop" onclick="closeImageViewer()"></div>
    <div class="image-viewer-modal" role="dialog" aria-modal="true" aria-label="Image viewer">
      <div class="image-viewer-header">
        <div class="viewer-file-info">
          <span id="viewerName" class="viewer-filename"></span>
          <span id="viewerMeta" class="viewer-meta"></span>
        </div>
        <div class="viewer-actions">
          <span id="viewerCounter" class="viewer-counter"></span>
          <button onclick="downloadCurrentImage()" class="viewer-btn"
                  aria-label="Download current image" type="button">⬇</button>
          <button onclick="closeImageViewer()" class="viewer-btn viewer-close-btn"
                  aria-label="Close image viewer" type="button">✕</button>
        </div>
      </div>
      <div class="image-viewer-body">
        <button id="viewerPrev" onclick="navigateViewer(-1)" class="viewer-nav viewer-prev"
                aria-label="Previous image" type="button">‹</button>
        <img id="viewerImg" class="viewer-image" src="" alt="">
        <button id="viewerNext" onclick="navigateViewer(1)" class="viewer-nav viewer-next"
                aria-label="Next image" type="button">›</button>
      </div>
    </div>
  `;
}

/**
 * Creates and injects the image viewer modal into the document body if absent.
 * Idempotent — safe to call multiple times; only one viewer is ever created.
 */
function ensureViewerExists() {
  if (document.getElementById('imageViewer')) return;
  const viewer = document.createElement('div');
  viewer.id = 'imageViewer';
  viewer.className = 'image-viewer-overlay d-none';
  viewer.innerHTML = buildViewerHTML();
  document.body.appendChild(viewer);
}

/**
 * Updates the disabled state of the previous and next navigation buttons
 * based on the current viewer index and total number of images.
 */
function updateViewerNavButtons() {
  const prevBtn = document.getElementById('viewerPrev');
  const nextBtn = document.getElementById('viewerNext');
  if (prevBtn) prevBtn.disabled = viewerIndex === 0;
  if (nextBtn) nextBtn.disabled = viewerIndex === viewerAttachments.length - 1;
}

/**
 * Renders the currently selected image and its metadata into the viewer UI.
 * Updates filename, type/size info, counter label, and nav button states.
 */
function renderViewerContent() {
  const a = viewerAttachments[viewerIndex];
  document.getElementById('viewerImg').src = a.data;
  document.getElementById('viewerImg').alt = a.name;
  document.getElementById('viewerName').textContent = a.name;
  document.getElementById('viewerMeta').textContent =
    `${a.type.split('/')[1].toUpperCase()} · ${formatFileSize(a.size)}`;
  document.getElementById('viewerCounter').textContent =
    `${viewerIndex + 1} / ${viewerAttachments.length}`;
  updateViewerNavButtons();
}

/**
 * Opens the image viewer modal showing the specified image from an array.
 * Creates the viewer DOM element if it does not yet exist.
 * @param {Array<{name:string, type:string, size:number, data:string}>} imgs - Images to browse.
 * @param {number} startIndex - Index of the image to display first.
 */
function openImageViewer(imgs, startIndex) {
  ensureViewerExists();
  viewerAttachments = imgs;
  viewerIndex = startIndex;
  const viewer = document.getElementById('imageViewer');
  viewer.classList.remove('d-none');
  renderViewerContent();
}

/**
 * Navigates to an adjacent image in the viewer by a relative direction.
 * Does nothing if the resulting index would be out of bounds.
 * @param {number} direction - -1 to go to previous image, 1 to go to next.
 */
function navigateViewer(direction) {
  const newIndex = viewerIndex + direction;
  if (newIndex < 0 || newIndex >= viewerAttachments.length) return;
  viewerIndex = newIndex;
  renderViewerContent();
}

/**
 * Closes the image viewer modal and resets all viewer state to defaults.
 */
function closeImageViewer() {
  const viewer = document.getElementById('imageViewer');
  if (viewer) {
    if (viewer.contains(document.activeElement)) document.activeElement.blur();
    viewer.classList.add('d-none');
  }
  viewerAttachments = [];
  viewerIndex = 0;
}

/**
 * Downloads the image currently displayed in the viewer via a temporary anchor.
 */
function downloadCurrentImage() {
  downloadAttachment(viewerAttachments[viewerIndex]);
}

/**
 * Triggers a browser file download for the given attachment object.
 * Creates a temporary <a> element, clicks it programmatically, then removes it.
 * @param {{name:string, data:string}} attachment - The attachment to download.
 */
function downloadAttachment(attachment) {
  const link = document.createElement('a');
  link.href = attachment.data;
  link.download = attachment.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
