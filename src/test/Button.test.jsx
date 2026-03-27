import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../components/ui/Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Envoyer</Button>)
    expect(screen.getByText('Envoyer')).toBeInTheDocument()
  })

  it('appelle onClick quand cliqué', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Cliquer</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('est désactivé quand disabled=true', () => {
    render(<Button disabled>Désactivé</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('est désactivé et ne déclenche pas onClick quand loading=true', () => {
    const handleClick = vi.fn()
    render(
      <Button loading onClick={handleClick}>
        Chargement
      </Button>
    )
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    fireEvent.click(btn)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('affiche le spinner quand loading=true', () => {
    render(<Button loading>Chargement</Button>)
    // Le spinner Loader2 est rendu — on vérifie via la classe animate-spin
    expect(screen.getByRole('button').querySelector('.animate-spin')).toBeTruthy()
  })

  it('applique la variante danger', () => {
    render(<Button variant="danger">Supprimer</Button>)
    expect(screen.getByRole('button').className).toContain('bg-red-600')
  })

  it('applique la variante primary par défaut', () => {
    render(<Button>Action</Button>)
    expect(screen.getByRole('button').className).toContain('bg-kcb-or')
  })

  it('applique la taille lg', () => {
    render(<Button size="lg">Grand</Button>)
    expect(screen.getByRole('button').className).toContain('py-3')
  })

  it('applique w-full quand fullWidth=true', () => {
    render(<Button fullWidth>Pleine largeur</Button>)
    expect(screen.getByRole('button').className).toContain('w-full')
  })

  it('utilise le type submit quand spécifié', () => {
    render(<Button type="submit">Soumettre</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })

  it('type button par défaut', () => {
    render(<Button>Bouton</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })
})
