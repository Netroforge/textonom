import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import RegexTesterPage from './RegexTesterPage.vue'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('RegexTesterPage', () => {
  it('finds every match when the user omits the global flag', async () => {
    const wrapper = mount(RegexTesterPage, { props: { tabId: 'non-global' } })

    await wrapper.find('#regex-pattern').setValue('foo')
    await wrapper.find('#regex-flags').setValue('i')
    await wrapper.find('textarea').setValue('Foo foo')

    expect(wrapper.findAll('.match-item')).toHaveLength(2)
    expect(wrapper.find('.match-count').text()).toContain('2 matches')
  })

  it('reports an invalid expression before input text is provided', async () => {
    const wrapper = mount(RegexTesterPage, { props: { tabId: 'invalid' } })

    await wrapper.find('#regex-pattern').setValue('(')

    expect(wrapper.find('.regex-error').text()).toContain('Invalid regular expression')
    expect(wrapper.find('.no-matches').text()).toContain('Fix the regular expression')
  })

  it('renders escaped input while highlighting matches', async () => {
    const wrapper = mount(RegexTesterPage, { props: { tabId: 'escaped' } })

    await wrapper.find('#regex-pattern').setValue('<tag>')
    await wrapper.find('textarea').setValue('<tag>')

    expect(wrapper.find('.live-preview-input mark').text()).toBe('<tag>')
    expect(wrapper.find('.live-preview-input').html()).toContain('&lt;tag&gt;')
  })
})
