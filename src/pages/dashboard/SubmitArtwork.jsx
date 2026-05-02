import { memo, useState } from 'react'
import { useAuth } from '../../store/AuthContext'
import { Step1 } from '../../components/artworks/submit/Step1'
import { Step2 } from '../../components/artworks/submit/Step2'
import { Step3 } from '../../components/artworks/submit/Step3'
import { Step4 } from '../../components/artworks/submit/Step4'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function SubmitArtwork() {
  const { user, artistProfile, curatorProfile } = useAuth()
  const steps = ['Détails', 'Télécharger', 'Prix', 'Soumettre']
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    image: null,
    tags: [],
    price: '',
    forSale: true,
    auctionStatus: 'not_for_auction',
    currency: 'XOF',
    category: '',
    categoryId: '',
    artist: user?.role == 'artist' ? user.name : '',
    artistId: artistProfile?.id || '',
    userId: user?.id,
    forBid: false,
    height: '',
    width: '',
    weight: '',
    medium: '',
    condition: '',
    provenance: '',
    availabilityStatus: 'available',

    tag: '',
    step: 0,
    loading: false,
    show: '',
    error: '',
  })
  const renderStep = () => {
    switch (formState.step) {
      case 0:
        return <Step1 formState={formState} setFormState={setFormState} />
      case 1:
        return <Step2 formState={formState} setFormState={setFormState} />
      case 2:
        return <Step3 formState={formState} setFormState={setFormState} />
      case 3:
        return (
          <Step4
            formState={formState}
            profile={artistProfile || curatorProfile}
            setFormState={setFormState}
            user={user}
          />
        )
      default:
        return <Step1 formState={formState} setFormState={setFormState} />
    }
  }
  return (
    <div className="px-2 sm:px-0 py-8 md:max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Link
          to={-1}
          className="flex items-center gap-2 rounded-[4px] px-3 py-1.5 text-sm text-white bg-kcb-ardoise hover:bg-kcb-ardoise/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-white" />
          <span className="font-medium">Retour</span>
        </Link>
      </div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl text-white font-semibold mb-1">
          Soumettre une œuvre
        </h1>
        <p className="text-kcb-pierre text-sm">
          Soumettez votre œuvre à la plateforme pour examen et publication
        </p>
      </div>
      <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-6 shadow-lg">
        <p className="text-white text-xl font-serif font-semibold mb-1">Détails de l'œuvre</p>
        <p className="text-kcb-pierre text-sm mb-4">
          Remplissez les champs pour soumettre votre œuvre
        </p>
        <div className="flex justify-center gap-6 items-center mt-4">
          {steps.map((step, index) => (
            <div className="flex flex-col items-center gap-1 px-1" key={index}>
              <div
                className={`rounded-full mx-auto flex justify-center items-center w-7 h-7 font-medium text-sm transition-all duration-200 ${
                  formState.step === index
                    ? 'bg-kcb-or text-white scale-110 shadow'
                    : formState.step > index
                      ? 'bg-green-600 text-white'
                      : 'bg-kcb-ardoise text-kcb-pierre'
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`text-[11px] font-medium ${
                  formState.step === index ? 'text-kcb-or' : 'text-kcb-pierre'
                }`}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-8">{renderStep()}</div>
      </div>
    </div>
  )
}
