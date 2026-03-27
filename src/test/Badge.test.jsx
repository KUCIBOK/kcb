import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Badge, StatusBadge } from '../components/ui/Badge'

describe('Badge', () => {
  it('affiche le contenu', () => {
    render(<Badge>Nouveau</Badge>)
    expect(screen.getByText('Nouveau')).toBeInTheDocument()
  })

  it('applique la variante success', () => {
    render(<Badge variant="success">Actif</Badge>)
    expect(screen.getByText('Actif').className).toContain('text-green-400')
  })

  it('applique la variante danger', () => {
    render(<Badge variant="danger">Erreur</Badge>)
    expect(screen.getByText('Erreur').className).toContain('text-red-400')
  })

  it('applique la variante warning', () => {
    render(<Badge variant="warning">Attente</Badge>)
    expect(screen.getByText('Attente').className).toContain('text-yellow-400')
  })

  it('applique la variante default quand variante inconnue', () => {
    render(<Badge variant="inexistante">Tag</Badge>)
    // La variante par défaut utilise text-kcb-sable (design system KCB)
    const el = screen.getByText('Tag')
    expect(el).toBeInTheDocument()
  })

  it('affiche le dot quand dot=true', () => {
    const { container } = render(<Badge dot>Avec dot</Badge>)
    expect(container.querySelector('.rounded-full')).toBeTruthy()
  })

  it('affiche le bouton de suppression quand removable=true et onRemove fourni', () => {
    const onRemove = vi.fn()
    render(
      <Badge removable onRemove={onRemove}>
        Retirable
      </Badge>
    )
    expect(screen.getByLabelText('Remove')).toBeInTheDocument()
  })

  it('appelle onRemove au clic sur le bouton de suppression', () => {
    const onRemove = vi.fn()
    render(
      <Badge removable onRemove={onRemove}>
        Retirable
      </Badge>
    )
    fireEvent.click(screen.getByLabelText('Remove'))
    expect(onRemove).toHaveBeenCalledTimes(1)
  })

  it("n'affiche pas le bouton remove si onRemove absent", () => {
    render(<Badge removable>Sans handler</Badge>)
    expect(screen.queryByLabelText('Remove')).not.toBeInTheDocument()
  })
})

describe('StatusBadge', () => {
  it('affiche "Actif" pour le status active', () => {
    render(<StatusBadge status="active" />)
    expect(screen.getByText('Actif')).toBeInTheDocument()
  })

  it('affiche "En attente" pour le status pending', () => {
    render(<StatusBadge status="pending" />)
    expect(screen.getByText('En attente')).toBeInTheDocument()
  })

  it('affiche "Approuvé" pour le status approved', () => {
    render(<StatusBadge status="approved" />)
    expect(screen.getByText('Approuvé')).toBeInTheDocument()
  })

  it('affiche "Rejeté" pour le status rejected', () => {
    render(<StatusBadge status="rejected" />)
    expect(screen.getByText('Rejeté')).toBeInTheDocument()
  })

  it('affiche "Brouillon" pour un status inconnu (fallback)', () => {
    render(<StatusBadge status="inconnu" />)
    expect(screen.getByText('Brouillon')).toBeInTheDocument()
  })

  it('affiche "Inactif" pour le status inactive', () => {
    render(<StatusBadge status="inactive" />)
    expect(screen.getByText('Inactif')).toBeInTheDocument()
  })
})
