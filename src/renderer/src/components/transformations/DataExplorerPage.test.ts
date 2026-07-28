import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import DataExplorerPage from './DataExplorerPage.vue'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('DataExplorerPage', () => {
  it.each([
    ['0', '0'],
    ['false', 'false'],
    ['null', 'null']
  ])('renders valid JSON primitive %s', async (input, renderedValue) => {
    const wrapper = mount(DataExplorerPage, { props: { tabId: `primitive-${input}` } })

    await wrapper.find('textarea').setValue(input)

    expect(wrapper.find('.data-explorer-error').exists()).toBe(false)
    expect(wrapper.find('.tree-value').text()).toBe(renderedValue)
    expect(
      (wrapper.findAll<HTMLButtonElement>('.action-button')[0].element as HTMLButtonElement)
        .disabled
    ).toBe(false)
  })

  it('auto-detects a single-line TOML document', async () => {
    const wrapper = mount(DataExplorerPage, { props: { tabId: 'toml' } })

    await wrapper.find('textarea').setValue('title = "Textonom"')

    expect(wrapper.find('.data-explorer-detected').text()).toContain('TOML')
    expect(wrapper.find('.tree-key').text()).toContain('title')
    expect(wrapper.find('.tree-value').text()).toContain('Textonom')
  })

  it('uses bracket notation for keys that are not valid identifiers', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText }
    })
    const wrapper = mount(DataExplorerPage, { props: { tabId: 'paths' } })

    await wrapper.find('textarea').setValue('{"a.b": 1}')
    await wrapper.find('.tree-action-btn').trigger('click')

    expect(writeText).toHaveBeenCalledWith('$["a.b"]')
  })

  it('shows parser errors without rendering a tree', async () => {
    const wrapper = mount(DataExplorerPage, { props: { tabId: 'invalid' } })

    await wrapper.find('textarea').setValue('{')

    expect(wrapper.find('.data-explorer-error').exists()).toBe(true)
    expect(wrapper.find('.tree-node').exists()).toBe(false)
  })

  it('bounds cyclic YAML aliases instead of recursing indefinitely', async () => {
    const wrapper = mount(DataExplorerPage, { props: { tabId: 'cyclic-yaml' } })

    await wrapper.find('textarea').setValue('root: &root\n  self: *root')

    expect(wrapper.find('.data-explorer-error').exists()).toBe(false)
    expect(wrapper.text()).toContain('[Circular]')
  })
})
