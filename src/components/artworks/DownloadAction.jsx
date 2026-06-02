import { Download } from 'lucide-react'
import { memo, useState } from 'react'

export const DownloadAction = memo(function DownloadAction({ artwork }) {
  const [error, setError] = useState(null)

  const handleDownload = async () => {
    setError(null)
    try {
      // Try to fetch the image (works for same-origin or CORS-enabled URLs)
      const response = await fetch(artwork.image)
      if (!response.ok || !response.headers.get('Content-Type')?.startsWith('image/')) {
        throw new Error("Le fichier n'est pas une image ou la requête a échoué.")
      }
      const blob = await response.blob()
      const file = new Blob([blob], { type: blob.type })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(file)
      link.download = artwork?.title || 'image'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setTimeout(() => URL.revokeObjectURL(link.href), 200)
    } catch (err) {
      // Fallback: open image in new tab (for CORS-protected images)
      try {
        window.open(artwork.image, '_blank')
      } catch (e) {
        setError("Impossible de télécharger l'image.")
      }
    }
  }

  return (
    <>
      <button
        title="Télécharger"
        onClick={handleDownload}
        className="p-2 rounded-full bg-kcb-ardoise border border-white/[0.06] hover:bg-kcb-or/80 hover:text-white transition-colors text-kcb-sable focus:outline-none focus:ring-2 focus:ring-kcb-or"
      >
        <Download className="w-5 h-5" />
      </button>
      {error && <span className="text-xs text-red-500 ml-2">{error}</span>}
    </>
  )
})
