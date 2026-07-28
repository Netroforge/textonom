import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import HomePage from './HomePage.vue'
import { useTabsStore } from '../stores/tabsStore'
import { useTabsContentStore } from '../stores/tabsContentStore'

beforeEach(() => {
  setActivePinia(createPinia())
  window.api = {
    loadState: vi.fn().mockResolvedValue({ success: false }),
    saveState: vi.fn().mockResolvedValue({ success: true }),
    readClipboardText: vi.fn().mockResolvedValue('')
  } as unknown as Window['api']
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: {
      readText: vi.fn().mockResolvedValue(''),
      writeText: vi.fn().mockResolvedValue(undefined)
    }
  })
})

describe('HomePage discovery experience', () => {
  it('filters the catalog to a selected category', async () => {
    const wrapper = mount(HomePage, {
      props: { onTransformationOpened: vi.fn() }
    })

    const formattingFilter = wrapper
      .findAll('.category-filter-button')
      .find((button) => button.text().includes('Formatting'))

    expect(formattingFilter).toBeDefined()
    await formattingFilter!.trigger('click')

    const visibleCategoryTitles = wrapper
      .findAll('.category-section h2')
      .map((heading) => heading.text())

    expect(visibleCategoryTitles).toEqual(['Formatting'])
    expect(wrapper.findAll('.category-section .transformation-card').length).toBeGreaterThan(0)
  })

  it('surfaces recently opened tools as quick actions', () => {
    useTabsStore().addTab('base64Encode')

    const wrapper = mount(HomePage, {
      props: { onTransformationOpened: vi.fn() }
    })

    expect(wrapper.get('#recent-tools-title').text()).toBe('Recent')
    expect(wrapper.get('.quick-card').text()).toContain('Base64 Encode')
  })

  it('provides a useful empty search state that can clear the query', async () => {
    const wrapper = mount(HomePage, {
      props: { onTransformationOpened: vi.fn() }
    })

    await wrapper.get('.search-input').setValue('definitely-not-a-textonom-tool')

    expect(wrapper.get('.no-results h2').text()).toBe('No matching tools')
    await wrapper.get('.clear-results-button').trigger('click')
    expect((wrapper.get('.search-input').element as HTMLInputElement).value).toBe('')
  })

  it('reads the clipboard only on request and ranks matching tools', async () => {
    const readText = vi.fn().mockResolvedValue('{"name":"Textonom","mode":"local"}')
    window.api.readClipboardText = readText

    const wrapper = mount(HomePage, {
      props: { onTransformationOpened: vi.fn() }
    })

    expect(readText).not.toHaveBeenCalled()
    await wrapper.get('.smart-paste-button').trigger('click')
    await flushPromises()

    expect(readText).toHaveBeenCalledOnce()
    expect(wrapper.get('#smart-paste-title').text()).toBe('JSON')
    expect(wrapper.findAll('.smart-suggestion')[0].text()).toContain('JSON Prettify')
  })

  it('opens a Smart Paste suggestion with clipboard input prefilled', async () => {
    const clipboardText = 'SGVsbG8sIFRleHRvbm9tIQ=='
    window.api.readClipboardText = vi.fn().mockResolvedValue(clipboardText)

    const onTransformationOpened = vi.fn()
    const wrapper = mount(HomePage, {
      props: { onTransformationOpened }
    })

    await wrapper.get('.smart-paste-button').trigger('click')
    await flushPromises()
    await wrapper.get('.smart-suggestion').trigger('click')

    const tabsStore = useTabsStore()
    const activeTabId = tabsStore.activeTabId
    expect(tabsStore.tabs.find((tab) => tab.id === activeTabId)?.transformationId).toBe(
      'base64Decode'
    )
    expect(useTabsContentStore().getTabContent(activeTabId!).inputText).toBe(clipboardText)
    expect(onTransformationOpened).toHaveBeenCalledOnce()
  })
})
