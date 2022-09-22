import { mount } from '@vue/test-utils'
import Header from '@/components/Header.vue'

it('Header displays logo', () => {
  const wrapper = mount(Header)
  const logo = wrapper.get('[id="logo"]')

  expect(logo).toBeDefined()
})

