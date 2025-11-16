import { FC, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, DollarSign, Calendar, Shield, Camera, Loader2, AlertCircle, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface EquipmentForm {
  name: string
  description: string
  dailyRate: number
  deposit: number
  images: string[]
  insuranceRequired: boolean
  condition: string
  specifications: string
  availableFrom: string
  availableTo: string
}

const ListEquipment: FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')

  // Debug function to check localStorage
  const checkLocalStorage = () => {
    const equipment = JSON.parse(localStorage.getItem('equipment') || '[]')
    console.log('Current equipment in localStorage:', equipment)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Create a preview URL for the image
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Check if user is logged in
      if (!currentUser.id) {
        throw new Error('Please sign in to list equipment')
      }

      // Check if an image was uploaded
      if (!imagePreview) {
        throw new Error('Please upload an image of your equipment')
      }

      const form = e.currentTarget
      const formData = new FormData(form)

      // Create new equipment object
      const newEquipment = {
        id: Date.now(),
        name: formData.get('name')?.toString().trim(),
        description: formData.get('description')?.toString().trim(),
        price: formData.get('price')?.toString().trim(),
        location: formData.get('location')?.toString().trim(),
        images: [imagePreview],
        availableFrom: formData.get('availableFrom')?.toString() || new Date().toISOString().split('T')[0],
        availableTo: formData.get('availableTo')?.toString() || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        insuranceRequired: formData.get('insuranceRequired') === 'on',
        ownerId: currentUser.id,
        ownerName: currentUser.name
      }

      // Validate required fields
      if (!newEquipment.name || !newEquipment.price || !newEquipment.location) {
        throw new Error('Please fill in all required fields')
      }

      // Get existing equipment from localStorage
      const existingEquipment = JSON.parse(localStorage.getItem('equipment') || '[]')
      
      // Add new equipment
      const updatedEquipment = [...existingEquipment, newEquipment]
      
      // Save to localStorage
      localStorage.setItem('equipment', JSON.stringify(updatedEquipment))

      // Debug logs
      console.log('New equipment added:', newEquipment)
      console.log('Updated equipment list:', updatedEquipment)
      
      // Navigate to my equipment page
      navigate('/my-equipment')
    } catch (err: any) {
      console.error('Error adding equipment:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Check localStorage on component mount
  useState(() => {
    checkLocalStorage()
  })

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">List Your Equipment</h1>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 required">
                Equipment Name *
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="e.g., John Deere Tractor"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Describe your equipment..."
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 required">
                Daily Rental Price (₹) *
              </label>
              <input
                type="text"
                name="price"
                id="price"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="e.g., 2,500"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 required">
                Location *
              </label>
              <input
                type="text"
                name="location"
                id="location"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="e.g., Mumbai, Maharashtra"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 required">
                Equipment Image *
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <div className="flex-shrink-0 h-32 w-32 rounded-md overflow-hidden border border-gray-300">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Equipment preview" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-100">
                      <Camera className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </button>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null)
                        if (fileInputRef.current) {
                          fileInputRef.current.value = ''
                        }
                      }}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove Image
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Upload a clear image of your equipment (JPG, PNG, GIF)
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="availableFrom" className="block text-sm font-medium text-gray-700">
                  Available From
                </label>
                <input
                  type="date"
                  name="availableFrom"
                  id="availableFrom"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label htmlFor="availableTo" className="block text-sm font-medium text-gray-700">
                  Available To
                </label>
                <input
                  type="date"
                  name="availableTo"
                  id="availableTo"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="insuranceRequired"
                id="insuranceRequired"
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="insuranceRequired" className="ml-2 block text-sm text-gray-700">
                Require insurance from renters
              </label>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/my-equipment')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Listing...' : 'List Equipment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ListEquipment 