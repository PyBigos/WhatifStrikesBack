require(["esri/map",
"esri/geometry/Extent",
"esri/layers/FeatureLayer",
"esri/tasks/query",
"esri/renderers/HeatmapRenderer",
"esri/renderers/ClassBreaksRenderer",
"esri/symbols/SimpleMarkerSymbol",
"esri/symbols/SimpleLineSymbol",
"esri/Color",
	  "esri/tasks/QueryTask",
      "esri/graphic",
      "esri/graphicsUtils",
      "esri/geometry/geometryEngine",
      "esri/geometry/Polyline",
      "esri/geometry/mathUtils",
      "esri/SpatialReference",
	  'dojo/dom',
      'dojo/string',
	  "dojo/dom-construct",
	  'dojo/on',
 "dojo/domReady!"], function(Map,extent,featLayer,query,heatR,ClassBreaksRenderer,
 SimpleMarkerSymbol,SimpleLineSymbol,Color,qTask,Graphic,gutils,ge,polyline,mathUtil,spatRef,dom,dString,domc,on) {
     
        var ext = new extent({"xmin": -13042004.933154235, "ymin": 3856468.7209161334, "xmax": -13041714.711312553, "ymax": 3856629.9552726233,"spatialReference":{"wkid":3857}});
        fUrl = "http://services.arcgis.com/XWaQZrOGjgrsZ6Cu/arcgis/rest/services/Padres_events/FeatureServer/0"
        var hits = new featLayer("https://services7.arcgis.com/Gk8wYdLBgQPxqVZU/arcgis/rest/services/Padres/FeatureServer/0",{
            mode:featLayer.ON_DEMAND
        });
     
        map = new Map("map", {
          basemap: "satellite",  //For full list of pre-defined basemaps, navigate to http://arcg.is/1JVo6Wd
          zoom: 19,
          extent:ext
        });
        var spf = new spatRef(102100);
        
        var line = new SimpleLineSymbol();
        line.setWidth(1.75);
        line.setColor(new Color([85, 255, 0, 1]));
        line.setStyle(SimpleLineSymbol.STYLE_SHORTDASH);
        
        map.addLayer(hits);
        
        //Batter autocomplete
        var question = new query();
		question.outFields = ['first_name','last_name','id'];
		question.where = "1=1";
		
		names = {};//[];
		var counts = {};
		
		var queryBatters = new qTask("http://services.arcgis.com/XWaQZrOGjgrsZ6Cu/arcgis/rest/services/Padres_events/FeatureServer/2");
		queryBatters.execute(question,function(bRes){
			bRes.features.forEach(function(res){
				var fullName = res.attributes["first_name"] + " " + res.attributes["last_name"]
				names[fullName] = res.attributes["id"]//.push(fullName);
			})
			nameArry = Object.keys(names);
			for(var i=0;i<nameArry.length; i++){
                var num = nameArry[i];
                counts[num] = counts[num] ? counts[num]+1 : 1;

            }
			console.log(counts);
			listNames = Object.keys(counts);
			listNames.forEach(function(f){
				var li = domc.create("option", {value:f},l);
			});
			
			
			
		})
		//console.log(names);
		var l = dom.byId("batterlst");
       var ll = dom.byId("batterAuto");
	   on(ll,'change',function(v){
		console.log(v.srcElement.value);
		console.log(names[v.srcElement.value]);
		var batterFilt = "batter = " + names[v.srcElement.value];
		console.log(batterFilt);
        
        var batterLbl = dom.byId("lblBatter");
        batterLbl.innerHTML = v.srcElement.value;
        
		hits.setDefinitionExpression(batterFilt);
	   });
        //end copmlete
        
      //Pitcher Auto  
        var question = new query();
		question.outFields = ['first_name','last_name','id'];
		question.where = "1=1";
		
		names = {};//[];
		var counts = {};
		
		var queryPitchers = new qTask("http://services.arcgis.com/XWaQZrOGjgrsZ6Cu/arcgis/rest/services/Padres_events/FeatureServer/3");
		queryPitchers.execute(question,function(bRes){
			bRes.features.forEach(function(res){
				var fullName = res.attributes["first_name"] + " " + res.attributes["last_name"]
				names[fullName] = res.attributes["id"]//.push(fullName);
			})
			nameArry = Object.keys(names);
			for(var i=0;i<nameArry.length; i++){
                var num = nameArry[i];
                counts[num] = counts[num] ? counts[num]+1 : 1;

            }
			console.log(counts);
			listNames = Object.keys(counts);
			listNames.forEach(function(f){
				var li = domc.create("option", {value:f},l);
			});
			
			
			
		})
		//console.log(names);
		var l = dom.byId("pitcherlst");
       var ll = dom.byId("batterAuto1");
	   on(ll,'change',function(v){
        
        if (hits.getDefinitionExpression()){
            console.log(hits.getDefinitionExpression());
        }   
        
		console.log(v.srcElement.value);
		console.log(names[v.srcElement.value]);
        
        if (hits.getDefinitionExpression()){
            var currentExp = hits.getDefinitionExpression();
            var Pitcherexp = "pitcher = " + names[v.srcElement.value];
            var PitcherFilt = dString.substitute("${currentexp} AND ${pitcherexp}",{currentexp:currentExp,pitcherexp:Pitcherexp});//currentExp.concat(" AND ")
            
        } else{
            var PitcherFilt = "pitcher = " + names[v.srcElement.value];
        }
        
        
		
		//console.log(batterFilt);
        var pitcherLbl = dom.byId("lblPitcher");
        pitcherLbl.innerHTML = v.srcElement.value;
        
		hits.setDefinitionExpression(PitcherFilt);
	   });
        
      //End Pitcher
      //
       
        
      //Heat Renderer
      on(dom.byId("heatRen"),"click",function(e){
          var heatRen = new heatR();
          hits.setRenderer(heatRen);
      })
       
      //Class Breaks
       on(dom.byId("sizeRen"),"click",function(e){
           var marker = new SimpleMarkerSymbol();
           marker.setSize(6);
           marker.setColor(new Color([0, 112, 255, 0.69]));
           
           var marker1 = new SimpleMarkerSymbol();
           marker1.setSize(1);
           marker1.setColor(new Color([255, 255, 255, 0.69]));
           
           var slow1 = new SimpleMarkerSymbol();
           slow1.setSize(10);
           slow1.setColor(new Color([85, 255, 0, 0.69]));
           var slow2 = new SimpleMarkerSymbol();
           slow2.setSize(12);
           slow2.setColor(new Color([230, 230, 0, 0.69]));
           var slow3 = new SimpleMarkerSymbol();
           slow3.setSize(14);
           slow3.setColor(new Color([255, 170, 0, 0.69]));
           var slow4 = new SimpleMarkerSymbol();
           slow4.setSize(18);
           slow4.setColor(new Color([255, 0, 0, 0.69]));
           
          var classrenderer = new ClassBreaksRenderer(marker, "end_speed");
          classrenderer.classificationMethod = "natural-breaks"
          classrenderer.addBreak(0,66,marker1);
          classrenderer.addBreak(66,74.5,slow4);
          classrenderer.addBreak(74.5,81,slow3);
          classrenderer.addBreak(81,89,slow2);
          classrenderer.addBreak(89,93,slow1);
          
          hits.setRenderer(classrenderer);
      })
       
       
       
       
       map.on("mouse-move",function(evt){
            
            if (map.graphics.graphics.length >3){
                map.graphics.clear();
            }
            
            console.log(evt);
            var buff = ge.buffer(evt.mapPoint,50,'feet');
            console.log(buff);
            
            var bCent = buff.getCentroid();
            
            var qParams = new query();
            qParams.geometry = buff;
            
            var davgArry = []
            
             gs = gutils.getGeometries(hits.graphics);
           b = ge.intersect(gs,buff);
            b.forEach(function(d){if(d){
              var pLine = new  polyline(spf);
                    pLine.addPath([bCent,d]);
                    
                    var ln = new Graphic(pLine,line);
                    map.graphics.add(ln);
                    
                   var lng = mathUtil.getLength(bCent,d);
                   davgArry.push(lng);
            }})
            //hits.queryFeatures(qParams,function(p){
                
                /*p.features.forEach(function(feat){
                    var pLine = new  polyline(spf);
                    pLine.addPath([evt.mapPoint,feat.geometry]);
                    
                    var ln = new Graphic(pLine,line);
                    map.graphics.add(ln);
                    
                   var lng = mathUtil.getLength(evt.mapPoint,feat.geometry);
                   davgArry.push(lng);
                   
               // })
                */
                if (davgArry.length > 4){
                var total = davgArry.reduce(function(a,b){
                return a+b;
                    })
                    var dAvg = total/davgArry.length;
                    var avgEle = dom.byId("avgDist");
                    avgEle.innerHTML = dAvg;
                    }
                
            })
            
            
            
        //})
       
       
       
       //test client intersect
       on(dom.byId("threeD"),"click",function(e){
           var davgArry = []
           cent = map.extent.getCenter();
           cBuff = ge.buffer(cent,50,'feet');
           gs = gutils.getGeometries(hits.graphics);
           b = ge.intersect(gs,cBuff);
           console.log(b);
           intRes =[]
           b.forEach(function(d){if(d){
              var pLine = new  polyline(spf);
                    pLine.addPath([cent,d]);
                    
                    var ln = new Graphic(pLine,line);
                    map.graphics.add(ln);
                    
                   var lng = mathUtil.getLength(cent,d);
                   davgArry.push(lng);
            }})
            
            
            
            if (davgArry.length > 4){
                var total = davgArry.reduce(function(a,b){
                return a+b;
                    })
                    var dAvg = total/davgArry.length;
                    var avgEle = dom.byId("avgDist");
                    avgEle.innerHTML = dAvg;
                    }
            
            
            
       })
       
       
       
       
        
      //end require
      });
