<template>
    <div class="donation-form">
        <form action="" @submit.prevent="submit()">
            <div class="suggestion-list-wrap">
                <ul class="suggestion-list">
                    <li class="suggestion-list-item-wrap" v-for="sug in suggestion_list">
                        <div class="suggestion-list-item" @click="select_preset(sug)" v-bind:class="{ active: suggestion == sug }">
                            <p>{{ current_currency.symbol }}{{ sug.toLocaleString('en-US') }}</p>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="input-suggestion-wrap">
                <div class="input-suggestion">
                    <div class="currency-symbol">
                        {{ current_currency.symbol }}
                    </div>
                    <div class="currency-suggestion-input">
                        <input min="1" step="1" type="number" v-model="suggestion" required>
                    </div>
                    <div class="currency-select">
                        <select @change="change_currency($event)">
                            <option v-for="currency in currencies">{{ currency.code }}</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="button">
                <button>DONATE</button>
            </div>
        </form>
        <div class="completed-box" v-if="completed_box_visible">
            <div class="completed-box-overlay"></div>
            <div class="completed-box-content">
                <p>{{ completed_box_message }}</p>
            </div>
        </div>
    </div>
</template>

<script>

    import Axios from 'axios';

    export default {
        name: "DonationForm",
        data: () => ({
            suggestion: 50,
            current_currency_code: 'USD',
            presets: [50, 100, 200, 1000, 2500, 5000],
            suggestion_list: [],
            completed_box_visible: false,
            completed_box_message: 'Unknown message',
            currencies: [
                {name: "US Dollar", code: "USD", symbol: "$", rate: 1},
                {name: "Euro", code: "EUR", symbol: "€", rate: 0.897597},
                {name: "British Pound", code: "GBP", symbol: "£", rate: 0.81755},
                {name: "Russian Ruble", code: "RUB", symbol: "₽", rate: 63.461993}
            ]
        }),
        methods: {

            // Отправка формы.
            submit() {

                let self = this;
                Axios.post('/donation', {
                    amount: this.suggestion,
                    currency: this.current_currency_code
                })
                .then(function (res) {

                    // Получение валюты.
                    let currency = self.find_currency_by_code(res.data.donation.currency);

                    // Формирование сообщения и его отображение.
                    let message = `Thank you for your donation ${currency.symbol}${res.data.donation.amount} !`;
                    if (!res.data.ok) message = res.data.message;
                    self.visible_message_box(true, message);

                }).catch(function (err) {
                    console.error(err.message);
                    self.visible_message_box(true, err.message);
                });

            },

            // Выбор стоимости из пресета.
            select_preset(preset){
                this.suggestion = preset;
            },

            // Смена текущей валюты.
            change_currency(event) {

                // Получение выбранной валюты.
                let self = this;
                let new_currency = this.find_currency_by_code(event.target.value)

                // Очистка массива текущих предложений.
                this.suggestion_list = [];

                // Перебор прудустановленных предложений и формирование массива текущих.
                this.presets.forEach(function(preset) {

                    // Округление суммы, что бы быть "красивой и логичной".
                    let sum = self.tooltip_amount_formation(preset * new_currency.rate);

                    // Добавление сформированной подсказки в общий пулл.
                    self.suggestion_list.push(sum);

                });

                // Формирование пользовательской цены.
                this.suggestion = Math.round((this.suggestion / this.current_currency.rate) * new_currency.rate);
                this.current_currency_code = new_currency.code;

            },

            // Форматирование суммы.
            tooltip_amount_formation(sum) {

                if (sum < 100) {
                    return Math.ceil(sum / 10) * 10
                } else if (sum < 500) {
                    return Math.ceil(sum / 50) * 50;
                } else if (sum < 1000) {
                    return Math.ceil(sum / 100) * 100;
                } else if (sum < 5000) {
                    return Math.ceil(sum / 500) * 500;
                } else if (sum < 10000) {
                    return Math.ceil(sum / 1000) * 1000;
                } else if (sum < 100000) {
                    return Math.ceil(sum / 5000) * 5000;
                } else if (sum < 1000000) {
                    return Math.ceil(sum / 100000) * 100000;
                }

            },

            // Поиск валюты по коду.
            find_currency_by_code(code) {
                return this.currencies.find(c => c.code === code);
            },

            // Отображение / скрытие всплывающего модального окна сообщения.
            visible_message_box(boo, message = false) {
                if (message && message.length) this.completed_box_message = message;
                this.completed_box_visible = boo;
            }

        },

        created() {

            // Первоначальное формирование предложений.
            // Для предустановленной валюты USD имеются предустановленные значения.
            this.suggestion_list = this.presets.slice(0);
        },

        computed: {

            // Получение текущей валюты.
            current_currency() {
                return this.find_currency_by_code(this.current_currency_code);
            }
        },

        watch: {

            // Автоматическое закрытие уведомления после запроса на сервер.
            completed_box_visible: function(boo) {
                let self = this;

                if (boo) {
                    setTimeout(function() {
                        if (self.completed_box_visible) self.visible_message_box(false);
                    }, 3000);
                }
            }
        }
    }
</script>

<style lang="scss">
    .donation-form {
        position: absolute;
        width: 350px;
        height: 350px;
        -webkit-border-radius: 6px;
        -moz-border-radius: 6px;
        border-radius: 6px;
        border: 1px solid #c5c5c5;
        left: 50%;
        top: 50%;
        padding: 30px;
        background-color: #f5f5f5;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);

        -webkit-box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.15);
        -moz-box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.15);
        box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.15);

        form {
            width: 100%;
            height: 100%;

            .suggestion-list-wrap {
                ul.suggestion-list {
                    margin: 0;
                    padding: 0;
                    list-style: none;

                    display: flex;
                    flex-wrap: wrap;
                    align-content: stretch;
                    height: 100%;

                    li.suggestion-list-item-wrap {
                        width: 33.33%;

                        .suggestion-list-item {
                            margin: 6px;
                            padding: 10px 6px;
                            border-radius: 3px;
                            cursor: pointer;
                            background-color: #fff;

                            -webkit-box-shadow: 0 0 3px 0 rgba(0,0,0,0.42);
                            -moz-box-shadow: 0 0 3px 0 rgba(0,0,0,0.42);
                            box-shadow: 0 0 3px 0 rgba(0,0,0,0.42);
                            transition: .1s;

                            &:hover {
                                background-color: #f3f3f3;
                            }
                            &.active {
                                background-color: #517cc5;
                                color: #fff;

                                -webkit-box-shadow: none;
                                -moz-box-shadow: none;
                                box-shadow: none;
                            }

                            p {
                                margin: 0;
                                font-weight: bold;
                            }

                        }
                    }
                }
            }
            .input-suggestion-wrap {
                position: relative;
                margin: 6px;
                margin-top: 100px;

                .input-suggestion {
                    display: flex;
                    flex-wrap: wrap;
                    /*align-content: center;*/
                    text-align: left;
                    background-color: #fff;
                    -webkit-border-radius: 3px;
                    -moz-border-radius: 3px;
                    border-radius: 3px;
                    padding: 8px 14px;

                    .currency-symbol {
                        position: absolute;
                        font-weight: bold;
                        font-size: 28px;
                        border-right: 1px solid #eae9e9;
                        padding: 0 15px 0 5px;
                    }
                    .currency-suggestion-input {
                        width: 100%;

                        input {
                            border: none;
                            font-size: 30px;
                            font-weight: bold;

                            padding-left: 52px;
                            outline: none;
                            width: 70%;

                            &::-webkit-outer-spin-button,
                            &::-webkit-inner-spin-button {
                                -webkit-appearance: none;
                                margin: 0;
                            }
                        }

                    }
                    .currency-select {
                        position: absolute;
                        right: 0;
                        font-weight: bold;
                        padding: 6px 14px;

                        select {
                            option {}
                        }
                    }
                }
            }

            .button {
                margin: 6px;
                margin-top: 30px;

                button {
                    background-color: #5f91e4;
                    width: 100%;
                    color: #fff;
                    font-weight: bold;
                    font-size: 24px;
                    border: none;
                    border-radius: 3px;
                    padding: 10px;
                    cursor: pointer;
                    transition: .1s;
                    outline: none;

                    &:hover {
                        background-color: #4479d0;
                    }
                }
            }
        }
        .completed-box {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            display: flex;

            .completed-box-overlay {
                position: absolute;
                width: 100%;
                height: 100%;
                background-color: #000;
                border-radius: 4px;
                opacity: 0.3;
                z-index: 1001;
            }
            .completed-box-content {
                background-color: #fff;
                -webkit-border-radius: 3px;
                -moz-border-radius: 3px;
                border-radius: 3px;
                z-index: 1001;
                width: 80%;
                height: 15%;
                padding: 4px 10px;
                margin: auto auto;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }
</style>