$(document).ready(function () {
    // form variables with id 
    // var mauticForm = $('#mauticform_bciblwpleadform')
    var mobileInputID = $('input#mauticform_input_sipsehoga_mobile_number');
    var mobileDivId = $('div#mauticform_sipsehoga_mobile_number');
    var mobileSuccessclass = $('div#mauticform_sipsehoga_mobile_number .mauticform-errormsg');
    var mobileSuccessMsg = ('Text Message With OTP is shared on your mobile number. Please check!');
    var formSubmitBtn = $('.mauticform-button')
    var leadSourceId = $('#mauticform_input_sipsehoga_lead_source');
    var utmMediumId = $('#mauticform_input_sipsehoga_utm_medium');
    var utmCampaignId = $('#mauticform_input_sipsehoga_utm_campaign');
    var utmSourceId = $('#mauticform_input_sipsehoga_utm_source');
    var firstNameId = $('#mauticform_input_sipsehoga_full_name');
    // var pincodeId = $('#mauticform_input_bciblwpleadform_pincode');

    // form variables with id 

    // DO NOT CHANGE BELOW CODE
    var support_div = mobileInputID;
    $(`<div id="sendotp" class='sendotp'><button type="button" id="send_otp" class="btn">Generate OTP</button></div>`).insertAfter(support_div);

    var support_div2 = mobileDivId;
    $(`<div class="mauticform-row mauticform-tel mauticform-field-3 mauticform-required otpdiv" id="otpdiv">
    <label class="mauticform-label">OTP</label>
    <input id="mauticform_mobile_otp_label" name="mauticform[mobile]" value="" placeholder="Enter your OTP here" pattern="[0-9]{1}[0-9]{9}" minlength="6" maxlength="6" class="mauticform-input" type="tel" disabled="true"/><div class="editnumberbox position-relative"><button class="editnumber btn" id="editnumber" disabled>Resend</button></div><span class="mauticform-errormsg" style="display: none;">This field is mandatory</span></div><div class="continue-div"><span class="spams">No Spams, promise!</span><a class="continue btn" id="continue2">Continue</a><a class="continue btn d-none" disabled id="continue">Continue</a></div>`).insertAfter(support_div2);

    var otpFieldId = $('input#mauticform_mobile_otp_label');

    var mauticformBtnWrapper = $('.mauticform-button-wrapper');
    $(`<div class="mauticform-row mauticform-checkboxgrp"><span class="notetext">So your nearest BajajCapital branch can reach out to you</span></div>`).insertBefore(mauticformBtnWrapper);

    var otpdiv = $('#otpdiv');
    var otpdivErrorDiv = $('#otpdiv .mauticform-errormsg');
    var editnumber = $('#editnumber');
    // $(otpdiv).css({ "top": "-80px", "right": "-100%" });
    // $(mauticform_bciblwpleadform).css({ "overflow": "auto", "overflow-x": "hidden" });
    // $(mauticform_bciblwpleadform).attr('autocomplete', 'off');
    // $(editnumber).click(function () {
    //     $(otpdiv).animate({ "opacity": "hide", right: "-400" }, 1000);
    //     $(mobileDivId).animate({ top: "0" }, 1000);
    //     $(mobileDivId).animate({ "opacity": "show", right: "0" }, 1000);
    //     // $(mobileDivId).animate({ "opacity": "show", right: "0" }, 5000);
    // })
    // DO NOT CHANGE ABOVE CODE


    // otp validation code 
    $(formSubmitBtn).attr('disabled', true);
    $(mobileInputID).on('change', function () {
        $('#send_otp').attr('disabled', false);
    });
    var otp_string = '';

    $('#send_otp').on('click', function (e) {
        $(this).attr('disabled')
        $(otpFieldId).attr('disabled', false);

        $(formSubmitBtn).attr('disabled', true);
        e.preventDefault();
        var enableSubmit = function (ele) {
            $(ele).attr('disabled', false);
        }
        setTimeout(function () {
            enableSubmit('#send_otp')
        }, 60000);
        var mobile = $(mobileInputID).val();
        var otpcode = $(otpFieldId).val();
        if (mobile == '') {
            $(mobileSuccessclass).show();
            $(mobileSuccessclass).text('Please Add Mobile Number');

            return false;
        }
        if (mobile == 0) {
            $(mobileSuccessclass).show();
            $(mobileSuccessclass).text('Please Add Proper Mobile Number Not A Zeroes');
            return false;
        }
        console.log(mobile);
        if (mobile.length !== 10) {
            $(mobileSuccessclass).show();
            $(mobileSuccessclass).text('Please Add 10 Digit Mobile Number');
            return false;
        } else {
            $(mobileSuccessclass).show();
            $(mobileSuccessclass).addClass('text-success');
            $(mobileSuccessclass).text(mobileSuccessMsg);
            // $(otpdiv).css('top', '0')

            $.ajax({
                method: "GET",
                url: "https://uatcrm.bajajcapital.com/index.php?entryPoint=otpdynamic&sender=ONEBAJ&action=sendOTP&mobile_no=" + mobile,
                success: function (result) {
                    if (result.result == 'success') {
                        otp_string = result.OTP;
                        // $(mobileDivId).animate({ "opacity": "hide", right: "100" }, 500);
                        // $(otpdiv).animate({ top: "0" }, 500);
                        // $(otpdiv).animate({ "opacity": "show", right: "0" }, 1000);
                        // $(mobileDivId).animate({ "opacity": "hide", top: "-80" }, 1200);
                        $('#send_otp').attr('disabled', 'true');
                        $('#editnumber').removeAttr('disabled');
                    }
                },
                error: function (result) {
                    console.log(result);
                }
            });
        }
    });
    $('#editnumber').on('click', function (e) {
        $(this).attr('disabled')
        $(otpFieldId).attr('disabled', false);

        $(formSubmitBtn).attr('disabled', true);
        e.preventDefault();
        var enableSubmit = function (ele) {
            $(ele).attr('disabled', false);
        }
        setTimeout(function () {
            enableSubmit('#send_otp')
        }, 60000);
        var mobile = $(mobileInputID).val();
        var otpcode = $(otpFieldId).val();
        if (mobile == '') {
            $(mobileSuccessclass).show();
            $(mobileSuccessclass).text('Please Add Mobile Number');

            return false;
        }
        if (mobile == 0) {
            $(mobileSuccessclass).show();
            $(mobileSuccessclass).text('Please Add Proper Mobile Number Not A Zeroes');
            return false;
        }
        console.log(mobile);
        if (mobile.length !== 10) {
            $(mobileSuccessclass).show();
            $(mobileSuccessclass).text('Please Add 10 Digit Mobile Number');
            return false;
        } else {
            $(mobileSuccessclass).show();
            $(mobileSuccessclass).addClass('text-success');
            $(mobileSuccessclass).text(mobileSuccessMsg);
            // $(otpdiv).css('top', '0')

            $.ajax({
                method: "GET",
                url: "https://uatcrm.bajajcapital.com/index.php?entryPoint=otpdynamic&sender=ONEBAJ&action=sendOTP&mobile_no=" + mobile,
                success: function (result) {
                    if (result.result == 'success') {
                    }
                },
                error: function (result) {
                    console.log(result);
                }
            });
        }
    });

    function verifyOtpNew() {
        var otpcode = $(otpFieldId).val();
        var mobile = $(mobileInputID).val();
        if (otpcode == '') {
            $(otpdivErrorDiv).show();
            $(otpdivErrorDiv).text('Please Enter The OTP');
            return false;
        }
        if (otp_string == otpcode) {
            $(formSubmitBtn).attr('disabled', false);
            $(otpdivErrorDiv).show();
            $(otpdivErrorDiv).addClass('text-success');
            $(otpdivErrorDiv).text('OTP Verified successfully.');
            $('#send_otp').attr('disabled', true);
            $(editnumber).attr('disabled', true);
            $(otpFieldId).attr('disabled', true);
            $(mobileInputID).attr('readonly', true);
            $('#continue2').hide();
            $('#continue').removeClass('d-none');

        } else if (otp_string != '' && (otp_string != otpcode)) {
            $(otpdivErrorDiv).show();
            $(otpdivErrorDiv).text('OTP is incorrect.');
            $(formSubmitBtn).attr('disabled', true);
            $(otpFieldId).attr('disabled', false);

        } else if (otp_string == '') {
            $(otpdivErrorDiv).show();
            $(otpdivErrorDiv).text('OTP is Expired.');
            $('#send_otp').removeAttr('disabled', true);
        }
    }

    $(otpFieldId).on("keypress keyup", function () {
        var input_string = $(this).val()
        if (!input_string.match(/^[0-9]+$/)) {
            $(this).val('')
        }
        if (input_string.length > 5) {
            verifyOtpNew()
        }
        else {
        }
    });

    $(mobileInputID).on("keypress keyup", function () {
        if ($(this).val() == '0') {
            $(this).val('');
        }
        if ($(this).val() == '1') {
            $(this).val('');
        }
        if ($(this).val() == '2') {
            $(this).val('');
        }
        if ($(this).val() == '3') {
            $(this).val('');
        }
        if ($(this).val() == '4') {
            $(this).val('');
        }
        if ($(this).val() == '5') {
            $(this).val('');
        }
    });

    $(mobileInputID).on("keypress keyup", function () {
        var input_string = $(this).val()
        if (!input_string.match(/^[0-9]+$/)) {
            $(this).val('')

        }
    });

    // otp validation code 

    // SUBMIT BUTTON THANK YOU MSG
    function getText() {
        if ($(formSubmitBtn).text() == 'Please wait...') {
            $('.form .thankyou').css({ "visibility": "visible", "opacity": "1" })
        }
        else {
        }
    }
    $(formSubmitBtn).click(function () {
        setTimeout(() => {
            getText()
        }, 300)
    })
    // SUBMIT BUTTON THANK YOU MSG


    // FIRST NAME VALIDATION - DO NOT CHANGE OR UPDATE HERE 
    $(firstNameId).keypress(function (event) {
        var inputValue = event.charCode;
        if ((inputValue >= 33 && inputValue <= 64 || inputValue >= 91 && inputValue <= 96 || inputValue >= 123 && inputValue <= 126)) {
            event.preventDefault();
        }
    });
    // FIRST NAME VALIDATION - DO NOT CHANGE OR UPDATE HERE 

    // PINCODE VALIDATION - DO NOT CHANGE OR UPDATE HERE 
    // $(pincodeId).attr('type', 'tel');
    // $(pincodeId).attr('minlength', '6');
    // $(pincodeId).attr('maxlength', '6');
    // $(pincodeId).on("keypress keyup", function (event) {
    //     if ($(this).val() == '0') {
    //         $(this).val('');
    //     }
    // });
    // PINCODE VALIDATION - DO NOT CHANGE OR UPDATE HERE 

    // URL PARAMETERS FOR FETCHING THE VALUE via URL - DO NOT CHANGE OR UPDATE HERE
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const lead_Source = urlParams.get('lead_source');
    const utm_Medium = urlParams.get('utm_medium');
    const utm_Campaign = urlParams.get('utm_campaign');
    const utm_Source = urlParams.get('utm_source');

    if (!lead_Source) {
        $(leadSourceId).val('website');
    } else {
        $(leadSourceId).val(lead_Source);
    }

    if (!utm_Medium) {
        $(utmMediumId).val('website');
    } else {
        $(utmMediumId).val(utm_Medium);
    }

    if (!utm_Source) {
        $(utmSourceId).val('website');
    } else {
        $(utmSourceId).val(utm_Source);
    }

    $(utmCampaignId).val(utm_Campaign);

    // URL PARAMETERS FOR FETCHING THE VALUE via URL - DO NOT CHANGE OR UPDATE HERE

    // swiper slider  

    var swiper = new Swiper(".mySwiper", {
        slidesPerView: 1,
        spaceBetween: 10,
        allowTouchMove: false,
        navigation: {
            nextEl: "#continue",
        },
    });

    $('#continue').click(function () {
        $('.statusBar').css('width', '100%');
    })

});


document.cookie = "mautic_session_id" + "=;expires=" + new Date().toUTCString() + ";path=/";
document.cookie = "mtc_sid" + "=;expires=" + new Date().toUTCString() + ";path=/";
document.cookie = "mtc_id" + "=;expires=" + new Date().toUTCString() + ";path=/";
document.cookie = "mautic_referer_id" + "=;expires=" + new Date().toUTCString() + ";path=/";
document.cookie = "mautic_device_id" + "=;expires=" + new Date().toUTCString() + ";path=/";
