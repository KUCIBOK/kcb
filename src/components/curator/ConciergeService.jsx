import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star,
  Calendar,
  Clock,
  CheckCircle,
  Video,
  MapPin,
  Shield,
  Truck,
  ChevronRight,
  X,
  Loader,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react'
import { PlanGate } from '../shared/PlanGate'
import { PLAN_PREMIUM } from '../../utils/planUtils'
import {
  useGetServices,
  useCreateBooking,
  useGetBookings,
  useCancelBooking,
  useConfirmPayment,
} from '../../api/useConcierge'

const ICON_COMPONENT_MAP = {
  Video,
  MapPin,
  Shield,
  Truck,
}

function ServiceCard({ service, onBook }) {
  const IconComponent = ICON_COMPONENT_MAP[service.icon_name] || Star

  return (
    <motion.button
      whileHover={{ y: -4 }}
      onClick={() => onBook(service)}
      className="text-left bg-kcb-noir border border-kcb-silver/[0.12] rounded-[4px] p-8 lg:p-10 h-full relative overflow-hidden group transition-all duration-300 hover:border-kcb-silver/[0.25] hover:bg-kcb-noir/60 hover:shadow-lg"
    >
      <div className="mb-6 text-5xl">
        <IconComponent className="w-10 h-10 text-kcb-or" />
      </div>

      <span className="font-jetbrains text-[11px] tracking-[0.2em] font-bold text-kcb-or">
        {service.duration}
      </span>

      <p className="font-dm-sans font-bold text-lg lg:text-xl mt-4 mb-3 leading-tight text-white group-hover:text-kcb-or transition-colors">
        {service.name}
      </p>

      <p className="font-dm-sans text-sm lg:text-base leading-[1.8] mb-6 text-kcb-pierre group-hover:text-white/75 transition-colors">
        {service.description}
      </p>

      <div className="flex items-center gap-2 text-sm font-semibold text-kcb-or group-hover:text-white transition-colors">
        Book now <ChevronRight className="w-4 h-4" />
      </div>

      <div className="text-xs text-kcb-pierre mt-4 pt-4 border-t border-white/[0.06]">
        {service.price && <span className="font-bold text-kcb-or">{service.price}€</span>}
        {service.turnaround_days && <span className="ml-2">• {service.turnaround_days} days</span>}
      </div>
    </motion.button>
  )
}

function BookingModal({ service, onClose, onConfirm, loading }) {
  const [startDate, setStartDate] = useState('')
  const [notes, setNotes] = useState('')

  const handleConfirm = () => {
    if (!startDate) return
    onConfirm({ serviceId: service.id, requestedStartDate: startDate, notes })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-md bg-kcb-noir border border-white/[0.06] rounded-t-[8px] sm:rounded-[4px] p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-playfair text-xl text-white">Book Service</h2>
          <button onClick={onClose} className="text-kcb-pierre hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-4 mb-6">
          <p className="text-sm font-semibold text-white">{service.name}</p>
          <p className="text-xs text-kcb-pierre mt-1">{service.description}</p>
          {service.deliverables && (
            <ul className="text-xs text-kcb-pierre mt-3 space-y-1">
              {service.deliverables.slice(0, 3).map((d, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-emerald-400" />
                  <span>{d}</span>
                </li>
              ))}
              {service.deliverables.length > 3 && (
                <li className="text-kcb-pierre/60">+ {service.deliverables.length - 3} more</li>
              )}
            </ul>
          )}
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs text-kcb-pierre block mb-2">Preferred Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-kcb-ardoise border border-white/[0.08] text-white text-sm px-3 py-2.5 rounded-[4px] focus:outline-none focus:border-kcb-or"
            />
          </div>

          <div>
            <label className="text-xs text-kcb-pierre block mb-2">Additional Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific requests or preferences..."
              className="w-full bg-kcb-ardoise border border-white/[0.08] text-white text-sm px-3 py-2.5 rounded-[4px] focus:outline-none focus:border-kcb-or placeholder-kcb-pierre/50 resize-none h-20"
            />
          </div>
        </div>

        <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-sm text-kcb-pierre">Total Price</span>
            <span className="text-lg font-bold text-kcb-or">
              {service.price}€ <span className="text-xs text-kcb-pierre">{service.currency}</span>
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 text-sm font-semibold border border-white/[0.06] text-kcb-pierre hover:text-white transition rounded-[4px] disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!startDate || loading}
            className="flex-1 py-2.5 text-sm font-semibold bg-kcb-or text-kcb-noir hover:bg-kcb-bronze transition rounded-[4px] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Book Now'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function ConciergeServiceContent() {
  const [services, setServices] = useState([])
  const [bookings, setBookings] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('services') // 'services' or 'bookings'

  useEffect(() => {
    loadServices()
    loadBookings()
  }, [])

  const loadServices = async () => {
    const result = await useGetServices()
    if (result.error) {
      setError(result.error)
    } else {
      setServices(result || [])
    }
  }

  const loadBookings = async () => {
    const result = await useGetBookings()
    if (result.error) {
      setError(result.error)
    } else {
      setBookings(result || [])
    }
  }

  const handleBookService = async (payload) => {
    setLoading(true)
    const result = await useCreateBooking(payload)
    if (result.error) {
      setError(result.error)
    } else {
      setSelectedService(null)
      await loadBookings()
    }
    setLoading(false)
  }

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Cancel this booking?')) return

    setLoading(true)
    const result = await useCancelBooking(bookingId)
    if (result.error) {
      setError(result.error)
    } else {
      await loadBookings()
    }
    setLoading(false)
  }

  const handleConfirmPayment = async (bookingId) => {
    setLoading(true)
    const result = await useConfirmPayment(bookingId)
    if (result.error) {
      setError(result.error)
    } else {
      await loadBookings()
    }
    setLoading(false)
  }

  if (loading && services.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader className="w-6 h-6 animate-spin text-kcb-or" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-playfair text-xl text-white">Concierge Services</h2>
        <p className="text-sm text-kcb-pierre mt-0.5">Premium services for curators & advisors</p>
      </div>

      {error && <div className="text-xs text-red-400 bg-red-400/10 p-4 rounded-[4px]">{error}</div>}

      {/* Tab selector */}
      <div className="flex gap-2 border-b border-white/[0.06]">
        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-3 text-sm font-semibold transition border-b-2 ${
            activeTab === 'services'
              ? 'text-kcb-or border-kcb-or'
              : 'text-kcb-pierre hover:text-white border-transparent'
          }`}
        >
          Available Services
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-3 text-sm font-semibold transition border-b-2 relative ${
            activeTab === 'bookings'
              ? 'text-kcb-or border-kcb-or'
              : 'text-kcb-pierre hover:text-white border-transparent'
          }`}
        >
          My Bookings
          {bookings.length > 0 && (
            <span className="absolute top-1 right-0 w-2 h-2 bg-kcb-or rounded-full" />
          )}
        </button>
      </div>

      {/* Services tab */}
      {activeTab === 'services' && (
        <div>
          {services.length === 0 ? (
            <div className="text-center text-kcb-pierre py-12">No services available</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onBook={() => setSelectedService(service)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bookings tab */}
      {activeTab === 'bookings' && (
        <div>
          {bookings.length === 0 ? (
            <div className="text-center text-kcb-pierre py-12">
              No bookings yet. Choose a service to get started!
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-white">{booking.concierge_services?.name}</h3>
                      <p className="text-xs text-kcb-pierre mt-1">{booking.concierge_services?.description}</p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        booking.status === 'confirmed'
                          ? 'bg-emerald-400/20 text-emerald-400'
                          : booking.status === 'cancelled'
                            ? 'bg-red-400/20 text-red-400'
                            : 'bg-kcb-or/20 text-kcb-or'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-xs text-kcb-pierre">Requested Date</p>
                      <p className="text-white font-semibold">
                        {new Date(booking.requested_start_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-kcb-pierre">Price</p>
                      <p className="text-white font-semibold">
                        {booking.amount}€ {booking.currency}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {booking.payment_status === 'pending' && booking.status === 'pending' && (
                      <button
                        onClick={() => handleConfirmPayment(booking.id)}
                        disabled={loading}
                        className="flex-1 py-2 text-xs font-semibold bg-kcb-or text-kcb-noir hover:bg-kcb-bronze transition rounded-[4px] disabled:opacity-40"
                      >
                        {loading ? <Loader className="w-3 h-3 animate-spin mx-auto" /> : 'Complete Payment'}
                      </button>
                    )}
                    {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={loading}
                        className="flex-1 py-2 text-xs font-semibold border border-red-400/30 text-red-400 hover:border-red-400 transition rounded-[4px] disabled:opacity-40"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {selectedService && (
          <BookingModal
            service={selectedService}
            onClose={() => setSelectedService(null)}
            onConfirm={handleBookService}
            loading={loading}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export function ConciergeService() {
  return (
    <PlanGate
      minLevel={PLAN_PREMIUM}
      feature="Concierge Services"
      description="Book premium concierge services for professional art curation"
    >
      <ConciergeServiceContent />
    </PlanGate>
  )
}
