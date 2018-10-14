/**
 * convert a dubious string to a safe file name
 */
export default function safeFileName(fileName) {
  return fileName.replace(/[^a-zA-Z0-9_\-']+/gi, '_').replace(/_+/gi, '_').trim()
}
