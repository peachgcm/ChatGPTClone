'use client'

import { useState, useRef } from 'react'
import { Upload, Download, Sparkles, RotateCcw } from 'lucide-react'
import { enhanceImageOnServer } from '@/lib/imageProcessor'

export default function ImageEnhancer() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [settings, setSettings] = useState({
    brightness: 1.1,
    contrast: 1.2,
    saturation: 1.15,
    sharpen: 1.5,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setOriginalImage(e.target?.result as string)
        setEnhancedImage(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEnhance = async () => {
    if (!fileInputRef.current?.files?.[0]) return

    setIsProcessing(true)
    try {
      const file = fileInputRef.current.files[0]
      const blob = await enhanceImageOnServer(file, settings)
      const url = URL.createObjectURL(blob)
      setEnhancedImage(url)
    } catch (error: any) {
      console.error('Enhancement error:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!enhancedImage) return
    const link = document.createElement('a')
    link.href = enhancedImage
    link.download = 'enhanced-image.jpg'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleReset = () => {
    setOriginalImage(null)
    setEnhancedImage(null)
    setSettings({
      brightness: 1.1,
      contrast: 1.2,
      saturation: 1.15,
      sharpen: 1.5,
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <Sparkles className="w-8 h-8" />
          Image Enhancer - Stage Quality
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Original Image */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Original Image</h2>
            {originalImage ? (
              <div className="relative">
                <img
                  src={originalImage}
                  alt="Original"
                  className="w-full rounded-lg border-2 border-gray-700"
                />
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                <p className="text-gray-400 mb-4">No image selected</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-input"
                />
                <label
                  htmlFor="file-input"
                  className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer transition-colors"
                >
                  Select Image
                </label>
              </div>
            )}
          </div>

          {/* Enhanced Image */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Enhanced Image</h2>
            {enhancedImage ? (
              <div className="relative">
                <img
                  src={enhancedImage}
                  alt="Enhanced"
                  className="w-full rounded-lg border-2 border-green-500"
                />
                <button
                  onClick={handleDownload}
                  className="mt-4 w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Download Enhanced Image
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                <p className="text-gray-400">
                  {originalImage
                    ? 'Click "Enhance Image" to process'
                    : 'Enhanced image will appear here'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Settings Panel */}
        {originalImage && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Enhancement Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2">
                  Brightness: {settings.brightness.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={settings.brightness}
                  onChange={(e) =>
                    setSettings({ ...settings, brightness: parseFloat(e.target.value) })
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="block mb-2">
                  Contrast: {settings.contrast.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={settings.contrast}
                  onChange={(e) =>
                    setSettings({ ...settings, contrast: parseFloat(e.target.value) })
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="block mb-2">
                  Saturation: {settings.saturation.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={settings.saturation}
                  onChange={(e) =>
                    setSettings({ ...settings, saturation: parseFloat(e.target.value) })
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="block mb-2">
                  Sharpness: {settings.sharpen.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="0.1"
                  value={settings.sharpen}
                  onChange={(e) =>
                    setSettings({ ...settings, sharpen: parseFloat(e.target.value) })
                  }
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleEnhance}
                disabled={isProcessing || !originalImage}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Enhance Image
                  </>
                )}
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
