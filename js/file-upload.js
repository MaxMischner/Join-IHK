/** @type {Array<{name:string, type:string, size:number, data:string}>} */
let attachments = [];

/** @type {string[]} Allowed MIME types for image uploads. */
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/** @type {number} Maximum total attachment size per task in bytes (1 MB). */
const MAX_TOTAL_BYTES = 1024 * 1024;

/**
 * Checks whether a file's declared MIME type is in the allowed list.
 * @param {File} file - The file to check.
 * @returns {boolean} True if the MIME type is permitted.
 */
function isAllowedMimeType(file) {
  return ALLOWED_TYPES.includes(file.type);
}

/**
 * Reads the first 12 bytes of a file as a Uint8Array for magic byte verification.
 * This prevents filetype spoofing via renamed extensions.
 * @param {File} file - The file to inspect.
 * @returns {Promise<Uint8Array>} Resolves with the first 12 bytes.
 */
function readMagicBytes(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(new Uint8Array(e.target.result));
    reader.onerror = reject;
    reader.readAsArrayBuffer(file.slice(0, 12));
  });
}

/**
 * Verifies that the magic bytes of a file match its declared MIME type.
 * Supports JPEG (FF D8 FF), PNG (89 50 4E 47), and WebP (RIFF....WEBP).
 * @param {Uint8Array} b - The first 12 bytes of the file.
 * @param {string} mime - The declared MIME type of the file.
 * @returns {boolean} True if bytes match the expected signature.
 */
function isValidMagicBytes(b, mime) {
  const isJpeg = b[0] === 0xFF && b[1] === 0xD8 && b[2] === 0xFF;
  const isPng  = b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47;
  const isWebP = b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46
              && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50;
  if (mime === 'image/jpeg') return isJpeg;
  if (mime === 'image/png')  return isPng;
  if (mime === 'image/webp') return isWebP;
  return false;
}

/**
 * Validates a file's type using both MIME type whitelist and magic byte inspection.
 * Double-layer check prevents extension spoofing attacks.
 * @param {File} file - The file to validate.
 * @returns {Promise<boolean>} True if the file is a valid, safe image type.
 */
async function validateFileType(file) {
  if (!isAllowedMimeType(file)) return false;
  const bytes = await readMagicBytes(file);
  return isValidMagicBytes(bytes, file.type);
}

/**
 * Checks whether adding the given files stays within the 1 MB total size limit.
 * Counts both existing and newly selected attachments.
 * @param {FileList} newFiles - The files the user is attempting to add.
 * @returns {boolean} True if the combined total stays within the limit.
 */
function isWithinSizeLimit(newFiles) {
  const existingSize = attachments.reduce((sum, a) => sum + a.size, 0);
  const newSize = Array.from(newFiles).reduce((sum, f) => sum + f.size, 0);
  return existingSize + newSize <= MAX_TOTAL_BYTES;
}

/**
 * Creates a canvas element with the image drawn at max 800×800 pixels.
 * Scaling preserves aspect ratio. Canvas re-encoding strips embedded payloads.
 * @param {HTMLImageElement} img - The loaded source image element.
 * @returns {HTMLCanvasElement} Canvas with the scaled image drawn on it.
 */
function createCompressCanvas(img) {
  const MAX = 800;
  let { width, height } = img;
  if (width > MAX || height > MAX) {
    const ratio = Math.min(MAX / width, MAX / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d').drawImage(img, 0, 0, width, height);
  return canvas;
}

/**
 * Compresses an image file to max 800×800 px via canvas re-encoding (quality 0.85).
 * Canvas rendering also strips any embedded scripts or metadata.
 * @param {File} file - The image file to compress.
 * @returns {Promise<Blob>} Resolves with the compressed image as a Blob.
 */
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      createCompressCanvas(img).toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error('Compression failed')),
        file.type, 0.85
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image load failed')); };
    img.src = url;
  });
}

/**
 * Converts a Blob to a base64-encoded data URL string using FileReader.
 * @param {Blob} blob - The blob to convert.
 * @returns {Promise<string>} Resolves with the full base64 data URL.
 */
function convertBlobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Sanitizes a filename by removing special characters and limiting its length.
 * Prevents path traversal (../) and injection via crafted filenames.
 * @param {string} name - The raw filename from the File object.
 * @returns {string} A safe, trimmed filename string (max 100 chars).
 */
function sanitizeFilename(name) {
  return name
    .replace(/[^a-zA-Z0-9._\-\s]/g, '')
    .replace(/\.\./g, '')
    .trim()
    .substring(0, 100);
}

/**
 * Formats a byte count into a human-readable file size string.
 * @param {number} bytes - The size in bytes.
 * @returns {string} Formatted size string such as "42.1 KB" or "1.0 MB".
 */
function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Displays or clears the file upload error message element in the UI.
 * @param {string} message - Error text to display, or empty string to hide.
 */
function showUploadError(message) {
  const el = document.getElementById('errorMsg-file');
  if (!el) return;
  el.textContent = message;
  el.style.visibility = message ? 'visible' : 'hidden';
}

/**
 * Processes a single validated image: compresses it and converts to base64.
 * Returns an attachment object with name, type, size, and data URL.
 * @param {File} file - The validated and allowed image file.
 * @returns {Promise<{name:string, type:string, size:number, data:string}>}
 */
async function processFile(file) {
  const compressed = await compressImage(file);
  const base64 = await convertBlobToBase64(compressed);
  return {
    name: sanitizeFilename(file.name),
    type: file.type,
    size: compressed.size,
    data: base64,
  };
}

/**
 * Iterates through files, validates each via type and magic bytes,
 * and adds valid ones to the attachments array. Invalid files show an error.
 * @param {FileList} files - The files to validate and process.
 */
async function processAndAddFiles(files) {
  for (const file of Array.from(files)) {
    const valid = await validateFileType(file);
    if (!valid) {
      showUploadError(`"${sanitizeFilename(file.name)}" is invalid. Only JPG, PNG and WebP are allowed.`);
      continue;
    }
    const attachment = await processFile(file);
    attachments.push(attachment);
    renderPreviewList();
  }
}

/**
 * Handles the file input change event: checks size limit, then triggers processing.
 * Resets the input after reading so the same file can be re-selected if needed.
 * @param {Event} event - The change event from the file input element.
 */
async function handleFileInputChange(event) {
  const files = event.target.files;
  if (!files || files.length === 0) return;
  showUploadError('');
  if (!isWithinSizeLimit(files)) {
    showUploadError('Total size exceeds 1 MB. Please select smaller images.');
    event.target.value = '';
    return;
  }
  await processAndAddFiles(files);
  event.target.value = '';
}

/**
 * Builds the inner HTML string for a single file preview item.
 * Includes a thumbnail, filename, size, and a remove button.
 * @param {{name:string, size:number, data:string}} a - The attachment object.
 * @param {number} index - The index of this attachment in the array.
 * @returns {string} HTML markup for the preview item.
 */
function buildPreviewItemHTML(a, index) {
  const size = formatFileSize(a.size);
  return `
    <img class="preview-thumb" src="${a.data}" alt="${a.name}"
         onclick="openImageViewer(attachments, ${index})"
         tabindex="0" role="button" aria-label="View ${a.name}">
    <div class="preview-meta">
      <span class="preview-name">${a.name}</span>
      <span class="preview-size">${size}</span>
    </div>
    <button class="preview-remove" onclick="removeAttachment(${index})"
            aria-label="Remove ${a.name}" type="button">×</button>
  `;
}

/**
 * Creates a preview list item DOM element for a given attachment.
 * @param {{name:string, size:number, data:string}} attachment - Attachment data.
 * @param {number} index - Index in the attachments array.
 * @returns {HTMLElement} The constructed div element for the preview list.
 */
function createPreviewItem(attachment, index) {
  const item = document.createElement('div');
  item.className = 'file-preview-item';
  item.dataset.index = index;
  item.innerHTML = buildPreviewItemHTML(attachment, index);
  return item;
}

/**
 * Clears and fully re-renders the file preview list from the current attachments array.
 * Called after every add or remove operation to keep indices in sync.
 */
function renderPreviewList() {
  const list = document.getElementById('filePreviewList');
  if (!list) return;
  list.innerHTML = '';
  attachments.forEach((a, i) => list.appendChild(createPreviewItem(a, i)));
}

/**
 * Removes an attachment at the given index and refreshes the preview list.
 * Re-renders all items so onclick indices stay correct after deletion.
 * @param {number} index - The index of the attachment to remove.
 */
function removeAttachment(index) {
  attachments.splice(index, 1);
  renderPreviewList();
}

/**
 * Returns the current attachments array for inclusion when saving a task.
 * @returns {Array<{name:string, type:string, size:number, data:string}>}
 */
function collectAttachments() {
  return attachments;
}

/**
 * Sets up keyboard and click accessibility on the file drop area element.
 * Enter and Space activate the hidden file input, enabling keyboard-only use.
 * @param {HTMLElement} dropArea - The styled drop zone element.
 */
function setupDropAreaKeyboard(dropArea) {
  dropArea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      document.getElementById('fileInput').click();
    }
  });
  dropArea.addEventListener('click', (e) => {
    if (e.target.id !== 'fileInput') document.getElementById('fileInput').click();
  });
}

/**
 * Initializes the file upload UI, optionally pre-loading existing attachments.
 * Attaches change listener to the file input and sets up drop area keyboard access.
 * @param {Array} [existingAttachments=[]] - Attachments to pre-populate (used in edit mode).
 */
function initFileUpload(existingAttachments = []) {
  attachments = existingAttachments ? [...existingAttachments] : [];
  renderPreviewList();
  const input = document.getElementById('fileInput');
  if (input) input.addEventListener('change', handleFileInputChange);
  const dropArea = document.getElementById('fileDropArea');
  if (dropArea) setupDropAreaKeyboard(dropArea);
}

/**
 * Resets the file upload state: clears the attachments array,
 * re-renders the empty preview list, and hides any error messages.
 */
function resetFileUpload() {
  attachments = [];
  renderPreviewList();
  showUploadError('');
}

/**
 * Builds an HTML string for one attachment item in the task detail overlay.
 * Includes thumbnail, filename, size/type info, and a download button.
 * @param {{name:string, type:string, size:number, data:string}} a - Attachment data.
 * @param {number} index - Index in the task's attachments array.
 * @param {number} taskIndex - Index of the parent task in allTasks.
 * @returns {string} HTML markup string for the attachment detail item.
 */
function buildAttachmentDetailItem(a, index, taskIndex) {
  const size = formatFileSize(a.size);
  return `
    <div class="attachment-detail-item">
      <img src="${a.data}" alt="${a.name}" class="attachment-thumb"
           onclick="openImageViewer(allTasks[${taskIndex}].attachments, ${index})"
           tabindex="0" role="button" aria-label="View ${a.name}">
      <div class="attachment-detail-meta">
        <span class="attachment-name">${a.name}</span>
        <span class="attachment-size">${size} · ${a.type.split('/')[1].toUpperCase()}</span>
        <button class="attachment-download-btn" type="button"
                onclick="downloadAttachment(allTasks[${taskIndex}].attachments[${index}])"
                aria-label="Download ${a.name}">⬇ Download</button>
      </div>
    </div>
  `;
}

/**
 * Renders the full attachments section HTML for the task detail overlay.
 * Returns an empty string if the task has no attachments.
 * @param {Array} atts - Array of attachment objects belonging to the task.
 * @param {number} taskIndex - Index of the task in allTasks.
 * @returns {string} HTML string for the attachments section, or ''.
 */
function renderAttachmentsInDetail(atts, taskIndex) {
  if (!atts || atts.length === 0) return '';
  const items = atts.map((a, i) => buildAttachmentDetailItem(a, i, taskIndex)).join('');
  return `
    <div class="task-detail-attachments">
      <span class="task-detail-attachments-title">Attachments</span>
      <div class="attachment-grid">${items}</div>
    </div>
  `;
}
