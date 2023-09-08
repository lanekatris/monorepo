// function onScanSuccess(decodedText, decodedResult) {
//   // handle the scanned code as you like, for example:
//   console.log(`Code matched = ${decodedText}`, decodedResult);
// }
//
// function onScanFailure(error) {
//   // handle scan failure, usually better to ignore and keep scanning.
//   // for example:
//   console.warn(`Code scan error = ${error}`);
// }
//
// let html5QrcodeScanner = new Html5QrcodeScanner(
//   "reader",
//   { fps: 10, qrbox: {width: 250, height: 250}, formatsToSupport: [Html5QrcodeSupportedFormats.UPC_A,
//       Html5QrcodeSupportedFormats.UPC_E,
//       Html5QrcodeSupportedFormats.UPC_EAN_EXTENSION,],
//   supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_FILE,]},
//   /* verbose= */ false);
// html5QrcodeScanner.render(onScanSuccess, onScanFailure);

$("input[type=file]").on("change", function(e) {
  if (e.target.files && e.target.files.length) {
    const idk = URL.createObjectURL(e.target.files[0])
    Quagga.decodeSingle({
      inputStream: {
        size: 800,
        singleChannel: false
      },
      locator: {
        patchSize: "medium",
        halfSample: true
      },
      decoder: {
        readers: [
          {
            format: "code_128_reader",
            config: {}
          },
          {
            format: 'ean_reader',
            config: {
              supplements: [
                'ean_8_reader',
                'ean_2_reader'
              ]
            }
          },
          {format: 'upc_reader', config: {}},
          {format: 'upc_e_reader', config: {}}
        ]
      },
      locate: true,
      src:idk
    }, r=>{
console.log('rrrr', r)
    })
  }
});

Quagga.onProcessed(result => {
  console.log('onprocessed', result)
})

Quagga.onDetected(result => {
  console.log('ondetected', result)
})
