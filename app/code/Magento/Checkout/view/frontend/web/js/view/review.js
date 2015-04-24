/**
 * Copyright © 2015 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
/*browser:true jquery:true*/
/*global define*/
define(
    [
        'uiComponent',
        'Magento_Checkout/js/model/quote',
        'mage/url',
        'Magento_Checkout/js/model/step-navigator',
        'Magento_Checkout/js/action/place-order',
        'underscore'
    ],
    function (Component, quote, url, navigator, orderAction, _) {
        "use strict";
        var stepName = 'review';
        var itemsBefore = [];
        var itemsAfter = [];
        var submitBefore = {};
        return Component.extend({
            defaults: {
                template: 'Magento_Checkout/review'
            },
            stepNumber: navigator.getStepNumber(stepName),
            quoteHasPaymentMethod: quote.getPaymentMethod(),
            itemsBefore: itemsBefore,
            itemsAfter: itemsAfter,
            submitBefore: submitBefore,
            getItems: function() {
                return quote.getTotals()().items;
            },
            getColHeaders: function() {
                return ['name', 'price', 'qty', 'subtotal'];
            },
            isVisible: navigator.isStepVisible(stepName),
            cartUrl: url.build('checkout/cart/'),
            placeOrder: function(callback) {
                var component,
                    isValid = false;
               if (_.isEmpty(this.submitBefore)) {
                   orderAction(null, callback);
               } else {
                   for (component in this.submitBefore) {
                       if (this.submitBefore.hasOwnProperty(component) && !this.submitBefore[component].validate()) {
                           isValid = true;
                       }
                   }
                   if (isValid) {
                       orderAction(this.submitBefore[component].getSubmitParams(), callback);
                   }
               }
            },
            // get recalculated totals when all data set
            getTotals: quote.getTotals()
        });
    }
);
