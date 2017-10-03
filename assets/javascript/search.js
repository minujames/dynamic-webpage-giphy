$(document).ready(function () {
  
    var baseUrl =  "https://api.giphy.com/v1/gifs/search";
    var apiKeyValue = "dc6zaTOxFJmzC";
    var imageLimit = 10;
    var ratingValue = "pg";

    var initialAnimalList = ["Cat", "Dog", "Tiger", "Lion", "Parrot", "Zebra", "Rabbit"];
    var animalList = Array.from(initialAnimalList);

    // Function to populate initial animal names
    function initialize(){
        animalList.reverse().forEach(function(animal){
            addNewAnimal(animal);
        });
    }

    // Helper method to check if an item exists in an array
    function isAlreadyAdded(newAnimalName){
        var isPresent = false;
        for (var i=0; i<animalList.length; i++){
            if(animalList[i].toLowerCase() === newAnimalName.toLowerCase()){
                isPresent = true;
                break;
            }
        }
        return isPresent;
    }

    // Helper method to add a new list item to the page corresponding to the newly added animal.
    function addNewAnimal(animalName){
        var listItem = $("<li>");
        listItem.attr("data-animal", animalName);
        
        var anchorTag = $("<a>");
        anchorTag.attr("href", "#");
        anchorTag.text(animalName);

        var icon = $("<i>");
        icon.addClass("glyphicon");
        icon.addClass("glyphicon-remove");
        icon.addClass("remove");

        listItem.append(icon);
        listItem.append(anchorTag);

        $("ul.components").prepend(listItem);
    }
 
    // Helper method to populate images retrieved from the ajax call.
    function displayImages(result){
        $("#gif-images").empty();
        for(var i=0; i< result.length; i++){
            var animalDiv = $("<div>");
            animalDiv.addClass("animal-image-div");
          
            var pWrapper = $("<div>");
            pWrapper.addClass("pWrapper");
            var p = $("<p>");
            p.text("Rating: ");

            var span = $("<span>");
            span.text(result[i].rating);
            span.addClass("rating");
            p.append(span);

            pWrapper.append(p);
            
            var stillImageUrl = result[i].images.fixed_height_still.url;
            var animateImageUrl = result[i].images.fixed_height.url;
            var animalImage = $("<img>");
            animalImage.attr("src", stillImageUrl);
            animalImage.attr("data-still", stillImageUrl);
            animalImage.attr("data-animate", animateImageUrl);
            animalImage.attr("data-state", "still");
            animalImage.addClass("animal-img");

            animalDiv.append(pWrapper);
            animalDiv.append(animalImage);

            $("#gif-images").prepend(animalDiv);
        }
    }

    // Event listener for form submit. This is for adding a new animal.
    $("#addAnimalForm").on("submit", function(event){
        event.preventDefault();

        var animalInputField = $("#addAnimalInput");
        var animalName = animalInputField.val().trim();
        if(animalName){
            animalInputField.val('');
            // Displays an error message if the animal already exists.
            if(isAlreadyAdded(animalName)){
                $("#error-message").html("You have already added <b>" + animalName + "</b>!");
                $("#error-msg-div").show();
            }
            else{
                $("#error-msg-div").hide();
                animalList.push(animalName);
                addNewAnimal(animalName);
            }
        }
    });

    // Event listener for animal list item click. 
    // This will trigger an ajax call to get the animal images.
    $("ul.components").on("click", "li", function(event){
        $("#error-msg-div").hide();
        event.preventDefault();

        $(this).siblings().removeClass("active");
        $(this).addClass("active");
        var animal = $(this).attr('data-animal');

        $.ajax({
        url: baseUrl ,
        method: "GET",
        data: jQuery.param({api_key: apiKeyValue, limit: imageLimit, q: animal, rating: ratingValue}),
        }).done(function(response){
            // Checking whether the ajax call returned any images.
            // Displaying error message if the response does not contain any image.
            if(response.data && response.data.length){
                displayImages(response.data);    
            }
            else{
                $("#gif-images").empty();
                $("#error-message").html("No image to display! Please use a valid animal name.");
                $("#error-msg-div").show();
            }
        });
    });

    // Event handler for mouse enter on animal name.
    // This is to show remove symbol on each item on mouse enter.
    $("ul.components").on("mouseenter", "li", function(event){
        $(this).find('i').show();
        $(this).find('a').addClass("leftMargin");
        $(this).css( 'cursor', 'pointer' );
    });

    // Event handler for mouse leave on animal name.
    // This is to remove the styles added in mouse enter event.
    $("ul.components").on("mouseleave", "li", function(event){
        $(this).find('i').hide();
        $(this).find('a').removeClass("leftMargin");
        $(this).css( 'cursor', 'default' );
    });

    // Event hander for remove animal.
    $("ul.components").on("click", "li i", function(event){
        event.preventDefault();
        event.stopPropagation();
        var animalName = $(this).parent().attr("data-animal");
        var result = confirm("Are you sure want to delete "+ animalName + "?");
        if(result){
            $(this).parent().remove();
            var animalIndex = animalList.indexOf(animalName);
            animalList.splice(animalIndex, 1);
            if($(this).parent().hasClass("active")){
                $("#gif-images").empty();
            }
        }
    });

    // Event handler for on click of an image. 
    // This will play the gif on one click and stops the animation in next click.
    $("#gif-images").on("click", ".animal-img", function(){
        $("#error-msg-div").hide();
        event.preventDefault();

        var state = $(this).attr("data-state");
        if(state === 'still'){
          var dataAnimate = $(this).attr("data-animate");
          $(this).attr("src", dataAnimate);
          $(this).attr("data-state", 'animate')

        }else if(state === 'animate'){
          var dataStill = $(this).attr("data-still");
          $(this).attr("src", dataStill);
          $(this).attr("data-state", 'still');
        }
    });

    // Functions providing scroll feature
    $("#sidebar").niceScroll({
        cursorcolor: '#53619d',
        cursorwidth: 4,
        cursorborder: 'none'
    });

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar, #content').toggleClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });

    initialize();

 });