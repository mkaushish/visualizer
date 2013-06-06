function graph_pz(canvas, context, fnarr, graph){
  var mousex;         // global mouse position x coord
  var mousey;         // global mouse position y coord
  var downx;          // x coord where the click started
  var downy;          // y coord where the click started
  var mousedown=false;
  $("#"+canvas.id).mouseup(function (e) { 
    mousedown=false;
  });
  $("#"+canvas.id).scroll(function (e) { 

  });
  $('#'+canvas.id).mousedown(function (e) { 
    // downx and y have many uses
    downx = mousex;
    downy = mousey;
    mousedown=true;
  });
  $("#"+canvas.id).mousemove(function (e) { 
    // mousex and mousey are used for many things, and therefore need to be in the
    // global scope.
    var offset = $('#'+canvas.id).offset();
    var offsetx = Math.round(offset.left);
    var offsety = Math.round(offset.top);

    mousex = e.pageX - offsetx; // - offset.left;
    mousey = e.pageY - offsety; // - offset.top;

    if(mousedown){
      if (downx > graph.off){
        graph.movemid(mousex, downx, mousey, downy);
        downx=mousex;
        downy=mousey;
        context.clearRect(0,0,canvas.width, canvas.height);
        graph.draw("dec");
        graph.drawZBar();
      }
      if (downx > 5 && downx < 20 && downy > graph.zbarc-25 && downy < graph.zbarc+25){
        graph.moveZBar(mousey, downy);
        downy=mousey;
        context.clearRect(0, 0, canvas.width, canvas.height);
        graph.drawZBar();
        graph.draw("dec");
      }
      for (w=0; w<fnarr.length; w++){
        context.strokeStyle=(fnarr[w].color);
        graph.drawfnc(fnarr[w]);
        context.strokeStyle="black";
      }
    writeMessage(" ");
    }
    graph.curpos(mousex, mousey);
    if(graph.mode=="trace" && graph.selected!=null){
        context.clearRect(0, 0, canvas.width, canvas.height);
        graph.drawZBar();
        graph.draw("dec");
      for (w=0; w<fnarr.length; w++){
        context.strokeStyle=(fnarr[w].color);
        graph.drawfnc(fnarr[w]);
        context.strokeStyle="black";
      }
      graph.trace(mousex);
    }

    // activate inteGrest points if we are close to them
  });
  function writeMessage(message){
    context.clearRect(0,0,canvas.width,25);
    context.font = "10pt Calibri";
    context.fillStyle = "black";
    context.fillText(message, 10, 20);
  }
}