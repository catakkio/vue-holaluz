
<template>
  <div class="py-5">
    <!-- <InputComponent v-model="cupsCode" /> -->
    <!-- {{ cupsCode }} -->

    <!-- Search bar component  -->
    <div id="search-bar">
      <label for="cups" class="flex">
        Write your CUPS code to check your status and see the offers available:
      </label>
      <div class="flexbox-container gap-2.5">
        <input
          stype="text"
          name="cups"
          placeholder="Enter your CUPS"
          class="flex-inline input w-full"
          v-model="cupsCode"
          @keyup.enter="search()"
        />
        <button
          class="flex-inline btn btn-primary"
          :disabled="searchBtnDisabled"
          @click="search()"
        >
          Search
        </button>
      </div>
    </div>




  <div v-if="displayedClient" class="pt-3">
            <div class="card">
              <h3>Client info:</h3>
              <p>Full name: {{ displayedClient.full_name }}</p>
              <p>Address: {{ displayedClient.address }} </p>
              <p>Building type: {{ displayedClient.building_type }}</p>
            </div>

            <div v-if="displayedSupplyPoint">
              <div class="card">

                <h3>Client supply point info:</h3>
                <p>Tariff: {{ displayedSupplyPoint.tariff }}</p>
                <p>Invoiced amount: {{ displayedSupplyPoint.invoiced_amount }} €</p>
                <p>Power:

                <ul>
                  <li>P1: {{ displayedSupplyPoint.power?.p1 }}</li>
                  <li>P2: {{ displayedSupplyPoint.power?.p2 }}</li>
                </ul>
                </p>
                <p>Neighbors nº: {{ displayedSupplyPoint.neighbors?.length }}</p>
              </div>

              <div v-if="isClientAllowedToEnrollRooftopRevolution(displayedClient)">
                <div class="card">
                  <h3>Available offer:</h3>
                  <ul>
                    <li v-if="offerAvailableForThedisplayedClient === offersType[0]">Standard offer: standard offer with
                      no discount</li>
                    <li v-if="offerAvailableForThedisplayedClient === offersType[1]">Basic discount: 5% discount
                      {{ displayedSupplyPoint.power?.p2 }}</li>
                    <li v-if="offerAvailableForThedisplayedClient === offersType[2]">Special discount: 12%
                      discount{{ displayedSupplyPoint.power?.p2 }}</li>
                  </ul>
                </div>
              </div>
              <div v-else class="error">
                <p>
                  No offer available for this user
                </p>
              </div>

            </div>
            <div v-else class="error margin-l-4">
              <p>
                Can't find supply point data for this user
              </p>
            </div>
          </div>

    <div v-if="showNoClientFoundError">
      <p class="error margin-l-4">No client found with the CUPS code entered</p>
    </div>



        <hr />
    <p>{{ displayedClient }}</p>
    <hr />
    <p>{{ displayedSupplyPoint }}</p>
    
  </div>
</template>

<script>
import {
  getClientByCupsCode,
  getSupplyPointsByCupsCode,
} from "@/services/ApiService";

export default {
  name: "RooftopRevolution",
  data() {
    return {
      cupsCode: "",
      searchExecuted: false, //indicate if the search has been triggered at least 1 time

      allClients: null,
      displayedClient: null,

      allSupplyPoints: null,
      displayedSupplyPoint: null,

      offersType: ["standard", "basic", "special"], // array of offers available
      displayedOfferAvailableForTheClient: null,

      // searchExecuted: false, //indicate if the search has been triggered at least 1 time
    };
  },
  computed: {
    searchBtnDisabled() {
            return this.cupsCode.length === 0;
    },
    showNoClientFoundError() {
      debugger;
      // return true;
      return !this.displayedClient && this.searchExecuted;
    },
    showNoSupplyPointsFoundError() {
      return !this.displayedSupplyPoint && this.searchExecuted;
    },
  },
  methods: {
    async search() {
      debugger;
            this.displayedClient = await getClientByCupsCode(this.cupsCode);
      this.displayedSupplyPoint = await getSupplyPointsByCupsCode(
        this.cupsCode
      );

      this.searchExecuted = true;
    },
    searchClient() {
      [this.displayedClient, this.allClients] = await getClientByCupsCode(
        this.cupsCode
      );
    },
    searchSupplyPoints() {
      this.displayedSupplyPoint = await getSupplyPointsByCupsCode(
        this.cupsCode
      );
    },

    isClientAllowedToEnrollRooftopRevolution(client) {
      const buildingTypeAllowed = "house"; // building type required to be allowed to get enrolled with the rooftop revolution
      const minNeighborNumber = 1; // neighbor number needed in orter to be allowed to get enrolled with the rooftop revolution

      return (
        client.building_type == buildingTypeAllowed &&
        this.displayedSupplyPoint.neighbors?.length >= minNeighborNumber
      );
    },
    calculateAvailableDiscountsForDisplayedUser() {
      if (
        this.clientToDisplay &&
        this.isClientAllowedToEnrollRooftopRevolution(this.clientToDisplay)
      ) {
        const userNeighborsCapsCodes = this.supplyPointToDisplay?.neighbors;
        let userNeighbors = [];
        userNeighborsCapsCodes.forEach((capsCode) => {
          userNeighbors.push(this.getClientSupplyPointByCupsCode(capsCode));
        });

        if (
          this.userAvailableForSpecialDiscount(
            this.supplyPointToDisplay,
            userNeighbors
          )
        ) {
          this.offerAvailableForTheClientToDisplay = this.offersType[2];
        } else if (
          this.userAvailableForBasicDiscount(
            this.supplyPointToDisplay,
            userNeighbors
          )
        ) {
          this.offerAvailableForTheClientToDisplay = this.offersType[1];
        } else {
          this.offerAvailableForTheClientToDisplay = this.offersType[0];
        }
      } else {
        this.offerAvailableForTheClientToDisplay = null;
      }
    },
    /**
     * Checks if the user is available for a basic discount.
     * To to access the basic discount the userd should have at least 1 neighbor with p1 and p2 power lower than his p1 and p2 power
     * @param {*} userSupplyPoint the supply object of the user on which check the availability of the discount
     * @param {*} neighborsArray the array of neighbors from wich retrieve the power
     */
    userAvailableForBasicDiscount(userSupplyPoint, neighborsArray) {
      if (userSupplyPoint && neighborsArray?.length > 0) {
        const neighborWithLowerPower = Object.values(neighborsArray).find(
          (neighbor) =>
                     neighbor.power?.p1 < userSupplyPoint.power.p1 &&
            neighbor.power?.p2 < userSupplyPoint.power.p2
        );
        const neighborWithLowerPowerFound = neighborWithLowerPower
          ? true
          : false;
        return neighborWithLowerPowerFound;
      }
    },
    /**
     * Checks if the user is available for the special discount.
     * To be able to acces to the special discount the addition of the `invoiced_amount` of its neighbors should be more than 100 euros
     * @param {*} userSupplyPoint the supply object of the user from on which check the availability of the discount
     * @param {*} neighborsArray the array of neighbors from wich calculate the invoice amount
     */
    userAvailableForSpecialDiscount(userSupplyPoint, neighborsArray) {
          if (userSupplyPoint && neighborsArray?.length > 0) {
        const amountToReachTheDiscount = 100;
        const neighborsInvoiceTotalAmount = neighborsArray
          .map((neighbor) => neighbor.invoiced_amount)
          .reduce(
            (totalAmount, neighborAmount) =>
              parseInt(totalAmount) + parseInt(neighborAmount)
          );
        console.log("neighborsInvoiceTotalAmount", neighborsInvoiceTotalAmount);
        return neighborsInvoiceTotalAmount > amountToReachTheDiscount;
      }
    },
  },
};
</script>