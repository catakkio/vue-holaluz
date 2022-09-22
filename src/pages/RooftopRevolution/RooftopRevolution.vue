<template>
 <div class="py-5">

  <SearchBarComponent v-model="cupsCode" />

  <div v-if="displayedClient" class="pt-3">  

    <CardComponent title="Client info:"> 
      <p>Full name: {{ displayedClient.full_name }}</p>
      <p>Address: {{ displayedClient.address }} </p>
      <p>Building type: {{ displayedClient.building_type }}</p>
    </CardComponent>
    

    <CardComponent v-if="displayedSupplyPoint" title="Client supply point info:"> 
      <p>Tariff: {{ displayedSupplyPoint.tariff }}</p>
      <p>Invoiced amount: {{ displayedSupplyPoint.invoiced_amount }} €</p>
      <p>Power:
      <ul>
          <li>P1: {{ displayedSupplyPoint.power?.p1 }}</li>
          <li>P2: {{ displayedSupplyPoint.power?.p2 }}</li>
      </ul>
      </p>
      <p>Neighbors nº: {{ displayedSupplyPoint.neighbors?.length }}</p>
    </CardComponent>
    <div v-else class="error margin-l-4">
      <p>Can't find supply point data for this user</p>
    </div>


    <CardComponent v-if="isClientAllowedToEnrollRooftopRevolution(displayedClient)"  title="Available offer:"> 
      <ul>
        <li v-if="displayedOfferAvailableForTheClient === offersType.standard">Standard offer: standard offer with no discount</li>
        <li v-if="displayedOfferAvailableForTheClient === offersType.basic">Basic discount: 5% discount {{ displayedSupplyPoint.power?.p2 }}</li>
        <li v-if="displayedOfferAvailableForTheClient === offersType.special">Special discount: 12% discount {{ displayedSupplyPoint.power?.p2 }}</li>
      </ul>
    </CardComponent>
    <div v-else class="error"> 
      <p> No offer available for this user </p>
    </div>

  </div>

  <div v-if="showNoClientFoundError">
    <p class="error margin-l-4">No client found with the CUPS code entered</p>
  </div>
   
</div>
</template>

<script>
import {
fetchClients,
fetchSupplyPoints
} from "@/services/ApiService";

import CardComponent from'../../components/Card.vue'
import SearchBarComponent from'./SearchBar.vue'
export default {
  name: "RooftopRevolution",
  data() {
    return {
      cupsCode: "",
      searchExecuted: false, //always true after the search has been triggered for the first time

      allClients: null,
      displayedClient: null,

      allSupplyPoints: null,
      displayedSupplyPoint: null,

      displayedOfferAvailableForTheClient: null,
      offersType:{
        standard:"standard",
        basic:"basic",
        special:"special"
      },
    };
  },
  components:{
    CardComponent,
    SearchBarComponent
  },
  computed: {
    showNoClientFoundError() {
      return !this.displayedClient && this.searchExecuted;
    },
    showNoSupplyPointsFoundError() {
      return !this.displayedSupplyPoint && this.searchExecuted;
    },
  },
  methods: {
    async search() {
      await this.searchClient();
      await this.searchSupplyPoints();
      this.calculateAvailableDiscountsForDisplayedUser();
      this.searchExecuted = true;
    },

    async searchClient() {
      if(!this.allClients) this.allClients = await fetchClients();
      this.displayedClient =  this.findClientByCupsCode(this.allClients,this.cupsCode);
    },

    async searchSupplyPoints() {
      if(!this.allSupplyPoints) this.allSupplyPoints = await fetchSupplyPoints()
      this.displayedSupplyPoint =  this.findSupplyPointByCupsCode(this.allSupplyPoints,this.cupsCode);
    },

    findClientByCupsCode (clients, cupsCode) {
      const matchingClient = Object.values(clients).find((client) => {
        return cupsCode.trim().toUpperCase() == client.cups?.trim().toUpperCase();
      });

      return matchingClient;
    },

    findSupplyPointByCupsCode  (supplyPoints, cupsCode) {
      const matchingSupplyPoint = Object.values(supplyPoints).find((supplyPoint) => 
        supplyPoint.cups?.trim().toUpperCase() == cupsCode.trim().toUpperCase()
      );

      return matchingSupplyPoint;
    },

    isClientAllowedToEnrollRooftopRevolution(client) {
      const buildingTypeNedeed = "house";
      const minNeighborNumber = 1;

      const isClientBuildingTypeMatching = client.building_type === buildingTypeNedeed
      const hasClientEnoughNeighbors = this.displayedSupplyPoint.neighbors?.length >= minNeighborNumber

      return isClientBuildingTypeMatching && hasClientEnoughNeighbors
    },

    calculateAvailableDiscountsForDisplayedUser() {
      if (
        this.displayedClient &&
        this.isClientAllowedToEnrollRooftopRevolution(this.displayedClient)
      ) {
          const userNeighborsCapsCodes = this.displayedSupplyPoint?.neighbors;
          let userNeighbors = [];

          userNeighborsCapsCodes.forEach((capsCode) => {
            userNeighbors.push(this.findSupplyPointByCupsCode(this.allSupplyPoints,capsCode));
          });

          if ( this.userAvailableForSpecialDiscount(this.displayedSupplyPoint, userNeighbors) ) { this.displayedOfferAvailableForTheClient = this.offersType.special; }
          else if ( this.userAvailableForBasicDiscount( this.displayedSupplyPoint, userNeighbors ) ) { this.displayedOfferAvailableForTheClient = this.offersType.basic; }
          else { this.displayedOfferAvailableForTheClient = this.offersType.standard;}

      } else {
        this.displayedOfferAvailableForTheClient = null;
      }
    },
    /**
     * To to access the basic discount the userd should have at least 1 neighbor with p1 and p2 power lower than his p1 and p2 power
     * @param {*} userSupplyPoint the supply of the user on which check the availability of the discount
     * @param {*} neighbors array of neighbors from which retrieve the power
     */
    userAvailableForBasicDiscount(userSupplyPoint, neighbors) {
      if (userSupplyPoint && neighbors?.length > 0) {
        const neighborWithLowerPower = Object.values(neighbors).find(
          (neighbor) =>
            neighbor.power?.p1 < userSupplyPoint.power.p1 &&
            neighbor.power?.p2 < userSupplyPoint.power.p2
        );
        const neighborWithLowerPowerFound = neighborWithLowerPower ? true : false;
        return neighborWithLowerPowerFound;
      }
    },
    /**
     * To be able to acces to the special discount the addition of the `invoiced_amount` of its neighbors should be more than 100 euros
     * @param {*} userSupplyPoint the user supply from which check the availability of the discount
     * @param {*} neighbors array of neighbors from wich calculate the invoice amount
     */
    userAvailableForSpecialDiscount(userSupplyPoint, neighbors) {
      if (userSupplyPoint && neighbors?.length > 0) {
        const amountToReachTheDiscount = 100;
        const neighborsInvoiceTotalAmount = neighbors
          .map((neighbor) => neighbor.invoiced_amount)
          .reduce(
            (totalAmount, neighborAmount) => parseInt(totalAmount) + parseInt(neighborAmount)
          );

        return neighborsInvoiceTotalAmount > amountToReachTheDiscount;
      }
    },
  },
};
</script>