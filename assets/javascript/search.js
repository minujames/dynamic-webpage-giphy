$(document).ready(function () {
  
    var baseUrl =  "https://api.giphy.com/v1/gifs/search";
    var apiKeyValue = "dc6zaTOxFJmzC";
    var imageLimit = 10;

    var initialAnimalList = ["Cat", "Dog", "Tiger", "Lion", "Parrot", "Zebra", "Rabbit"];
    var animalList = Array.from(initialAnimalList);

    function initialize(){
        animalList.reverse().forEach(function(animal){
            addNewAnimal(animal);
        });
    }

    $("#addAnimalForm").on("submit", function(event){
        event.preventDefault();

        var animalInputField = $("#addAnimalInput");
        var animalName = animalInputField.val().trim();
        if(animalName){
            animalInputField.val('');
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

    function addNewAnimal(animalName){
        var listItem = $("<li>");
        var anchorTag = $("<a>");
        anchorTag.attr("href", "#");
        anchorTag.attr("data-animal", animalName);
        anchorTag.text(animalName);
        listItem.append(anchorTag);

        var button = $("<button>");
        button.addClass("remove");
        button.attr("data-name", animalName);
        button.text("X");
        listItem.prepend(button);

        $("ul.components").prepend(listItem);
    }

    $("ul.components").on("click", "li", function(event){
        $("#error-msg-div").hide();
        event.preventDefault();

        $(this).siblings().removeClass("active");
        $(this).addClass("active");
        var animal = $(this).find('a').attr('data-animal')

        $.ajax({
        url: baseUrl ,
        method: "GET",
        data: jQuery.param({api_key: apiKeyValue, limit: imageLimit, q: animal}),
        }).done(function(response){
            if(response.data && response.data.length){
                displayImages(response.data);    
            }
            else{
                $("#gif-images").empty();
                $("#error-message").html("No images to display!");
                $("#error-msg-div").show();
            }
        });
    });

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

    function displayImages(result){
        $("#gif-images").empty();
        for(var i=0; i< result.length; i++){
            var animalDiv = $("<div>");
            animalDiv.addClass("animal-image-div");
          
            var pWrapper = $("<div>");
            pWrapper.addClass("pWrapper");
            var p = $("<p>");
            p.text("Rating: " + result[i].rating);
            p.addClass("rating");
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