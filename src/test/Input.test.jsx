import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '../components/ui/Input'

describe('Input', () => {
  it('affiche le label', () => {
    render(<Input label="Email" />)
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('affiche le placeholder', () => {
    render(<Input placeholder="Entrez votre email" />)
    expect(screen.getByPlaceholderText('Entrez votre email')).toBeInTheDocument()
  })

  it("affiche le message d'erreur", () => {
    render(<Input error="Champ obligatoire" />)
    expect(screen.getByText('Champ obligatoire')).toBeInTheDocument()
  })

  it("affiche le helperText quand pas d'erreur", () => {
    render(<Input helperText="Format: nom@email.com" />)
    expect(screen.getByText('Format: nom@email.com')).toBeInTheDocument()
  })

  it("l'erreur a la priorité sur helperText", () => {
    render(<Input error="Invalide" helperText="Aide" />)
    expect(screen.getByText('Invalide')).toBeInTheDocument()
    expect(screen.queryByText('Aide')).not.toBeInTheDocument()
  })

  it('est désactivé quand disabled=true', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it("affiche l'astérisque rouge quand required=true", () => {
    render(<Input label="Nom" required />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('déclenche onChange', () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('utilise le type password quand spécifié', () => {
    render(<Input type="password" />)
    expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password')
  })

  it("applique une bordure rouge en état d'erreur", () => {
    render(<Input error="Erreur" />)
    expect(screen.getByRole('textbox').className).toContain('border-red-500')
  })

  it('applique une bordure verte en état success', () => {
    render(<Input success />)
    expect(screen.getByRole('textbox').className).toContain('border-green-500')
  })

  it('transmet la ref au input', () => {
    const ref = { current: null }
    render(<Input ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })
})
