import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import EmptyState from './EmptyState.vue'

describe('EmptyState', () => {
  it('renders properly', () => {
    const message = 'test message'
    const wrapper = mount(EmptyState, { props: { message: message } })
    expect(wrapper.text()).toContain(message)
  })
})
