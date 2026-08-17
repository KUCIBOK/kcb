import { Upload, XCircle } from 'lucide-react'
import { useState } from 'react'
import { Progress } from '../ui'
import { Modal, Button } from '../ui'

const ImportFile = ({ onUpload }) => {
  const [file, setFile] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)

  const handleUpload = async () => {
    if (!file) return
    setIsLoading(true)
    setProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + Math.random() * 30
      })
    }, 300)

    const res = await onUpload(file)
    clearInterval(progressInterval)
    setProgress(100)
    setResult(res)
    setIsLoading(false)
    if (!res.error) {
      setTimeout(() => {
        setIsOpen(false)
        setFile(null)
        setResult(null)
        setProgress(0)
      }, 2000)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setFile(null)
    setResult(null)
    setProgress(0)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 text-sm rounded-[4px] border border-white/[0.06] text-kcb-sable hover:bg-kcb-ardoise transition flex items-center gap-1"
      >
        <Upload className="h-4 w-4" />
        Importer CSV
      </button>

      {isOpen && (
        <Modal isOpen={isOpen} onClose={handleClose} title="Importer des clients" size="sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-kcb-sable mb-2">
                Fichier CSV/XLSX
              </label>
              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={(e) => setFile(e.target.files[0])}
                disabled={isLoading}
                className="block w-full text-sm text-kcb-pierre
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-[4px] file:border-0
                  file:text-sm file:font-semibold
                  file:bg-kcb-ardoise file:text-kcb-sable
                  hover:file:bg-kcb-ardoise
                  disabled:opacity-50"
              />
              <p className="mt-1 text-xs text-kcb-pierre">Formats acceptés: .csv, .xlsx</p>
            </div>

            {isLoading && (
              <div>
                <p className="text-xs text-kcb-pierre mb-2">Import en cours...</p>
                <Progress value={progress} variant="primary" />
              </div>
            )}

            {result && (
              <div
                className={`p-3 rounded-[4px] text-sm ${
                  result.error ? 'bg-red-900/50 text-red-200' : 'bg-green-900/50 text-green-200'
                }`}
              >
                <div className="font-medium mb-1">{result.error || result.message}</div>
                {result.duplicates > 0 && result.duplicateDetails && (
                  <div className="mt-2">
                    <p className="text-xs font-medium mb-1">Détails des doublons :</p>
                    <ul className="text-xs space-y-1 max-h-32 overflow-y-auto">
                      {result.duplicateDetails.map((detail, index) => (
                        <li key={index} className="opacity-90">
                          • {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="secondary" onClick={handleClose} disabled={isLoading}>
                Annuler
              </Button>
              <Button
                type="button"
                onClick={handleUpload}
                disabled={!file || isLoading}
                loading={isLoading}
              >
                Importer
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

export default ImportFile
