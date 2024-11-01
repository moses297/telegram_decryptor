Java.perform(function() {
    // Function to convert hex string to byte array
    function hexStringToByteArray(hexString) {
        var result = [];
        for (var i = 0; i < hexString.length; i += 2) {
            result.push(parseInt(hexString.substr(i, 2), 16));
        }
        return result;
    }

    // Function to find the Utilities class
    function findUtilitiesClass() {
        var UtilitiesClass = null;
        Java.enumerateLoadedClasses({
            onMatch: function(className) {
                if (className.toLowerCase().includes("utilities")) {
                    console.log("Found potential Utilities class: " + className);
                    var tempClass = Java.use(className);
                    if (tempClass.aesCtrDecryptionByteArray) {
                        console.log("Found aesCtrDecryptionByteArray method in " + className);
                        UtilitiesClass = tempClass;
                    }
                }
            },
            onComplete: function() {}
        });
        return UtilitiesClass;
    }

    // Function to decrypt the data
    function decryptData(encryptedData, keyHex, ivHex) {
        var key = Java.array('byte', hexStringToByteArray(keyHex));
        var iv = Java.array('byte', hexStringToByteArray(ivHex));
        var data = Java.array('byte', encryptedData);

        var UtilitiesClass = findUtilitiesClass();
        if (!UtilitiesClass) {
            console.log("Utilities class not found");
            return;
        }

        try {
            UtilitiesClass.aesCtrDecryptionByteArray(data, key, iv, 0, data.length, 0);
            return data;
        } catch (error) {
            console.log("Error during decryption: " + error);
            return null;
        }
    }

    // Your encrypted file bytes (first 32 bytes shown here, replace with your full file contents)
    var encryptedFileBytes = [
        // Replace these bytes with your actual file contents
        0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00
    ];

    var keyHex = "add_key_in_hex_here";
    var ivHex = "add_iv_in_hex_here"; 

    var decryptedData = decryptData(encryptedFileBytes, keyHex, ivHex);

    if (decryptedData) {
        // Convert decrypted data to a string (assuming it's text)
        var decryptedString = "";
        for (var i = 0; i < decryptedData.length; i++) {
            decryptedString += String.fromCharCode(decryptedData[i]);
        }

        console.log("Decrypted data (first 100 characters):");
        console.log(decryptedString.substring(0, 100));

        // If you want to see the raw bytes instead, uncomment the following:
        // console.log("Decrypted data (first 32 bytes):");
        // console.log(Array.from(decryptedData.slice(0, 32)));
    } else {
        console.log("Decryption failed");
    }
});