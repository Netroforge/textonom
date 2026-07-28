import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FavoriteButton from './FavoriteButton.vue'

describe('FavoriteButton', () => {
  it('renders a clear inactive state and emits toggle', async () => {
    const wrapper = mount(FavoriteButton, {
      props: {
        active: false,
        itemName: 'JSON Prettify'
      }
    })

    const button = wrapper.get('button')
    expect(button.attributes('aria-label')).toBe('Add JSON Prettify to favorites')
    expect(button.attributes('aria-pressed')).toBe('false')
    expect(button.classes()).not.toContain('favorite-button-active')

    await button.trigger('click')
    expect(wrapper.emitted('toggle')).toHaveLength(1)
  })

  it('renders a filled active state with compact sizing when requested', () => {
    const wrapper = mount(FavoriteButton, {
      props: {
        active: true,
        itemName: 'JSON Prettify',
        compact: true
      }
    })

    const button = wrapper.get('button')
    expect(button.attributes('aria-label')).toBe('Remove JSON Prettify from favorites')
    expect(button.attributes('aria-pressed')).toBe('true')
    expect(button.classes()).toContain('favorite-button-active')
    expect(button.classes()).toContain('favorite-button-compact')
  })
})
