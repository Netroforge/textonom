import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import TabBar from './TabBar.vue'
import { useHistoryStore } from '../stores/historyStore'
import { useTabsStore } from '../stores/tabsStore'

beforeEach(() => {
  setActivePinia(createPinia())
  window.api = {
    loadState: vi.fn().mockResolvedValue({ success: false }),
    saveState: vi.fn().mockResolvedValue({ success: true })
  } as unknown as Window['api']
})

describe('TabBar keyboard navigation', () => {
  it('moves backward exactly once for the previous-tab shortcut', async () => {
    const tabsStore = useTabsStore()
    tabsStore.addTab('base64Encode')
    const firstTabId = tabsStore.activeTabId
    tabsStore.addTab('base64Decode')
    const secondTabId = tabsStore.activeTabId

    const wrapper = mount(TabBar, {
      props: {
        isHomeActive: false,
        onShowHome: vi.fn(),
        onHideHome: vi.fn()
      }
    })

    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', ctrlKey: true, shiftKey: true })
    )
    expect(tabsStore.activeTabId).toBe(firstTabId)

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', ctrlKey: true }))
    expect(tabsStore.activeTabId).toBe(secondTabId)

    wrapper.unmount()
  })

  it('records every opened transformation in recent history', () => {
    const tabsStore = useTabsStore()
    const historyStore = useHistoryStore()

    tabsStore.addTab('dataExplorer')
    tabsStore.addTab('regexTester')

    expect(historyStore.state.history.map((entry) => entry.transformationId)).toEqual([
      'regexTester',
      'dataExplorer'
    ])
  })

  it('keeps the tab context menu inside the window bounds', async () => {
    const widthSpy = vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(500)
    const heightSpy = vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(400)
    const tabsStore = useTabsStore()
    tabsStore.addTab('base64Encode')

    const wrapper = mount(TabBar, {
      props: {
        isHomeActive: false,
        onShowHome: vi.fn(),
        onHideHome: vi.fn()
      }
    })

    await wrapper.get('.tab').trigger('contextmenu', { clientX: 499, clientY: 399 })

    const menuStyle = wrapper.get('.tab-context-menu').attributes('style')
    expect(menuStyle).toContain('left: 292px')
    expect(menuStyle).toContain('top: 236px')

    widthSpy.mockRestore()
    heightSpy.mockRestore()
    wrapper.unmount()
  })
})
