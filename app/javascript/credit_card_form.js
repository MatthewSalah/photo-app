$(document).on('ready turbolinks:load', function() {
    var show_error, stripeResponseHandler, submitHandler;

    // Function to handle form submission
    submitHandler = function(event) {
        var $form = $(event.target);
        $form.find("input[type=submit]").prop("disabled", true);
        
        // If Stripe was initialized correctly, this will create a token using the credit card info
        if (Stripe) {
            Stripe.card.createToken($form, stripeResponseHandler);
        } else {        
            show_error("Failed to load credit card processing functionality. Please reload this page in your browser.");
        }
        return false;
    };

    // Ensure the correct selector is used for the form submission
    $(".cc_form").on('submit', submitHandler);

    // Handle the Stripe response
    stripeResponseHandler = function(status, response) {
        var token, $form;
        $form = $('.cc_form');

        if (response.error) {
            console.log(response.error.message);
            show_error(response.error.message);
            $form.find("input[type=submit]").prop("disabled", false);
        } else {
            token = response.id;
            // Append the token to the form
            $form.append($("<input type='hidden' name='payment[token]' />").val(token));
            // Remove sensitive data fields
            $("[data-stripe=number]").remove();
            $("[data-stripe=cvc]").remove();
            $("[data-stripe=exp-year]").remove();
            $("[data-stripe=exp-month]").remove();
            $("[data-stripe=label]").remove();
            // Submit the form
            $form.get(0).submit();
        }

        return false;
    };

    // Function to display error messages
    show_error = function(message) {
        if ($("#flash-messages").length < 1) {
            $('div.container.main div:first').prepend("<div id='flash-messages'></div>");
        }
        $("#flash-messages").html('<div class="alert alert-warning"><a class="close" data-dismiss="alert">×</a><div id="flash_alert">' + message + '</div></div>');
        $('.alert').delay(5000).fadeOut(3000);
        return false;
    };
});
