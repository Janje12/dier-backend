module.exports = (string) => {
    const isRegisterInUpperCase = (symbol) => symbol === symbol.toUpperCase();
    const translit = {
       'a': 'а',
        'b': 'б',
        'c': 'ц',
        'd': 'д',
        'e': 'е',
        'f': 'ф',
        'g': 'г',
        'h': 'х',
        'i': 'и',
        'j': 'ј',
        'k': 'к',
        'l': 'л',
        'm': 'м',
        'n': 'н',
        'o': 'о',
        'p': 'п',
        'q': 'љ',
        'r': 'р',
        's': 'с',
        't': 'т',
        'u': 'у',
        'v': 'в',
        'w': 'њ',
        'x': 'џ',
        'y': 'ѕ',
        'z': 'з',
        'š': 'ш',
        'đ': 'ђ',
        'č': 'ч',
        'ć': 'ћ',
        'ž': 'ж',
        'lj': 'љ',
        'dj': 'ђ',
        'nj': 'њ',
    };

    for (let i = 0, j = string.length; i < j; i++) {
        if (isRegisterInUpperCase(string[i]) && translit[string[i].toLowerCase()]) {
            string = string.replace(string[i], translit[string[i].toLowerCase()].toUpperCase());
        } else if (translit[string[i]]) {
            string = string.replace(string[i], translit[string[i]]);
        }
    }

    return string;
};
