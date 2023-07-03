/**
 * This class component 
 * used for generating a simple random color for css as HEX format
 * */
export default class RandomColor{
    private static HEX_LENGTH = 6;
    private static PREFIX_CSS = '#';
    private static HEX = [
        '0', '1', '2', '3',
        '4', '5', '6', '7',
        '8', '9', 'A', 'B',
        'C', 'D', 'E', 'F'
    ];
    private static OPACITY_IN_HEX = '14';

    /**
     * Returns the randomColor
     * */
    static get() {
        return RandomColor.generateColor();
    } 

    /**
     * Generates random color with HEX format for CSS
     * @param length
     */
    private static generateColor() {
        let output = "";
        for (let lengthIndex = 0; lengthIndex < RandomColor.HEX_LENGTH; lengthIndex++) {
            output += RandomColor.HEX[Math.round(Math.random() * RandomColor.HEX.length)];
        }
        return RandomColor.PREFIX_CSS + output + RandomColor.OPACITY_IN_HEX;
    }
}