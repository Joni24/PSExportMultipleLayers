// exports all visible layers to png
// todo: missing error handling, settings, better ui

function exportFileToPNG(dest, artBoardIndex)
{
    var file = new File(dest + ".png");

    var pngOpts = new ExportOptionsSaveForWeb; 
    pngOpts.format = SaveDocumentType.PNG
    pngOpts.PNG8 = false; 
    pngOpts.transparency = true; 
    pngOpts.interlaced = false; 
    pngOpts.quality = 100;
    activeDocument.exportDocument(file, ExportType.SAVEFORWEB, pngOpts);
}

function execute()
{
    if (app.documents.length == 0)
    {
        alert('No document open', 'Error');
        return;
    }

    if (app.activeDocument.selection.length == 0)
    {
        alert('Nothing selected', 'Error');
        return;
    }

    var layers = app.activeDocument.artLayers;
    
    var title = "Filename input";
    var fileName = prompt ("Enter output file names:", "", title);
    
    var visibleLayers = [];
    for(i = 0; i <layers.length; i++)
    {
        if(layers[i].visible)
        {
			visibleLayers.push(layers[i]);
        }
    }
    
    for(i = 0; i < visibleLayers.length; i++)
        visibleLayers[i].visible = false;
    
    alert("Total layers: "+layers.length+", visible layers: "+visibleLayers.length+" (getting exported)");
   
    // destination
    var destFolder;

    destFolder = Folder.selectDialog('Select the folder to export to:');    
    
    if(destFolder == null)
    {
        // restore visible layers
        for(i = 0; i < visibleLayers.length; i++)
            visibleLayers[i].visible = true;
        return;
    }

    var win = new Window("window{text:'Progress',bounds:[100,100,400,150],bar:Progressbar{bounds:[20,20,280,31] , value:0,maxvalue:100}};");
    
    win.show();
    var progressDelta = 0;
    var realNumber = 0;
    
	if(visibleLayers.length > 0)
        progressDelta = 100 / visibleLayers.length;
        
    for(i = 0; i < visibleLayers.length; i++)
    {
        var currentLayer = visibleLayers[i];
        currentLayer.visible = true;
        
        win.bar.value = win.bar.value + progressDelta;
        realNumber++;
        exportFileToPNG(destFolder + "/" + fileName + "_" + realNumber);
        
        currentLayer.visible = false;
    }
    
    // restore visible layers
    for(i = 0; i < visibleLayers.length; i++)
		visibleLayers[i].visible = true;
    
	win.close();
    
    alert("Done!");
}

execute();