// Models
let DonationModel = require('../models/donation');

module.exports = {
    async store(ctx) {
        const { body } = ctx.request;

        ctx.checkBody('amount', 'Invalid amount').notEmpty().isInt();
        ctx.checkBody('currency', 'Invalid currency').notEmpty().toString();


        try {

            let errors = await ctx.validationErrors();
            if (errors) throw errors[0].msg;

            // Проверка количества, должно быть больше нуля.
            if (body.amount <= 0) throw 'Amount must be greater than zero';

            // Проверка существования валюты в списке доступных.
            // По хорошему, я бы изначально хранил в базе данных коллекцию валют со всеми характеристиками.
            // Именно их формировал бы на фронте, соответственно и проверку бы не делал по статике.
            // Но так
            let available_currencies = ['USD', 'EUR', 'GBP', 'RUB'];
            if (available_currencies.indexOf(body.currency) === -1)
                throw 'The transferred currency was not found in the list of available';


            // Создание модели.
            let donationModel = new DonationModel(body);
            await donationModel.save()
                .then(donation => {
                    ctx.body = {
                        ok: true,
                        donation: donation
                    };
                });

        } catch (err) {
            ctx.body = {
                ok: false,
                message: err,
            }
        }
    }
};