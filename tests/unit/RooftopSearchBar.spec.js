import { mount } from '@vue/test-utils'
import RooftopSearchBar from '../../src/pages/RooftopRevolution/RooftopSearchBar.vue'


describe('Rooftop searchbar',()=>{
    
    it('disables the searchbutton only if the input is empty', ()=>{
        const wrapper = mount(RooftopSearchBar)
        
        const inputValue = wrapper.find('#cups').element.value
        expect(inputValue).toBe('')
        
        const searchBtn = wrapper.get('[id="searchBtn"]')
        expect(searchBtn.attributes().disabled).toBeDefined()
    })
    
    it('searchbutton is enabled only if the input is filled', ()=>{
        const wrapper = mount(RooftopSearchBar,{
            data() {
                return {
                  modelValue: '123'
                }
              }
          })
        const inputValue = wrapper.find('#cups').element.value
        expect(inputValue).toBe('123')

        const searchBtn = wrapper.get('[id="searchBtn"]')
        expect(searchBtn.attributes().disabled).not.toBeDefined()
    })

})
