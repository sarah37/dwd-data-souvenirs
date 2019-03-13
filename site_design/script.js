$(document).ready(function(){
  $("#button-1").click(function(){
    $("#section-1").hide();
    $("#section-2").show();
    $("#nav").show();
  });

  $("#prev-1").click(function(){
    $("#section-1").show();
    $("#section-2").hide();
    $("#nav").hide();
  });

  $("#next-1").click(function(){
    $("#section-2").hide();
    $("#prev-1").hide();
    $("#next-1").hide();

    $("#section-3").show();
    $("#prev-2").show();
    $("#next-2").show();

    document.getElementById("dot-1").style.border = "none";
  });

  $("#prev-2").click(function(){
    $("#section-3").hide();
    $("#prev-2").hide();
    $("#next-2").hide();

    $("#section-2").show();
    $("#prev-1").show();
    $("#next-1").show();

    document.getElementById("dot-1").style.border = "4px solid #141414";
  });

});
