import { describe, it, expect, vi } from 'vitest'
import { getTransformationPageComponent } from './index'
import GenericTransformationPage from './GenericTransformationPage.vue'
import Base64EncodePage from './Base64EncodePage.vue'
import { getAllTransformations } from '../../transformations/registry'

describe('getTransformationPageComponent', () => {
  it('resolves a page for every registered transformation', () => {
    for (const t of getAllTransformations()) {
      expect(getTransformationPageComponent(t.id), `${t.id} should resolve a page`).toBeTruthy()
    }
  })

  it('never logs a "not found" error for a registered transformation', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    for (const t of getAllTransformations()) {
      getTransformationPageComponent(t.id)
    }
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })

  it('opens the JSON to TOML page, not the Base64 page (regression)', () => {
    const component = getTransformationPageComponent('jsonToToml')
    expect(component).not.toBe(Base64EncodePage)
    expect(component).toBe(GenericTransformationPage)
  })

  it('still resolves bespoke pages for transformations that have them', () => {
    expect(getTransformationPageComponent('base64Encode')).toBe(Base64EncodePage)
  })

  it('falls back to the generic page for an unknown id', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(getTransformationPageComponent('doesNotExist')).toBe(GenericTransformationPage)
    spy.mockRestore()
  })
})
