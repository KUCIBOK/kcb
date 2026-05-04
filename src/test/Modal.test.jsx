import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Modal, ConfirmDialog } from '../components/ui/Modal'

describe('Modal', () => {
  it("n'affiche rien quand isOpen=false", () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()} title="Test">
        <p>Contenu</p>
      </Modal>
    )
    expect(screen.queryByText('Contenu')).not.toBeInTheDocument()
  })

  it('affiche le contenu quand isOpen=true', () => {
    render(
      <Modal isOpen onClose={vi.fn()} title="Test">
        <p>Contenu modal</p>
      </Modal>
    )
    expect(screen.getByText('Contenu modal')).toBeInTheDocument()
  })

  it('affiche le titre', () => {
    render(
      <Modal isOpen onClose={vi.fn()} title="Mon titre">
        <p>-</p>
      </Modal>
    )
    expect(screen.getByText('Mon titre')).toBeInTheDocument()
  })

  it('appelle onClose au clic sur le bouton de fermeture', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen onClose={onClose} title="Test">
        <p>-</p>
      </Modal>
    )
    fireEvent.click(screen.getByLabelText('Close'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('appelle onClose au clic sur le backdrop', () => {
    const onClose = vi.fn()
    const { container } = render(
      <Modal isOpen onClose={onClose} title="Test">
        <p>-</p>
      </Modal>
    )
    // Le backdrop est le premier div enfant du wrapper
    const backdrop = container.querySelector('[aria-hidden="true"]')
    fireEvent.click(backdrop)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('ne ferme pas au clic backdrop quand closeOnBackdrop=false', () => {
    const onClose = vi.fn()
    const { container } = render(
      <Modal isOpen onClose={onClose} title="Test" closeOnBackdrop={false}>
        <p>-</p>
      </Modal>
    )
    const backdrop = container.querySelector('[aria-hidden="true"]')
    fireEvent.click(backdrop)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('appelle onClose à la touche Escape', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen onClose={onClose} title="Test">
        <p>-</p>
      </Modal>
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("n'appelle pas onClose à Escape quand closeOnEsc=false", () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen onClose={onClose} title="Test" closeOnEsc={false}>
        <p>-</p>
      </Modal>
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).not.toHaveBeenCalled()
  })

  it('affiche le footer quand fourni', () => {
    render(
      <Modal isOpen onClose={vi.fn()} title="Test" footer={<button>Valider</button>}>
        <p>-</p>
      </Modal>
    )
    expect(screen.getByText('Valider')).toBeInTheDocument()
  })

  it('désactive le scroll du body quand ouvert', () => {
    render(
      <Modal isOpen onClose={vi.fn()} title="Test">
        <p>-</p>
      </Modal>
    )
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('restaure le scroll du body à la fermeture', () => {
    const { rerender } = render(
      <Modal isOpen onClose={vi.fn()} title="Test">
        <p>-</p>
      </Modal>
    )
    rerender(
      <Modal isOpen={false} onClose={vi.fn()} title="Test">
        <p>-</p>
      </Modal>
    )
    expect(document.body.style.overflow).toBe('')
  })
})

describe('ConfirmDialog', () => {
  it('affiche le titre et le message', () => {
    render(
      <ConfirmDialog
        isOpen
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Supprimer ?"
        message="Cette action est irréversible."
      />
    )
    expect(screen.getByText('Supprimer ?')).toBeInTheDocument()
    expect(screen.getByText('Cette action est irréversible.')).toBeInTheDocument()
  })

  it('appelle onConfirm et onClose au clic sur Confirmer', () => {
    const onConfirm = vi.fn()
    const onClose = vi.fn()
    render(<ConfirmDialog isOpen onClose={onClose} onConfirm={onConfirm} message="Supprimer ?" />)
    fireEvent.click(screen.getByText('Confirmer'))
    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('appelle onClose au clic sur Annuler', () => {
    const onClose = vi.fn()
    render(<ConfirmDialog isOpen onClose={onClose} onConfirm={vi.fn()} message="Supprimer ?" />)
    fireEvent.click(screen.getByText('Annuler'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('affiche les textes personnalisés pour confirm et cancel', () => {
    render(
      <ConfirmDialog
        isOpen
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        message="-"
        confirmText="Oui, supprimer"
        cancelText="Non, garder"
      />
    )
    expect(screen.getByText('Oui, supprimer')).toBeInTheDocument()
    expect(screen.getByText('Non, garder')).toBeInTheDocument()
  })
})
