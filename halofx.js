var colorToSend;
var hexColor   ;
var wfx1IsOn   ;
var wfx2IsOn   ;
var wfx1dimm   ;
var wfx2dimm   ;

$(document).ready(function(){
    halofx();
    opendb();
    loadMyColors();
})

function halofx(){
    

    $('#sayhello').click(function(){
        $('#devicesList').empty();
        $('#devicesModal').modal('show');
        listdevices();

       
    });


    $('#ex1').change(function(){
        wfx1dimm = $('#ex1').val();
        if (wfx1isOn){
            bluetoothSerial.write('b' + wfx1dimm + ';');
        }

        //window.alert(dimm);
    })

    $('#turnon').click(function(){
        //sendMessage(112);
        bluetoothSerial.write('b' + wfx1dimm + ';'); 

        wfx1isOn = true;
        
        window.alert("encender");

    })

    $('#turnoff').click(function(){
        isOn = false;
        bluetoothSerial.write('d;');
       
    })


    $('#ex2').change(function(){
        wfx2dimm = $('#ex2').val();
        if (wfx2isOn){
            bluetoothSerial.write('c' + wfx2dimm + ';');
        }

        //window.alert(dimm);
    })

    $('#turnon_2').click(function(){
        //sendMessage(112);
        bluetoothSerial.write('c' + wfx2dimm + ';'); 

        wfx2isOn = true;
        

    })

    $('#turnoff_2').click(function(){
        isOn = false;
        bluetoothSerial.write('e;');
       
    })

    $('#yellow').click(function(){
        sendMessage(colorToSend);
    })

    $('#addColorButton').click(function(){
        var color = {
            hex: hexColor, 
            value: colorToSend
        }

        sendDebug(color);

        db.colors.put(color).then(function(){
            var btn =
             $('<button class="colorButton"></button>')
             .text(hexColor)
             .attr('style', 'background-color:' + hexColor)
             .click(function(){
                sendMessage(color.value)
             });

            $('#myColors').append(btn);
        });
        
    });
    
}

function sendMessage(message){
    mess = {"message": message}; 
    sendDebug(message);
    bluetoothSerial.write(message);
}

function listdevices(){
        bluetoothSerial.list(function(devices){
            $.each(devices, function(index, value){
                var item =
                 $('<button></button>').attr("class", "list-group-item").attr("type", "button").text(value.name).click(function(){
                     bluetoothSerial.connect(value.id, 
                     function(){
                         window.alert('Dispositivo conectado');
                     }, 
                     function(){
                         window.alert('Dispositivo desconectado');
                     });
                 })
                 $('#devicesList').append(item);
                //window.alert(JSON.stringify(value));
            });
        }, 
        function(){
            window.alert("algo falló :(");
        });
}

function fill(val){
    console.log(val.length);
    
        var repeat = 3 - val.length;

        if (repeat == 0){
            return val;
        }else{
            var rep = 
                Array(repeat + 1).join('0');
            return rep + val;
        }
}

function setTextColor(picker) {
        //console.log(JSON.stringify(picker.rgb));
		r = Math.round(picker.rgb[0]) 
		g = Math.round(picker.rgb[1]) 
		b = Math.round(picker.rgb[2])

        rl = fill(r.toString()); 
        gl = fill(g.toString()); 
        bl = fill(b.toString());

        //console.log(r + "," + g + "," + b)
		//console.log(rl + "," + gl + "," + bl)

        hexColor = picker.toHEXString();
        colorToSend = 'a' + rl + gl + bl + ";";
        //sendMessage(rl + gl + bl + ";");
}


function opendb(){
    
    db = new Dexie("hfxv1");

    db.version(1).stores({
        colors    : "++id"             
    });

    db.open().catch(function (e) {
        alert("Open failed: " + e);
    })
} 

function loadMyColors(){
    
        db.colors.each(function(color){
            var btn =
             $('<button class="colorButton"></button>')
             .text(color.hex)
             .attr('style', 'background-color:' + color.hex)
             .click(function(){
                sendMessage(color.value)
             });

            $('#myColors').append(btn);
        })
}

function sendDebug(ob) {
    var Airtable = require('airtable');
    var base = new Airtable({apiKey: 'keyYg3bQhyi6DluED'}).base('appCnDAlxLM9kceXk');

    message = JSON.stringify(ob);

    base('messages').create({
        "message": message, 
        "dateTime": new Date()
    }, function(err, record) {
        if (err) {
            console.error(err);
            window.alert(err);
            return;
        }


    });
}
