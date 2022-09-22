
import { mount } from '@vue/test-utils'
import RooftopRevolution from '@/components/RooftopRevolution.vue'

describe('Rooftop revolution', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = mount(RooftopRevolution)
    })

    it('should display only the cap search on load', () => { })


    it(`user has special discount
    if the addition of invoiced amount of its neghbors is more than 100€`, () => {

    })


    it(`user has basic discount 
    if its neighbors have p1 and p2 power lower than current client's supply point`, () => { })

    it(`user is allowed to enroll rooftop revolution 
    if the client's building type is house and it has at least 1 neighbor`, () => {

    })

    it('search btn disabled if there are less than 12 characters')
    // it('should', () => { })
})


