var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
require('dotenv').config()
const axios = require('axios')
var usb = require('usb')
var Buffers = require('buffers');
var bufs = Buffers();


let tokens = ""
var nfcBuffs = ''
var buffsCount = 0
var keymap = {'04':'A','05':'B','06':'C','07':'D','08':'E','09':'F','0a':'G','0b':'H','0c':'I','0d':'J','0e':'K','0f':'L','10':'M','11':'N','12':'O','13':'P','14':'Q','15':'R','16':'S','17':'T','18':'U','19':'V','1a':'W','1b':'X','1c':'Y','1d':'Z','1e':'1','1f':'2','20':'3','21':'4','22':'5','23':'6','24':'7','25':'8','26':'9','27':'0','00':'','36':','}
var dev = {}
let value_reader = {}
var dev2 = {}

term = usb.findByIds(process.env.vID, process.env.pID);

term.open();

var endpoints = term.interfaces[0].endpoints,
inEndpoint = endpoints[0],
outEndpoint = endpoints[1];

// term.claim()
// console.log(endpoints)
inEndpoint.transferType = 2;
// console.log(inEndpoint)
term.interfaces[0].claim()

inEndpoint.startPoll(1, 8);

inEndpoint.on('data', function (data) {
    buffsCount+=1
    
    var nfcBuf = Buffer.from([data[2]]);
    nfcBuffs += keymap[nfcBuf.toString('hex')]

    //console.log(data)

    if(nfcBuffs !== undefined){
        if (buffsCount == 34) {  // when the buffer is in the right lenght do something with it
            value_reader = nfcBuffs.split('u')[0]
            console.log('result reader '+nfcBuffs.split('u')[0]) 
            //console.log(searchGlobals(value_reader))
            // io.emit("result_reader", value_reader)
            //searchGlobals(value_reader)
            nfcBuffs = '' // and reset counter/buffer
            buffsCount = 0
            //console.log('token '+ await storage.getItem('token'));
        }

        //https://github.com/tessel/node-usb/issues/223
    }
});
inEndpoint.on('error', function (error) {
    console.log("on error", error);
});

inEndpoint.on('end', function () {
    console.log("on end");
});


// function connectdevice(vID, pId){
//     var device = usb.findByIds(vID, pId);
//     device.open();
//     var deviceINTF=device.interface(0);
    
//     // if (deviceINTF.isKernelDriverActive())
//     //     deviceINTF.detachKernelDriver();
//     deviceINTF.claim();
    
    
//     var ePs = deviceINTF.endpoints;
//     //console.log(ePs)
//     var epIN;
//     ePs.forEach(ep => {
//         if(ep.direction=="in"){
//             epIN=ep;
//         }
//     });
    

//     if(epIN){
//         epIN.on('data', function (data) {
//             //alert("1"+data);
//             console.log("1"+data)
//         });
//         epIN.transferType = 2;
//         // alert("non empty port : "+epIN);
//         console.log("non empty port : "+epIN)
//         epIN.transfer(10, function(error, data) {
//             console.log(error, data);
//             // var nfcBuf = Buffer.from(data);
//             // console.log("Datanya "+ nfcBuf)
//         });
//         // alert("after transfer");
//         console.log("after transfer")
//     }else{
//         // alert("unable to read ..");
//         console.log("unable to read ..")
//     }

//     //https://stackoverflow.com/questions/43773745/reading-from-usb-device-using-node-usb
// }

// connectdevice(0x13BA,0x0018)


http.listen(4700, () => {
    console.log('listening on awe : 4700');
});