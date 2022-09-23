
<template>
  <div id="search-bar">
    <label for="cups" class="flex"> Write your CUPS code to check your status and see the offers available: </label>

    <div class="flexbox-container gap-2.5">
      <input 
        type="text" 
        name="cups" 
        id="cups"
        placeholder="Enter your CUPS" 
        class="flex-inline input w-full" 
        :value="modelValue" 
        @input="$emit('update:modelValue',$event.target.value)"
        @keyup.enter="search()" 
       />

      <button 
        id ="searchBtn"
        class="flex-inline btn btn-primary" 
        :disabled="searchBtnDisabled" 
        @click="search()">
        Search
      </button>

    </div>
  </div>
</template>

<script>
export default {
  name: "RooftopSearchBar",
    props:{
      modelValue:{
        type:String,
        default:''
      }
    },
  computed:{
    searchBtnDisabled() {
      return this.modelValue?.length === 0;
    }
  },
  methods: {
    search(){
       this.$parent.search();
    }
  },
};
</script>

<style></style>
