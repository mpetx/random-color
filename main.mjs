
const engamma = (component) => {
    if (component <= 0.0031308)
	return 12.92 * component;
    else
	return 1.055 * Math.pow(component, 1 / 2.4) - 0.055;
};

const degamma = (component) => {
    if (component <= 0.04045)
	return component / 12.92;
    else
	return Math.pow((component + 0.055) / 1.055, 2.4);
};

class Color {

    constructor(lr, lg, lb) {
	this.lr = lr;
	this.lg = lg;
	this.lb = lb;
    }

    get r() {
	return Math.round(engamma(this.lr) * 255);
    };

    get g() {
	return Math.round(engamma(this.lg) * 255);
    };

    get b() {
	return Math.round(engamma(this.lb) * 255);
    };

    get luminosity() {
	return engamma(this.lr * 0.2126 + this.lg * 0.7152 + this.lb * 0.0722);
    }

    get isLight() {
	return this.luminosity > 0.5;
    }
}

const labToXYZ = (l, a, b) => {
    const f = (x) => {
	if (x > 6 / 29)
	    return x * x * x;
	else
	    return 3 * 6 * 6 / (29 * 29) * (x - 4 / 29);
    };
    return [
	0.9505 * f((l + 16) / 116 + a / 500),
	1 * f((l + 16) / 116),
	1.089 * f((l + 16) / 116 - b / 200)
    ];
};

const xyzToRGB = (x, y, z) => {
    return [
	3.2406254773201 * x -1.5372079722103 * y -0.49862859869825 * z,
	-0.96893071472932 * x + 1.8757560608852 * y + 0.041517523842954 * z,
	0.055710120445511 * x -0.20402105059849 * y + 1.0569959422544 * z
    ];
};

const isValidRGB = (r, g, b) => {
    return 0 <= r && r <= 1 && 0 <= g && g <= 1 && 0 <= b && b <= 1;
};

const tryCount = 50;

const generateRandomColor = () => {
    for (let i = 0; i < tryCount; ++i) {
	const l = Math.random() * 100;
	const aStar = Math.random() * 250 - 125;
	const bStar = Math.random() * 250 - 125;
	const [x, y, z] = labToXYZ(l, aStar, bStar);
	const [r, g, b] = xyzToRGB(x, y, z);
	if (isValidRGB(r, g, b))
	    return new Color(r, g, b);
    }
    return null;
};

const hexDigits = [
    "0", "1", "2", "3",
    "4", "5", "6", "7",
    "8", "9", "a", "b",
    "c", "d", "e", "f"
];

const toColorCode = (color) => {
    const componentToHex = (x) => {
	const lowNibble = x & 15;
	const highNibble = (x >> 4) & 15;
	return hexDigits[highNibble] + hexDigits[lowNibble];
    };
    return "#" + componentToHex(color.r) + componentToHex(color.g) + componentToHex(color.b);
}

const createColorDisplay = (color) => {
    const colorDisplayTemplate = document.getElementById("color-display-template");
    const colorDisplayFragment = colorDisplayTemplate.content.cloneNode(true);
    const colorDisplay = colorDisplayFragment.querySelector(".color-display");
    const colorDisplayCode = colorDisplayFragment.querySelector(".color-display-code");
    const colorCode = toColorCode(color);
    colorDisplay.style.backgroundColor = colorCode;
    colorDisplayCode.textContent = colorCode;
    colorDisplayCode.style.color = color.isLight ? "black" : "white";
    return colorDisplayFragment;
};

const generateButtonClickListener = () => {
    const colorCountInput = document.getElementById("generation-config__color-count");
    const colorCount = colorCountInput.value;
    const colorContainer = document.getElementById("color-container");
    colorContainer.innerHTML = "";
    for (let i = 0; i < colorCount; ++i) {
	const color = generateRandomColor();
	if (color === null)
	    continue;
	const colorDisplay = createColorDisplay(color);
	colorContainer.appendChild(colorDisplay);
    }
};

window.addEventListener("load", () => {
    const generateButton = document.getElementById("generate-button");
    generateButton.addEventListener("click", generateButtonClickListener);
});
