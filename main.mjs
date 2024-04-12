
class Color {

    constructor(r, g, b) {
	this.r = r;
	this.g = g;
	this.b = b;
    }

    isLight() {
	const luminosity = (this.r + this.g + this.b) / 3;
	return luminosity >= 128;
    }
}

const generateRandomColor = () => {
    return new Color(
	Math.round(Math.random() * 255),
	Math.round(Math.random() * 255),
	Math.round(Math.random() * 255)
    );
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
    colorDisplayCode.style.color = color.isLight() ? "black" : "white";
    return colorDisplayFragment;
};

const generateButtonClickListener = () => {
    const colorCountInput = document.getElementById("generation-config__color-count");
    const colorCount = colorCountInput.value;
    const colorContainer = document.getElementById("color-container");
    colorContainer.innerHTML = "";
    for (let i = 0; i < colorCount; ++i) {
	const color = generateRandomColor();
	const colorDisplay = createColorDisplay(color);
	colorContainer.appendChild(colorDisplay);
    }
};

window.addEventListener("load", () => {
    const generateButton = document.getElementById("generate-button");
    generateButton.addEventListener("click", generateButtonClickListener);
});
