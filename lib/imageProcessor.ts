/**
 * Client-side image processing utilities
 * For browser-based image enhancement before upload
 */

export interface ImageEnhanceOptions {
  brightness?: number
  contrast?: number
  saturation?: number
  sharpen?: number
}

/**
 * Enhance image using Canvas API (client-side)
 */
export async function enhanceImageClientSide(
  file: File,
  options: ImageEnhanceOptions = {}
): Promise<File> {
  const {
    brightness = 1.1,
    contrast = 1.2,
    saturation = 1.15,
  } = options

  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      reject(new Error('Canvas context not available'))
      return
    }

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height

      // Apply filters
      ctx.filter = `
        brightness(${brightness})
        contrast(${contrast})
        saturate(${saturation})
      `

      ctx.drawImage(img, 0, 0)

      // Convert to blob and then to File
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const enhancedFile = new File(
              [blob],
              `enhanced-${file.name}`,
              { type: 'image/jpeg' }
            )
            resolve(enhancedFile)
          } else {
            reject(new Error('Failed to create blob'))
          }
        },
        'image/jpeg',
        0.95
      )
    }

    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Upload and process image on server
 */
export async function enhanceImageOnServer(
  file: File,
  options: ImageEnhanceOptions = {}
): Promise<Blob> {
  const formData = new FormData()
  formData.append('image', file)

  if (options.brightness) formData.append('brightness', options.brightness.toString())
  if (options.contrast) formData.append('contrast', options.contrast.toString())
  if (options.saturation) formData.append('saturation', options.saturation.toString())
  if (options.sharpen) formData.append('sharpen', options.sharpen.toString())

  const response = await fetch('/api/image-enhance', {
    method: 'PUT',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to enhance image')
  }

  return response.blob()
}
