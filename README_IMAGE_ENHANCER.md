# Image Enhancer - Stage Quality Enhancement

This tool enhances images to make them clearer and more stage-like with professional lighting effects.

## Features

- **Sharpness Enhancement**: Improves image clarity and detail
- **Stage Lighting**: Adjusts brightness and contrast for stage-like appearance
- **Color Enhancement**: Boosts saturation for vibrant, professional look
- **Noise Reduction**: Cleans up images for professional quality
- **Customizable Settings**: Adjust brightness, contrast, saturation, and sharpness

## How to Use

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to the Image Enhancer**:
   Visit `http://localhost:3000/image-enhancer`

3. **Upload an image**:
   - Click "Select Image" to choose a photo
   - The original image will appear on the left

4. **Adjust settings** (optional):
   - Use the sliders to customize:
     - **Brightness**: Make images brighter (default: 1.1)
     - **Contrast**: Increase contrast for stage lighting (default: 1.2)
     - **Saturation**: Enhance colors (default: 1.15)
     - **Sharpness**: Improve clarity (default: 1.5)

5. **Enhance the image**:
   - Click "Enhance Image" to process
   - The enhanced image will appear on the right

6. **Download**:
   - Click "Download Enhanced Image" to save the result

## API Endpoints

### POST `/api/image-enhance`
Processes an image with default stage-quality settings.

**Request**: FormData with `image` file

**Response**: Enhanced JPEG image

### PUT `/api/image-enhance`
Processes an image with custom settings.

**Request**: FormData with:
- `image`: Image file
- `brightness`: Number (default: 1.1)
- `contrast`: Number (default: 1.2)
- `saturation`: Number (default: 1.15)
- `sharpen`: Number (default: 1.5)

**Response**: Enhanced JPEG image

## Image Processing Techniques

The enhancer uses several techniques:

1. **Sharpening**: Uses sigma-based sharpening to enhance details
2. **Modulation**: Adjusts brightness and saturation
3. **Normalization**: Normalizes contrast for better dynamic range
4. **Linear Contrast**: Increases contrast for stage lighting effect
5. **Noise Reduction**: Uses median filter to reduce noise
6. **Edge Enhancement**: Applies convolution kernel for crisp edges

## Installation

Make sure to install dependencies:

```bash
npm install
```

The `sharp` library is required for server-side image processing.

## Example Usage

```typescript
import { enhanceImageOnServer } from '@/lib/imageProcessor'

const file = // your image file
const enhancedBlob = await enhanceImageOnServer(file, {
  brightness: 1.2,
  contrast: 1.3,
  saturation: 1.2,
  sharpen: 2.0
})
```

## Tips for Best Results

- **Stage Photos**: Use brightness 1.1-1.3, contrast 1.2-1.5
- **Portrait Photos**: Use moderate settings (1.0-1.2)
- **Low Light Photos**: Increase brightness to 1.3-1.5
- **Overexposed Photos**: Reduce brightness to 0.8-1.0
