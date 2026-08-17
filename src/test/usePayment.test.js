import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import usePayment from '../hooks/usePayment'
import paymentService from '../services/PaymentService'
import * as sonner from 'sonner'

// Mock dependencies
vi.mock('../services/PaymentService')
vi.mock('sonner')

/**
 * Helper to create a mock fetch response
 */
function makeFetchResponse(data, ok = true, status = 200) {
  return {
    ok,
    status,
    statusText: ok ? 'OK' : 'Error',
    text: vi.fn(async () => JSON.stringify(data)),
    json: vi.fn(async () => data),
  }
}

describe('usePayment', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('payForArtwork', () => {
    it('should initialize artwork payment successfully with redirect', async () => {
      const { result } = renderHook(() => usePayment())

      const mockResponse = {
        success: true,
        data: {
          paymentUrl: 'https://paydunya.com/payment/abc123',
          token: 'token-abc123',
          ref: 'ref-xyz',
          transaction: { id: 'tx-123' },
        },
      }

      paymentService.initArtworkPayment.mockResolvedValueOnce(mockResponse)
      paymentService.redirectToPayment = vi.fn()

      let paymentResult

      await act(async () => {
        paymentResult = await result.current.payForArtwork('artwork-123', {})
      })

      expect(paymentResult.success).toBe(true)
      expect(paymentResult.token).toBe('token-abc123')
      expect(paymentResult.paymentUrl).toBe('https://paydunya.com/payment/abc123')
      expect(paymentService.initArtworkPayment).toHaveBeenCalledWith('artwork-123', null)
      expect(paymentService.redirectToPayment).toHaveBeenCalledWith(
        'https://paydunya.com/payment/abc123'
      )
      expect(result.current.error).toBeNull()
      expect(result.current.loading).toBe(false)
    })

    it('should initialize artwork payment with popup option', async () => {
      const { result } = renderHook(() => usePayment())

      const mockResponse = {
        success: true,
        data: {
          paymentUrl: 'https://paydunya.com/payment/abc123',
          token: 'token-abc123',
          ref: 'ref-xyz',
          transaction: { id: 'tx-123' },
        },
      }

      paymentService.initArtworkPayment.mockResolvedValueOnce(mockResponse)
      paymentService.openPaymentWindow = vi.fn()

      const onPopupClose = vi.fn()

      let paymentResult

      await act(async () => {
        paymentResult = await result.current.payForArtwork(
          'artwork-123',
          { usePopup: true, onPopupClose },
          null
        )
      })

      expect(paymentResult.success).toBe(true)
      expect(paymentService.openPaymentWindow).toHaveBeenCalledWith(
        'https://paydunya.com/payment/abc123',
        expect.any(Function)
      )
    })

    it('should pass guest info when provided', async () => {
      const { result } = renderHook(() => usePayment())

      const mockResponse = {
        success: true,
        data: {
          paymentUrl: 'https://paydunya.com/payment/abc123',
          token: 'token-abc123',
          ref: 'ref-xyz',
          transaction: { id: 'tx-123' },
        },
      }

      paymentService.initArtworkPayment.mockResolvedValueOnce(mockResponse)
      paymentService.redirectToPayment = vi.fn()

      const guest = { name: 'John', email: 'john@example.com', phone: '1234567890' }

      await act(async () => {
        await result.current.payForArtwork('artwork-123', {}, guest)
      })

      expect(paymentService.initArtworkPayment).toHaveBeenCalledWith('artwork-123', guest)
    })

    it('should handle payment initialization failure', async () => {
      const { result } = renderHook(() => usePayment())

      paymentService.initArtworkPayment.mockResolvedValueOnce({
        success: false,
        error: 'Payment initiation failed',
      })

      let paymentResult

      await act(async () => {
        paymentResult = await result.current.payForArtwork('artwork-123', {})
      })

      expect(paymentResult.success).toBe(false)
      expect(paymentResult.error).toBe('Payment initiation failed')
      expect(result.current.error).toBe('Payment initiation failed')
      expect(sonner.toast.error).toHaveBeenCalledWith('Payment initiation failed')
    })

    it('should handle network errors gracefully', async () => {
      const { result } = renderHook(() => usePayment())

      paymentService.initArtworkPayment.mockRejectedValueOnce(
        new Error('Network timeout')
      )

      let paymentResult

      await act(async () => {
        paymentResult = await result.current.payForArtwork('artwork-123', {})
      })

      expect(paymentResult.success).toBe(false)
      expect(paymentResult.error).toBe('Network timeout')
      expect(result.current.error).toBe('Network timeout')
      expect(sonner.toast.error).toHaveBeenCalledWith('Network timeout')
    })

    it('should manage loading state correctly', async () => {
      const { result } = renderHook(() => usePayment())

      const mockResponse = {
        success: true,
        data: {
          paymentUrl: 'https://paydunya.com/payment/abc123',
          token: 'token-abc123',
          transaction: { id: 'tx-123' },
        },
      }

      paymentService.initArtworkPayment.mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(mockResponse), 10)
          })
      )
      paymentService.redirectToPayment = vi.fn()

      expect(result.current.loading).toBe(false)

      let loadingDuringCall = false

      act(() => {
        result.current.payForArtwork('artwork-123', {}).then(() => {
          loadingDuringCall = result.current.loading
        })
      })

      // After the promise resolves, loading should be false
      await new Promise((resolve) => setTimeout(resolve, 50))

      expect(result.current.loading).toBe(false)
    })
  })

  describe('payForSubscription', () => {
    it('should initialize subscription payment successfully', async () => {
      const { result } = renderHook(() => usePayment())

      const mockResponse = {
        success: true,
        data: {
          paymentUrl: 'https://paydunya.com/payment/sub123',
          token: 'token-sub123',
          ref: 'ref-abc',
          subscription: { id: 'sub-456' },
        },
      }

      paymentService.initSubscriptionPayment.mockResolvedValueOnce(mockResponse)
      paymentService.redirectToPayment = vi.fn()

      let paymentResult

      await act(async () => {
        paymentResult = await result.current.payForSubscription('plan-789', {})
      })

      expect(paymentResult.success).toBe(true)
      expect(paymentResult.token).toBe('token-sub123')
      expect(paymentService.initSubscriptionPayment).toHaveBeenCalledWith('plan-789')
      expect(paymentService.redirectToPayment).toHaveBeenCalledWith(
        'https://paydunya.com/payment/sub123'
      )
    })

    it('should handle subscription payment with popup', async () => {
      const { result } = renderHook(() => usePayment())

      const mockResponse = {
        success: true,
        data: {
          paymentUrl: 'https://paydunya.com/payment/sub123',
          token: 'token-sub123',
          subscription: { id: 'sub-456' },
        },
      }

      paymentService.initSubscriptionPayment.mockResolvedValueOnce(mockResponse)
      paymentService.openPaymentWindow = vi.fn()

      const onPopupClose = vi.fn()

      await act(async () => {
        await result.current.payForSubscription('plan-789', {
          usePopup: true,
          onPopupClose,
        })
      })

      expect(paymentService.openPaymentWindow).toHaveBeenCalledWith(
        'https://paydunya.com/payment/sub123',
        expect.any(Function)
      )
    })

    it('should handle subscription payment failure', async () => {
      const { result } = renderHook(() => usePayment())

      paymentService.initSubscriptionPayment.mockResolvedValueOnce({
        success: false,
        error: 'Subscription payment failed',
      })

      let paymentResult

      await act(async () => {
        paymentResult = await result.current.payForSubscription('plan-789', {})
      })

      expect(paymentResult.success).toBe(false)
      expect(paymentResult.error).toBe('Subscription payment failed')
      expect(sonner.toast.error).toHaveBeenCalledWith('Subscription payment failed')
    })
  })

  describe('verifyPayment', () => {
    it('should verify payment successfully', async () => {
      const { result } = renderHook(() => usePayment())

      const mockResponse = {
        success: true,
        data: {
          status: 'completed',
          transaction_id: 'tx-123',
          amount: 10000,
        },
      }

      paymentService.verifyPayment.mockResolvedValueOnce(mockResponse)

      let verifyResult

      await act(async () => {
        verifyResult = await result.current.verifyPayment('token-abc123')
      })

      expect(verifyResult.success).toBe(true)
      expect(verifyResult.data.status).toBe('completed')
      expect(paymentService.verifyPayment).toHaveBeenCalledWith('token-abc123')
      expect(result.current.error).toBeNull()
      expect(result.current.loading).toBe(false)
    })

    it('should NOT show toast on verification failure (asymmetry)', async () => {
      const { result } = renderHook(() => usePayment())

      paymentService.verifyPayment.mockResolvedValueOnce({
        success: false,
        error: 'Verification failed',
      })

      let verifyResult

      await act(async () => {
        verifyResult = await result.current.verifyPayment('token-abc123')
      })

      expect(verifyResult.success).toBe(false)
      expect(verifyResult.error).toBe('Verification failed')
      expect(result.current.error).toBe('Verification failed')
      // Key asymmetry: verifyPayment does NOT call toast.error on failure
      expect(sonner.toast.error).not.toHaveBeenCalled()
    })

    it('should handle verification network error', async () => {
      const { result } = renderHook(() => usePayment())

      paymentService.verifyPayment.mockRejectedValueOnce(
        new Error('Verification network error')
      )

      let verifyResult

      await act(async () => {
        verifyResult = await result.current.verifyPayment('token-abc123')
      })

      expect(verifyResult.success).toBe(false)
      expect(verifyResult.error).toBe('Verification network error')
      expect(result.current.error).toBe('Verification network error')
    })
  })

  describe('clearError', () => {
    it('should clear error state', async () => {
      const { result } = renderHook(() => usePayment())

      paymentService.initArtworkPayment.mockResolvedValueOnce({
        success: false,
        error: 'Test error',
      })

      await act(async () => {
        await result.current.payForArtwork('artwork-123', {})
      })

      expect(result.current.error).toBe('Test error')

      act(() => {
        result.current.clearError()
      })

      expect(result.current.error).toBeNull()
    })
  })

  describe('error handling edge cases', () => {
    it('should use default error message when error object has no message', async () => {
      const { result } = renderHook(() => usePayment())

      paymentService.initArtworkPayment.mockResolvedValueOnce({
        success: false,
        error: null,
      })

      let paymentResult

      await act(async () => {
        paymentResult = await result.current.payForArtwork('artwork-123', {})
      })

      expect(paymentResult.error).toBe("Erreur lors de l'initialisation du paiement")
      expect(sonner.toast.error).toHaveBeenCalledWith(
        "Erreur lors de l'initialisation du paiement"
      )
    })

    it('should handle thrown exception in payForArtwork', async () => {
      const { result } = renderHook(() => usePayment())

      paymentService.initArtworkPayment.mockRejectedValueOnce({
        message: undefined,
      })

      let paymentResult

      await act(async () => {
        paymentResult = await result.current.payForArtwork('artwork-123', {})
      })

      expect(paymentResult.success).toBe(false)
      expect(paymentResult.error).toBe("Erreur lors de l'initialisation du paiement")
    })
  })

  describe('popup callback integration', () => {
    it('should call onPopupClose callback when provided on artwork payment', async () => {
      const { result } = renderHook(() => usePayment())

      const mockResponse = {
        success: true,
        data: {
          paymentUrl: 'https://paydunya.com/payment/abc123',
          token: 'token-abc123',
          transaction: { id: 'tx-123' },
        },
      }

      paymentService.initArtworkPayment.mockResolvedValueOnce(mockResponse)

      let capturedCallback

      paymentService.openPaymentWindow.mockImplementationOnce((url, callback) => {
        capturedCallback = callback
      })

      const onPopupClose = vi.fn()

      await act(async () => {
        await result.current.payForArtwork('artwork-123', {
          usePopup: true,
          onPopupClose,
        })
      })

      // Simulate popup close callback
      act(() => {
        capturedCallback()
      })

      expect(onPopupClose).toHaveBeenCalledWith('token-abc123', { id: 'tx-123' })
    })

    it('should handle missing onPopupClose gracefully', async () => {
      const { result } = renderHook(() => usePayment())

      const mockResponse = {
        success: true,
        data: {
          paymentUrl: 'https://paydunya.com/payment/abc123',
          token: 'token-abc123',
          transaction: { id: 'tx-123' },
        },
      }

      paymentService.initArtworkPayment.mockResolvedValueOnce(mockResponse)

      let capturedCallback

      paymentService.openPaymentWindow.mockImplementationOnce((url, callback) => {
        capturedCallback = callback
      })

      await act(async () => {
        await result.current.payForArtwork('artwork-123', { usePopup: true })
      })

      // Should not throw when onPopupClose is undefined
      expect(() => {
        capturedCallback()
      }).not.toThrow()
    })
  })
})
