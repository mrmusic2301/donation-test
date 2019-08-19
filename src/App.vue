<template>
  <div id="app">
    <h4>Тестовый проект <span>Donation Form</span> для <a href="https://fundraiseup.com">fundraiseup.com</a></h4>
    <DonationForm></DonationForm>
  </div>
</template>

<script>
import DonationForm from './components/DonationForm';
export default {
  name: 'app',
  components: {
    DonationForm
  }
}
</script>

<style lang="scss">
#app {

  h4 {
    span {
      background-color: #e0e0e0;
      padding: 2px 6px;
      -webkit-border-radius: 3px;
      -moz-border-radius: 3px;
      border-radius: 3px;
      color: #1f1f1f;
    }
    a {
      color: #1b1bbb;
      text-decoration: none;
    }
  }


  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
