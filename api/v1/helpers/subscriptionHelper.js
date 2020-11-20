const db = require('../../utils/db')
const config = require('../../utils/config')
const dateHelper = require('../../utils/dateHelper')

const stripe = require('stripe')(config.stripe.secret_key);
const promise = require('bluebird');
const userHelperAdmin = require('./userHelperAdmin');
const { toComparators } = require('semver');

class SubscriptionHelper {
    async createCustomer(body, payment_id, profileInfo) {
        let obj = {
            email: body.email,
            name: body.name
        }
        if (profileInfo && profileInfo.address_line && profileInfo.address_line !== null) {
            obj.address = {
                line1: profileInfo.address_line,
                city: profileInfo.city || "",
                postal_code: profileInfo.postal_code || "",
                country: profileInfo.country || ""
            }
            // obj.invoice_settings = {
            //     custom_fields: [{
            //         name: "Address",
            //         value: profileInfo.business_address
            //     }]
            // }
            // obj.shipping = {
            //     address: {
            //         line1: "Street 502",
            //         city: "Ahmedabad",
            //         // postal_code: "380000",
            //         state: "Gujarat",
            //         country: "India"
            //     },
            //     name: body.name
            // }
            // obj.shipping = {
            //     address : {
            //         line1: "Ahmedabad"
            //     },
            //     name: "Paul"
            // }
            // obj.address = {
            //     lin1: "street 502",
            //     city: "Ahmedabad",
            //     postal_code: "230089"
            // }
            // obj.shipping = {
            //     address : {
            //         line1: "Ahmedabad"
            //     },
            //     name: "Paul"
            // }
        }
        let customer = await stripe.customers.create(obj)
        // let customer = await stripe.customers.create({
        //     email: body.email,
        //     name: body.name,
        //     // invoice_settings: {
        //     //     default_payment_method: payment_id,
        //     // },
        //     // source: body.card_token
        // })

        console.log("Customer created by stripe : ", customer)
        await this.createPaymentMethod(customer, payment_id)    // function is attachPaymentMethod
        return customer
        // return customer
        // return {
        // customer,
        // paymentMethod
        // }
    }

    async createPaymentMethod(customer, payment_id) {           // function is attachPaymentMethod
        try {

            // let paymentMethod = await stripe.paymentMethods.create({
            //     type: 'card',
            //     card: {
            //         number: '4242424242424242',
            //         exp_month: 12,
            //         exp_year: 2022,
            //         cvc: '123',
            //     },
            // })
            console.log(payment_id)
            let attachedPaymentMethod = await stripe.paymentMethods.attach(
                payment_id,
                { customer: customer.id }
            );
            // console.log("PaymentMethod created : ", paymentMethod)
            console.log("PaymentMethod atteched : ", attachedPaymentMethod)
            return true
        } catch (error) {
            // if (error.decline_code == "insufficient_funds") {
            //     error = "INSUFFICIANT_FUND"
            // }
            throw error
        }
    }

    createSubscription(customer, plan, payment_id, flag, reactive_flag) {
        let timeAfter30Days = Math.floor(new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)).getTime() / 1000)
        console.log(timeAfter30Days)

        let sub = {
            customer: flag == "new" ? customer.id : customer.customer,
            items: [{ plan: plan.stripe_id }],
            // billing_cycle_anchor: timeAfter30Days,  //put a condition for specific plan activation
            expand: ["latest_invoice.payment_intent"],
            default_payment_method: payment_id,
            trial_end: timeAfter30Days  // update(20-10-2020) : Have to remove this key if user has used this feature before
        }
        if (flag == "old" || reactive_flag == 1) {
            delete sub["trial_end"]
        }
        // if (plan.plan_type !== 3) {
        // sub.billing_cycle_anchor = timeAfter30Days 
        // sub.trial_end = timeAfter30Days
        // }
        console.log("\nSUB :::", sub)
        return new promise((resolve, reject) => {
            stripe.subscriptions.create(sub)
                .then((result) => {
                    console.log("STRIPE SUBSCRIPTION SUCCESS :: ", result)
                    resolve(result)
                })
                .catch((error) => {
                    console.log('Error-------', error)
                    reject('SUBSCRIPTION_FAILED')
                })
        })
    }

    insertCardDetails(body) {
        let data = {
            user_id: body.salon_id,
            stripe_customer_id: body.customer_id,
            stripe_card_token: body.card_token,
            exp_month: body.exp_month,
            exp_year: body.exp_year,
            card_number: body.card_number,
            card_type: body.payment_method,
            created_date: dateHelper.getCurrentTimeStamp(),
            modified_date: dateHelper.getCurrentTimeStamp()
        }
        return db.insert('sba_user_card_details', data)
    }

    getCustomerDetails(customer_id) {
        return new promise((resolve, reject) => {
            let query = `LEFT JOIN sba_mst_users as user ON user.user_id = card.user_id 
        WHERE card.stripe_customer_id = '${customer_id}'`
            let params = `card.user_id, card.stripe_customer_id, card.stripe_card_token, card.exp_month, card. exp_year, 
        card.card_number, card.card_type, user.user_type, user.email_id, user.first_name, user.unique_id, user.subscription_id`
            db.select('sba_user_card_details as card', params, query)
                .then((result) => {
                    resolve(result)
                })
                .catch((error) => {
                    console.log('Error-------', error)
                    reject('CUSTOMER_NOT_FOUND')
                })
        })
    }
    updateExpiryDateOfSalon(body) {
        let data = {
            modified_date: dateHelper.getCurrentTimeStamp(),
            expiry_date: body.expiry_date,
            activation_date: body.activation_date
        }
        let where = `subscription_id = '${body.subscription_id}'`
        return db.update('sba_mst_users', where, data)
    }
    setExpiryDateOfSalon(body, flag) {
        let data = {
            modified_date: dateHelper.getCurrentTimeStamp()
        }
        let where = ''
        if (flag) {
            data.expiry_date = dateHelper.getCurrentTimeStamp()
            where += `subscription_id = ${body.subscription_id}`
        } else {
            data.expiry_date = body.expiry_date
            data.activation_date = body.activation_date
            data.subscription_id = body.subscription_id
            where += `user_id = ${body.salon_id}`
        }
        return db.update('sba_mst_users', where, data)
    }
    retriveSubscription(body) {
        return stripe.subscriptions.retrieve(body.subscription_id);
    }
    deleteSubscription(body) {
        return stripe.subscriptions.del(body.subscription_id);
    }
    updateSubscription(body) {
        return stripe.subscriptions.update(body.subscription_id, { cancel_at_period_end: body.stop_recurring == 0 ? false : true });
    }


    // By Dev

    async getPlans(body) {
        try {
            let plans = await db.select('plans', '*', `subscription_type = ${body.subscription_type} ORDER BY price ASC`)
            if (plans && plans[0]) {
                return plans
            } else {
                return []
            }
        } catch (error) {
            throw error
        }
    }

    async getPlanById(body) {
        try {
            let plan = await db.select('plans', '*', `plan_id = ${body.plan_id}`)
            if (plan && plan[0]) {
                return plan[0]
            } else {
                return {}
            }
        } catch (error) {
            throw error
        }
    }

    async updateUserVideoRequestCounts(user, plan) {
        try {
            // let query = ` UPDATE users SET request_count = request_count + ${plan.requests}, is_plan_activated = 1 WHERE user_id = ${user.user_id} `
            let query = ` UPDATE users SET request_count = ${plan.requests}, is_plan_activated = 1 WHERE user_id = ${user.user_id} `
            await db.custom(query)
            return true
        } catch (error) {
            throw error
        }
    }

    // Added by Dev for Database manipulation

    async addSubscriptionData(subscription, user) {
        try {
            let data = {
                stripe_subscription_id: subscription.id,
                user_id: user.user_id,
                invoice_pdf: subscription.latest_invoice.invoice_pdf,
                amount_due: subscription.latest_invoice.amount_due,
                amount_paid: subscription.latest_invoice.amount_paid,
                default_payment_method: subscription.default_payment_method,
                plan_id: subscription.plan.id,
                current_period_start: subscription.current_period_start,
                current_period_end: subscription.current_period_end,
                customer: subscription.latest_invoice.customer,
                created_date: dateHelper.getCurrentTimeStamp(),
                modified_date: dateHelper.getCurrentTimeStamp()
            }
            await db.insert('subscriptions', data)
            return true
        } catch (error) {
            throw error
        }
    }

    async getUserSubscriptionDetails(user) {
        try {
            let subscription_details = await db.select("subscriptions", '*', `user_id = ${user.user_id} AND status <> 3 ORDER BY subscription_id DESC`)
            if (subscription_details && subscription_details[0]) {
                return subscription_details[0]
            } else {
                return {}
            }
        } catch (error) {
            throw error
        }
    }

    async getInvoices(subscription) {
        try {
            const invoices = await stripe.invoices.list({
                customer: subscription.customer
            });
            console.log(" Invoices for Customer : ", invoices)
            return invoices
        } catch (error) {
            throw error
        }
    }

    async getMyPlan(user) {
        try {
            let plan = await db.select('plans', '*', `plan_id = ${user.plan_id}`)
            return plan[0] || []
        } catch (error) {
            throw error
        }
    }

    async cancelSubscription(user, subscription) {
        try {
            let deleted = await stripe.subscriptions.del(
                subscription.stripe_subscription_id
            );
            let data = {
                status: 3,
                modified_date: dateHelper.getCurrentTimeStamp()
            }

            await db.update('subscriptions', `user_id = ${user.user_id}`, data)
            await db.update('users', `user_id = ${user.user_id}`, {
                is_plan_activated: 0,
                request_count: 0
            })
            return deleted
        } catch (error) {
            throw error
        }
    }

    async pauseSubscription(user, subscription) {
        try {
            let paused = await stripe.subscriptions.update(
                subscription.stripe_subscription_id,
                {
                    pause_collection: {
                        behavior: 'void',
                    },
                }
            );

            let data = {
                status: 2,
                modified_date: dateHelper.getCurrentTimeStamp()
            }
            await db.update('subscriptions', `user_id = ${user.user_id}`, data)

            return paused
        } catch (error) {
            throw error
        }
    }

    async updateSubscriptionPlan(plan, subscription) {
        try {
            let subscription_detials = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id);
            console.log(subscription_detials)
            let updated_plan = await stripe.subscriptions.update(subscription.stripe_subscription_id, {
                cancel_at_period_end: false,
                proration_behavior: 'create_prorations',
                items: [{
                    id: subscription_detials.items.data[0].id,
                    price: plan.stripe_id,
                }]
            });

            console.log(" \nUpdated Plan details : ", updated_plan)
            return updated_plan
        } catch (error) {
            throw error
        }
    }

    async updateSubscriptionPlanInDB(user, subscription, plan) {
        try {
            let data = {
                plan_id: subscription.plan.id,
                stripe_subscription_id: subscription.id,
                status: 1,
                modified_date: dateHelper.getCurrentTimeStamp()
            }

            await db.update('subscriptions', `user_id =${user.user_id}`, data)
            await db.update('users', `user_id =${user.user_id}`, { plan_id: plan.plan_id })
            return true
        } catch (error) {
            throw error
        }
    }

    async resumeSubscriptionPlan(user, subscription) {
        try {
            let sub = await stripe.subscriptions.update(
                subscription.stripe_subscription_id,
                {
                    pause_collection: '',
                }
            );

            let data = {
                status: 1,
                modified_date: dateHelper.getCurrentTimeStamp()
            }
            await db.update('subscriptions', `user_id = ${user.user_id}`, data)

            console.log('\nRESUMED PLAN DETAILS ::', sub)
            return true
        } catch (error) {
            throw error
        }
    }

    async getUserCardDetailsByUserId(user_id) {
        try {
            let card = await db.select('cards', '*', `user_id = ${user_id}`)
            if (card && card[0]) {
                return card[0]
            } else {
                return {}
            }
        } catch (error) {
            throw error
        }
    }

    async addCardDetails(body) {
        try {
            let data = {
                user_id: body.user_id,
                card_name: body.card_name.toUpperCase(),
                card_number: body.card_number,
                ex_date: body.ex_date,
                created_date: dateHelper.getCurrentTimeStamp(),
                modified_date: dateHelper.getCurrentTimeStamp(),
            }

            let card = await db.insert('cards', data)
            return card
        } catch (error) {
            throw error
        }
    }

    async subscriptionHelper(user, plan) {
        try {
            console.log("Hello")
        } catch (error) {
            throw error
        }
    }

    // Below APIs are for testing purpose only 

    async testUpdateAttechedPaymentMethod(customer, body) {
        try {

            console.log(customer)

            // let attachedPaymentMethod = await stripe.paymentMethods.attach(
            //     'pm_1HeEsqLbfMCQUgd3hk0HvYTG',
            //     { customer: customer.customer }
            // );
            // console.log("\nPaymentMethod atteched : ", attachedPaymentMethod)

            const paymentMethods = await stripe.paymentMethods.list({
                customer: customer.customer,
                type: 'card',
            });
            console.log("\npaymentMethods : ", paymentMethods)

            const oldcustomer = await stripe.customers.update(
                customer.customer,
                {
                    invoice_settings: {
                        default_payment_method: 'pm_1HeEsqLbfMCQUgd3hk0HvYTG',
                    }
                }
            );

            console.log("Updated customer : ", oldcustomer)

            return true
        } catch (error) {
            throw error
        }
    }

    async getUserByCustomerId(customer) {
        try {
            let user = {}, obj = {}
            let subscription = await db.select('subscriptions', '*', `customer = '${customer}' ORDER BY subscription_id DESC`)

            if (subscription && subscription[0]) {
                user = await userHelperAdmin.getUserById(subscription[0].user_id)
                obj = {
                    stripe_subscription_id: subscription[0].stripe_subscription_id,
                    subscription_id: subscription[0].subscription_id,
                    default_payment_method: subscription[0].default_payment_method,
                    stripe_plan_id: subscription[0].stripe_plan_id,
                    customer: subscription[0].customer,
                    status: subscription[0].status,
                    payment_status: subscription[0].payment_status,
                }
            }
            console.log('USER IS FETCHED FROM WEBHOOK')
            return { ...user, ...obj }
        } catch (error) {
            throw error
        }
    }

    async getCancelledSubscriptionDetails(body) {
        try {
            let subscription_details = await db.select("subscriptions", '*', `user_id = ${body.user_id} ORDER BY subscription_id DESC LIMIT 1`)
            if (subscription_details && subscription_details[0]) {
                return subscription_details[0]
            } else {
                return {}
            }
        } catch (error) {
            throw error
        }
    }

    async updateUserVideoRequestCountsOnWebhook(user, plan) {
        try {
            let query = ` UPDATE users SET request_count = request_count + ${plan.requests}, is_plan_activated = 1 WHERE user_id = ${user.user_id} `
            // let query = ` UPDATE users SET request_count = ${plan.requests}, is_plan_activated = 1 WHERE user_id = ${user.user_id} `
            await db.custom(query)
            return true
        } catch (error) {
            throw error
        }
    }

    async updateAttechedPaymentMethod(customer, body) {
        try {

            console.log(customer)
            let attachedPaymentMethod = await stripe.paymentMethods.attach(
                body.payment_id,
                { customer: customer.customer }
            );
            console.log("\nPaymentMethod atteched : ", attachedPaymentMethod)

            // const paymentMethods = await stripe.paymentMethods.list({
            //     customer: customer.customer,
            //     type: 'card',
            // });
            // console.log("\npaymentMethods : ", paymentMethods)

            let oldcustomer = await stripe.customers.update(
                customer.customer,
                {
                    invoice_settings: {
                        default_payment_method: body.payment_id,
                    }
                }
            );
            console.log("Updated customer : ", oldcustomer)
            return true
        } catch (error) {
            throw error
        }
    }

    async updateCardDetails(body) {
        try {
            let data = {
                card_name: body.card_name.toUpperCase(),
                card_number: body.card_number,
                ex_date: body.ex_date,
                modified_date: dateHelper.getCurrentTimeStamp(),
            }

            let card = await db.update('cards', `user_id = ${body.user_id}`, data)
            return card
        } catch (error) {
            throw error
        }
    }

    async removeCardDetails(user) {
        try {
            await db.delete("cards", `user_id = ${user.user_id}`)
            return true
        } catch (error) {
            throw error
        }
    }

    async updateUserAddress(subscription, profile) {
        try {
            let customer = await stripe.customers.update(
                subscription.customer,
                {
                    address: {
                        line1: profile.address_line,
                        city: profile.city || "",
                        country: profile.country || "",
                        postal_code: profile.postal_code || "",
                    }

                    // invoice_settings: {
                    //     custom_fields: [{
                    //         name: "Address",
                    //         value: profile.business_address
                    //     }]
                    // },
                    // shipping: {
                    //     address: {
                    //         line1: profile.business_address
                    //     },
                    //     name: "Ankit"
                    // }
                })
            return customer
        } catch (error) {
            throw error
        }
    }

    async updateSubscriptionStatus(user) {
        try {
            let data = {
                payment_status: 2,
                status: 2
            }
            await db.update("subscriptions", ` subscription_id = ${user.subscription_id}`, data)
            return true
        } catch (error) {
            throw error
        }
    }

    async getUserSubscriptionDetailsOnFail(user) {
        try {
            let subscription_details = await db.select("subscriptions", '*', `user_id = ${user.user_id} AND status = 3 AND payment_status = 2 ORDER BY subscription_id DESC`)
            if (subscription_details && subscription_details[0]) {
                return subscription_details[0]
            } else {
                return {}
            }
        } catch (error) {
            throw error
        }
    }

    async getUserSubscriptionDetailsLatest(user) {
        try {
            let subscription_details = await db.select("subscriptions", '*', `user_id = ${user.user_id} ORDER BY subscription_id DESC`)
            if (subscription_details && subscription_details[0]) {
                return subscription_details[0]
            } else {
                return {}
            }
        } catch (error) {
            throw error
        }
    }

    async updateSubscriptionStatusAfterFailComplete(user) {
        try {
            let data = {
                payment_status: 0,
                // status: 2
            }
            await db.update("subscriptions", ` user_id = ${user.user_id}`, data)
            return true
        } catch (error) {
            throw error
        }
    }

    async attachPayMethod(sub, body) {
        try {
            let attachedPaymentMethod = await stripe.paymentMethods.attach(
                body.payment_id,
                { customer: sub.customer }
            );
        } catch (error) {
            throw error
        }
    }

    async getUserSubscriptionDetailsForPlanScreen(user) {
        try {
            let subscription_details = await db.select("subscriptions", '*', `user_id = ${user.user_id} ORDER BY subscription_id DESC`)
            if (subscription_details && subscription_details[0]) {
                return subscription_details[0]
            } else {
                return {}
            }
        } catch (error) {
            throw error
        }
    }
}
module.exports = new SubscriptionHelper()
