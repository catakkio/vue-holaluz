
import { mount } from '@vue/test-utils'
import RooftopRevolution from '../../src/pages/RooftopRevolution/RooftopRevolution.vue'

import * as ApiService from "@/services/ApiService";

describe('Rooftop revolution:', () => {

    let wrapper;
    beforeEach(() => {
        wrapper = mount(RooftopRevolution)
        const allSupplyPoints = require('../../src/assets/supply-points');
        const allClients = require('../../src/assets/clients');

        ApiService.fetchSupplyPoints = jest.fn().mockReturnValue(allSupplyPoints)
        ApiService.fetchClients= jest.fn().mockReturnValue(allClients)
    })

    it(`should display an error message if no user has been found`, async () => {
        wrapper.setData({ cupsCode: '00000' })
        await wrapper.vm.search();

        const errormsg = wrapper.get('[id="error-no-client-found"]')
        expect(errormsg).toBeDefined()
    })

    it(`user is allowed to enroll rooftop revolution if his building type is house and it has at least 1 neighbor`,async () => {
        wrapper.setData({ cupsCode: '234567' })
        await wrapper.vm.search();
        const isClientAllowed = wrapper.vm.isClientAllowedToEnrollRooftopRevolution(wrapper.vm.displayedClient)

        expect(wrapper.vm.displayedClient.building_type).toBe('house')
        expect(wrapper.vm.displayedSupplyPoint.neighbors.length).toBeGreaterThanOrEqual(1)
        expect(isClientAllowed).toBeTruthy()
    })

    it(`user not allowed to enroll rooftop revolution if his building type is not house`, async () => {
        wrapper.setData({ cupsCode: '345678' })
        await wrapper.vm.search();

        const isClientAllowed = wrapper.vm.isClientAllowedToEnrollRooftopRevolution(wrapper.vm.displayedClient)
        expect(wrapper.vm.displayedClient.building_type).toBe('apartment')
        expect(isClientAllowed).toBeFalsy()
    })

    it(`user not allowed to enroll rooftop revolution if he has less than 1 neighbors`, async () => {
        wrapper.setData({ cupsCode: '321654' })
        await wrapper.vm.search();

        const isClientAllowed = wrapper.vm.isClientAllowedToEnrollRooftopRevolution(wrapper.vm.displayedClient)
        expect(wrapper.vm.displayedSupplyPoint.neighbors.length).toBeLessThan(1)
        expect(isClientAllowed).toBeFalsy()
    })

    it(`should display an error message if the us not allowed to enroll rooftop revolution `, async () => {
        wrapper.setData({ cupsCode: '321654' })
        await wrapper.vm.search();

        const errormsg = wrapper.get('[id="error-no-offer-available"]')
        expect(errormsg).toBeDefined()
    })

    it(`user has a special discount if the sum of invoiced amount of its neghbors is more than 100€`, async () => {
        wrapper.setData({ cupsCode: '111222' })
        await wrapper.vm.search();

        const neighbors = wrapper.vm.getNeighborsDataFromCupsCode(wrapper.vm.displayedSupplyPoint.neighbors)
        const neighborsInvoiceTotalAmount = wrapper.vm.calculateNeighborsInvoiceTotalAmount(neighbors)
        
        console.log('Client without special discount: neighbors invoice total amount:',neighborsInvoiceTotalAmount)
        expect(neighborsInvoiceTotalAmount>100).toBeTruthy()

        wrapper.vm.calculateAvailableDiscountsForDisplayedUser();
        expect(wrapper.vm.displayedOfferAvailableForTheClient).toEqual(wrapper.vm.offersType.special)
    })

    it(`user has not a special discount if the sum of invoiced amount of its neghbors is less than 100€`, async () => {
        wrapper.setData({ cupsCode: '123456' })

        await wrapper.vm.search();

        const neighbors = wrapper.vm.getNeighborsDataFromCupsCode(wrapper.vm.displayedSupplyPoint.neighbors)
        const neighborsInvoiceTotalAmount = wrapper.vm.calculateNeighborsInvoiceTotalAmount(neighbors)
        
        console.log('Client without special discount: neighbors invoice total amount:',neighborsInvoiceTotalAmount)
        expect(neighborsInvoiceTotalAmount<100).toBeTruthy()

        wrapper.vm.calculateAvailableDiscountsForDisplayedUser();
        expect(wrapper.vm.displayedOfferAvailableForTheClient).not.toEqual(wrapper.vm.offersType.special)
    })


    it(`user has basic discount if its neighbors have p1 and p2 power lower than current client`, async () => { 
        wrapper.setData({ cupsCode: '234567' })
        await wrapper.vm.search();
        
        const neighbors = wrapper.vm.getNeighborsDataFromCupsCode(wrapper.vm.displayedSupplyPoint.neighbors)
        const [p1Neighbor1,p2Neighbor1,p1Neighbor2,p2Neighbor2] = [neighbors[0].power.p1, neighbors[0].power.p2,neighbors[1].power.p1,neighbors[1].power.p2];
        const [p1Client,p2Client] = [wrapper.vm.displayedSupplyPoint.power.p1,wrapper.vm.displayedSupplyPoint.power.p2]
        console.log("Client with basic discount: client power:",p1Client,p2Client,"neighbor 1 power:",p1Neighbor1,p2Neighbor1,"neighbor 2 power:",p1Neighbor2,p2Neighbor2)
        
        wrapper.vm.calculateAvailableDiscountsForDisplayedUser();
        expect(wrapper.vm.displayedOfferAvailableForTheClient).toEqual(wrapper.vm.offersType.basic)
     })

     it(`user has not basic discount if none of its neighbors have p1 and p2 power lower than current client`, async () => { 
        wrapper.setData({ cupsCode: '123456' })
        await wrapper.vm.search();
        
        const neighbors = wrapper.vm.getNeighborsDataFromCupsCode(wrapper.vm.displayedSupplyPoint.neighbors)
        const [p1Neighbor1,p2Neighbor1,p1Neighbor2,p2Neighbor2] = [neighbors[0].power.p1, neighbors[0].power.p2,neighbors[1].power.p1,neighbors[1].power.p2];
        const [p1Client,p2Client] = [wrapper.vm.displayedSupplyPoint.power.p1,wrapper.vm.displayedSupplyPoint.power.p2]
        console.log("Client without basic discount: client power:",p1Client,p2Client,"neighbor 1 power:",p1Neighbor1,p2Neighbor1,"neighbor 2 power:",p1Neighbor2,p2Neighbor2)
        
        wrapper.vm.calculateAvailableDiscountsForDisplayedUser();
        expect(wrapper.vm.displayedOfferAvailableForTheClient).not.toEqual(wrapper.vm.offersType.basic)
     })

})


