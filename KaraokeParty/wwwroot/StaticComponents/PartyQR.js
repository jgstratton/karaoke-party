const PartyQR = function (options) {
    let element;

    this.Update = (settings) => {
        if (element) {
            element.remove();
        }
        if (!settings.qrCodeEnabled) {
            return;
        }
        element = document.createElement('div');
        element.style.position = "fixed";
        element.style.bottom = 0;
        element.style.right = 0;
        element.style.borderWidth = "4px";
        element.style.borderColor = "white";
        element.style.borderStyle = "solid";

        document.body.appendChild(element);
        new QRCode(element, {
            text: `${window.location.protocol}//${window.location.host}?partyKey=${options.partyKey}`,
            width: settings.qrCodeSize,
            height: settings.qrCodeSize
        });
    };
};
