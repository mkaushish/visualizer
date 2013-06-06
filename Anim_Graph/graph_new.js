function graph_new(cname){
  COLOR=["#049cdb", "#46a546", "#9d261d", "#f89406", "#c3325f", "#7a43b6", "#ffc40d"];
  ccolor=new Array();
  for (var a=0; a<COLOR.length; a++){
    ccolor[a]=false;
  }
	var canvas = $('#'+cname)[0];
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight-50;
  $("#fninp").css("width", ""+window.innerWidth-100+"px");
  var context = canvas.getContext('2d');
  var mousex;         // global mouse position x coord
  var mousey;         // global mouse position y coord
  var downx;          // x coord where the click started
  var downy;          // y coord where the click started
  var mousedown=false;
  selected=null;
  graph_outline=new graph_out(canvas, context);
  fnarr=[];
  graph_pz(canvas, context, fnarr, graph_outline.graph)
  $('#fninp').keypress(function(e){
    if(e.keyCode==13){
      fff=new fnc($('#fninp').val());
      if(fff.parse!=false){
        fff.color=freeColor();
        fnarr.push(fff);
        fnarr[fnarr.length-1].html="<div class=shape style=\"background-color:"+fnarr[fnarr.length-1].color+";\" id=s_"+(fnarr.length)+" >\nf(x)="+fnarr[fnarr.length-1].exp;  
        fnarr[fnarr.length-1].html+="\n<i class=\"icon-remove-sign icon-white deleteb\" id=delete_"+(fnarr.length)+"></i>\n";
        fnarr[fnarr.length-1].html+="</div>\n";
        $("#curves").append(fnarr[fnarr.length-1].html);
        $("#s_"+fnarr.length).click({w:fnarr.length}, function(e){
          if(selected!=e.data.w){
            selected=e.data.w;
            graph_outline.graph.selected=fnarr[e.data.w-1];
            $("#s_0").css("background-color", fnarr[e.data.w-1].color);
            $("#s_0").text("f(x)="+fnarr[e.data.w-1].exp);
          }
          else{
            selected=null;
            graph_outline.graph.selected=null;
            $("#s_0").css("background-color", "gray");
            $("#s_0").text("select");
          }
          $(".shape").hide();
          $("#s_0").show();
          shapeshow=false;
        });
        if(!shapeshow) {$("#s_"+(fnarr.length)).hide();}
        graph_outline.graph.drawfnc(fnarr[fnarr.length-1]);
        context.clearRect(0,0,context.width, 25);
        context.clearRect(0,context.height-25, context.width, 25);
        writeMessageDown("");
        writeMessage("");
      }
    }
}); 
$("#animate").click(function(){
  ct=0;
  setInterval(function(){animate(ct)}, 20)
});
function animate(ss){
  ct++;
  for (ip=0; ip<fnarr.length; ip++){
    graph_outline.graph.drawfnc(fnarr[ip], Math.sin(ss));
  }
}
  $(window).resize(function(){
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight-50;
    $("#fninp").css("width", ""+window.innerWidth-100+"px");
    context = canvas.getContext('2d');
    graph_outline.graph.draw("dec");
    graph_outline.graph.drawZBar();
    for (w=0; w<fnarr.length; w++){
      context.strokeStyle=(fnarr[w].color);
      graph_outline.graph.drawfnc(fnarr[w]);
      context.strokeStyle="black";
    }
  });
  function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
      color += letters[Math.round(Math.random() * 15)];
    }
    return color;
  }

  function freeColor(){
    var cl="";
    for( var a=0; a<ccolor.length; a++){
      if(!ccolor[a]) {
        cl=COLOR[a];
        ccolor[a]=true;
        break;
      }
    }
    if(cl==""){
      COLOR.push(get_random_color());
      cl=COLOR[COLOR.length-1];
      ccolor[a]=true;
    }
    return cl;
  }
  shapeshow=false;
  $("#s_0").click(function(){
    if(shapeshow){
      $(".shape").hide();
      $("#s_0").show();
      shapeshow=false;
    }
    else{
      $(".shape").show();
      shapeshow=true;
    }
  });
  $(".shape").hide();
  $("#s_0").show();
  selected=null;

  function writeMessageDown(message){
    context.clearRect(0,canvas.height-25,canvas.width,25);
    context.font = "10pt Calibri";
    context.fillStyle = "black";
    context.fillText(message, 10, 20);
  }
  function writeMessage(message) {
    context.clearRect(0, 0, canvas.width, 25);
    context.font = "10pt Calibri";
    context.fillStyle = "black";
    context.fillText(message, 10, 20);
  }
}