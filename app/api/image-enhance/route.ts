import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      )
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Process image with Sharp for maximum clarity and stage-like enhancement
    const processedImage = await sharp(buffer)
      // Maximum sharpening - very aggressive for clarity
      .sharpen(3.5, 3, 4)  // sigma, flat, jagged
      // Unsharp mask for detail enhancement
      .sharpen(1.5, 1.5, 3)
      // Additional sharpening pass
      .sharpen(2.0, 2.5, 3.5)
      // Adjust brightness and contrast for stage lighting
      .modulate({
        brightness: 1.2,   // Brighter for clarity
        saturation: 1.25,  // More vibrant colors
      })
      // Enhance contrast for stage-like appearance
      .normalise()  // Normalize contrast
      .linear(1.6, -(128 * 0.6))  // Very strong contrast increase
      // Minimal noise reduction to preserve all detail
      .median(1)  // Minimal to preserve maximum detail
      // Very strong edge enhancement for clarity
      .convolve({
        width: 3,
        height: 3,
        kernel: [-2, -2, -2, -2, 16, -2, -2, -2, -2]  // Maximum edge enhancement
      })
      // Another edge enhancement pass
      .convolve({
        width: 3,
        height: 3,
        kernel: [0, -1, 0, -1, 5, -1, 0, -1, 0]  // Additional sharpening kernel
      })
      // Final aggressive sharpening
      .sharpen(2.5, 3, 4)
      // Use PNG for maximum quality (no compression artifacts)
      .png({ quality: 100, compressionLevel: 0 })
      .toBuffer()

    // Return processed image
    return new NextResponse(processedImage as unknown as BodyInit, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="enhanced-${file.name.replace(/\.[^.]+$/, '.png')}"`,
      },
    })
  } catch (error: any) {
    console.error('Image processing error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process image',
        message: error.message 
      },
      { status: 500 }
    )
  }
}

// Alternative endpoint with customizable parameters
export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('image') as File
    const brightness = parseFloat(formData.get('brightness') as string) || 1.1
    const contrast = parseFloat(formData.get('contrast') as string) || 1.2
    const saturation = parseFloat(formData.get('saturation') as string) || 1.15
    const sharpen = parseFloat(formData.get('sharpen') as string) || 1.5

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const processedImage = await sharp(buffer)
      // Multiple sharpening passes for maximum clarity
      .sharpen(sharpen || 2.5, 2, 3)
      .sharpen(1.0, 1, 2)
      .modulate({
        brightness: brightness || 1.15,
        saturation: saturation || 1.2,
      })
      .normalise()
      .linear(contrast || 1.4, -(128 * ((contrast || 1.4) - 1)))
      .median(2)  // Reduced to preserve detail
      .convolve({
        width: 3,
        height: 3,
        kernel: [-1, -1, -1, -1, 12, -1, -1, -1, -1]
      })
      .sharpen(1.2, 1.5, 2.5)
      .png({ quality: 100, compressionLevel: 0 })
      .toBuffer()

    return new NextResponse(processedImage as unknown as BodyInit, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="enhanced-${file.name.replace(/\.[^.]+$/, '.png')}"`,
      },
    })
  } catch (error: any) {
    console.error('Image processing error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process image',
        message: error.message 
      },
      { status: 500 }
    )
  }
}
