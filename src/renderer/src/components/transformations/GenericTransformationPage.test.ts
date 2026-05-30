import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import GenericTransformationPage from './GenericTransformationPage.vue'

const mountPage = (transformationId: string, tabId = 'tab-1') =>
  mount(GenericTransformationPage, { props: { tabId, transformationId } })

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('GenericTransformationPage', () => {
  it('renders the transformation name and description from the registry', () => {
    const wrapper = mountPage('base32Encode')
    expect(wrapper.find('h1').text()).toBe('Base32 Encode')
    expect(wrapper.find('.transformation-description').text()).toContain('Base32')
  })

  it('runs a no-param transformation and shows the output', async () => {
    const wrapper = mountPage('base32Encode')
    await wrapper.find('#input-textarea').setValue('foobar')
    await wrapper.find('.transform-button').trigger('click')
    await flushPromises()

    const output = wrapper.find('#output-textarea').element as HTMLTextAreaElement
    expect(output.value).toBe('MZXW6YTBOI======')
  })

  it('surfaces transformation errors as Error: text', async () => {
    const wrapper = mountPage('base32Decode')
    await wrapper.find('#input-textarea').setValue('0189') // invalid Base32 chars
    await wrapper.find('.transform-button').trigger('click')
    await flushPromises()

    const output = wrapper.find('#output-textarea').element as HTMLTextAreaElement
    expect(output.value).toContain('Error:')
  })

  describe('parameters', () => {
    it('renders a number input for a numeric parameter and applies its default', async () => {
      const wrapper = mountPage('caesarCipher')
      const numberInput = wrapper.find('input[type="number"]')
      expect(numberInput.exists()).toBe(true)
      expect((numberInput.element as HTMLInputElement).value).toBe('3') // metadata default

      await wrapper.find('#input-textarea').setValue('abc')
      await wrapper.find('.transform-button').trigger('click')
      await flushPromises()
      expect((wrapper.find('#output-textarea').element as HTMLTextAreaElement).value).toBe('def')
    })

    it('honours an edited numeric parameter', async () => {
      const wrapper = mountPage('caesarCipher')
      await wrapper.find('input[type="number"]').setValue('1')
      await wrapper.find('#input-textarea').setValue('abc')
      await wrapper.find('.transform-button').trigger('click')
      await flushPromises()
      expect((wrapper.find('#output-textarea').element as HTMLTextAreaElement).value).toBe('bcd')
    })

    it('renders checkboxes for boolean parameters', () => {
      const wrapper = mountPage('tokenGenerate')
      const checkboxes = wrapper.findAll('input[type="checkbox"]')
      // uppercase, lowercase, numbers, symbols
      expect(checkboxes.length).toBe(4)
    })
  })

  describe('generator mode', () => {
    it('hides the input and labels the action button "Generate"', () => {
      const wrapper = mountPage('ulidGenerate')
      expect(wrapper.find('#input-textarea').exists()).toBe(false)
      expect(wrapper.find('.transform-button').text()).toBe('Generate')
    })

    it('produces output without any input', async () => {
      const wrapper = mountPage('ulidGenerate')
      await wrapper.find('.transform-button').trigger('click')
      await flushPromises()
      const output = (wrapper.find('#output-textarea').element as HTMLTextAreaElement).value
      expect(output).toMatch(/^[0-9A-HJKMNP-TV-Z]{26}$/)
    })
  })

  it('shows the regular Transform button and input for non-generators', () => {
    const wrapper = mountPage('jsonToToml')
    expect(wrapper.find('#input-textarea').exists()).toBe(true)
    expect(wrapper.find('.transform-button').text()).toBe('Transform')
  })

  it('persists input, output, and params to the tab content store', async () => {
    const wrapper = mountPage('caesarCipher', 'tab-persist')
    await wrapper.find('#input-textarea').setValue('abc')
    await wrapper.find('.transform-button').trigger('click')
    await flushPromises()

    // A freshly mounted page for the same tab should restore the prior state.
    const reopened = mountPage('caesarCipher', 'tab-persist')
    expect((reopened.find('#input-textarea').element as HTMLTextAreaElement).value).toBe('abc')
    expect((reopened.find('#output-textarea').element as HTMLTextAreaElement).value).toBe('def')
  })
})
