//Big integer là một module của npm (node package manager) cho phép xử lý các kiểu dữ liệu số nguyên lớn, nếu dùng kiểu integer thông thường thì đối với các số nguyên tố lớn sẽ không thể xử lý và bị tràn số, trả về Infinity, vì thế cần phải có một thư viện hỗ trợ làm việc này. Thư viện có cung cấp các phương thức, thuộc tính hỗ trợ trong quá trình tính toán.
const bigInteger = require ('big-integer')

//Hàm tính modulo của a mũ b mod p một cách hiệu quả
function modulo (a, b, p) {
    //Ép kiểu về kiểu big integer để đảm bảo tính đúng đắn của dữ liệu đầu vào
    a = bigInteger(a)
    b = bigInteger(b)
    p = bigInteger(p)

    let result = bigInteger.one; //Khởi tạo kết quả ban đầu là 1 để lưu kết quả của phép tính mũ
    a = a.mod(p); //Lấy phần dư của phép chia a / p. Điều này giúp giảm kích thước của a để tránh tràn số trong quá trình tính toán
    while (b.gt(bigInteger.zero)) { // Hàm gt (greater than),  kiểm tra coi b có lớn hơn 0 hay không, mục đích là lặp cho đến khi b = 0
        if (b.mod(2).equals(bigInteger.one)) { // Kiểm tra b có phải số lẻ không (b mod 2 = 1)
            result = result.multiply(a).mod(p); //Nếu b lẻ, nhân result với a và lấy phần dư khi chia cho p
        }
        b = b.divide(2); //Chia b cho 2 để tăng tốc quá trình lặp
        a = a.square().mod(p);  //Tính bình phương của a và lấy phần dư khi chia cho p. Điều này giúp giảm kích thước của a và tăng quá trình tính toán
    }
    return result; //Kết quả cuối cùng của phép tính mũ
}

//Kiểm tra số nguyên tố
function checkIsPrime (num) {
    num = bigInteger(num) //Ép đúng kiểu dữ liệu

    if (num.lesser(bigInteger(2))) //Nếu num < 2 thì không phải số nguyên tố
        return false
    if (num.equals(bigInteger(2))) //Nếu bằng 2 là số nguyên tố
        return true
    if (num.isEven()) //Nếu num lẻ thì không phải số nguyên tố, chặn tại bước này để tránh việc khi vào vòng lặp phía sau sẽ bị ảnh hưởng hiệu suất
        return false

    //Chạy vòng lặp để kiểm tra số nguyên tố: bắt đầu từ 3, nhảy lên 2 đơn vị mỗi vòng lặp (vì nếu nhảy lên 1 đơn vị chắc chắn sẽ ra số chẵn => không phải số nguyên tố), giới hạn vòng lặp là i ^ 2 = i * i < num. Lý do là vì số nguyên tố thường sẽ ko chia hết cho một số nằm trong khoảng từ 2 đến căn bậc 2 của number: i < sqrt(num). Bình phương 2 vế ta có i ^ 2  < num. Việc chỉ kiểm tra đến sqrt(num) sẽ giúp giảm đáng kể hiệu suất
    for (let i = bigInteger(3); i.multiply(i).lesserOrEquals(num); i = i.plus(2)) {
        if (num.mod(i).equals(bigInteger.zero)) { // Nếu chia hết cho 1 số nào đó trong khoảng trên => không phải số nguyên tố
            return false;
        }
    }
    return true
}

//Trả về min và max của n chữ số, ví dụ với 2 chữ số sẽ trả về 10 hoặc 99 tùy theo boundary là min hay max, điều này giúp tạo 2 khoảng min và max phục vụ cho quá trình random 1 số nguyên có độ dài "digit" chữ số
function getNumberWithDigit (digit, boundary) {
    //Nếu là max, trả về định dạng 9999xxxx
    if (boundary === 'max') {
        let result = 9
        for (let i = 0; i < digit; i++) {
            result += '9' //Xử lý với chuỗi trước xong ép kiểu về số sẽ giúp giảm quá trình tính toán cho bộ nhớ 
        }
        return bigInteger(result)
    }

    //Nếu là min, trả về định dạng 1000xxxx
    result = 1
    for (let i = 0; i < digit; i++) {
        result += '0'
    }    
    return bigInteger(result)
}

//Hàm generate 1 số nguyên tố theo độ dài của bit
function generatePrime (bitLength) {
    let lengthPrime = bigInteger(Math.round(bitLength / Math.log2(10))) //Tính số lượng chữ số tương ứng với độ dài bit. Công thức tính số lượng chữ số là độ dài bit / Log2(10)
    
    while (true) {
        let randomNum = bigInteger.randBetween(getNumberWithDigit(lengthPrime, 'min'), getNumberWithDigit(lengthPrime, 'max')) //Random số nguyên nằm trong khoảng min, max tương ứng với độ dài của chữ số phía trên
        console.log(randomNum)
        if (checkIsPrime(randomNum)) {
            return randomNum //Nếu là số nguyên tố thì trả về, ko phải thì vẫn tiếp tục vòng lặp (để test demo, nên sử dụng các bitLength khoảng dưới 40 bit, nếu không có khả năng máy sẽ treo khá lâu để tìm số nguyên tố)
        }
    }
}

//Generate một số nguyên thủy g, số này sẽ có kích thước < số nguyên tố p nên lấy số prime p là tham số max truyền vào hàm 
function generatePrimitive (max) {
    max = bigInteger(max)
    
    while (true) {
        let randomPrimitive = bigInteger.randBetween(0, max) // Random từ 0 đến max (prime) cho đến khi số đó là số nguyên thủy của p
        if (checkValidPrimitive(randomPrimitive)) {
            return randomPrimitive
        }
    }
}

//Kiểm tra tính nguyên thủy của primitive đối với prime
function checkValidPrimitive (primitive, prime) {
    //Số nguyên thủy g của p được định nghĩa sao cho g lũy thừa cho mọi số mũ nguyên dương nhỏ hơn p mod cho p vẫn luôn nằm trong tập {1, 2, 3, ... p-1}
    // VD: g = 3, p = 5
    // g gọi là số nguyên thủy của p vì 
    // 3 ^ 1 mod 5 = 3
    // 3 ^ 2 mod 5 = 4
    // 3 ^ 3 mod 5 = 2
    // 3 ^ 4 mod 5 = 1
    // Có thể thấy rằng các kết quả trên luôn nằm trong tập {1, 2, 3, 4} ~ {1, 2, 3, ... p-1}
    for (let i = 1; i < prime; i++) { //Chạy vòng lặp từ 1 đến p - 1
        let result = modulo(primitive, i, prime) //Đưa vào hàm modulo, tính số mũ và modulo
        if (result >= prime) {
            return false //Nếu có 1 kết quả nào đó mà >= p thì số đó không phải số nguyên thủy của p
        }
    }
    return true
}

//Generate một số bí mật với độ dài bit
function generateSecretKey (bitLength) {
    let lengthNumber = bigInteger(Math.round(bitLength / Math.log2(10))) //Công thức tương tự phía trên

    //Random 1 số ngẫu nhiên với độ dài bit
    return randomNum = bigInteger.randBetween(getNumberWithDigit(lengthNumber, 'min'), getNumberWithDigit(lengthNumber, 'max'))
}

//Hàm tính toán DH với số nguyên tố p, số nguyên thủy g và 2 khóa bí mật của Bob và Alice, công thức tính giống với lý thuyết đã trình bày trong báo cáo
function calculateDiffieHellman (prime, primitive, key1, key2) {
    const A = modulo(primitive, key1, prime) 
    const B = modulo(primitive, key2, prime)

    const KeyA = modulo(B, key1, prime)
    const KeyB = modulo(A, key2, prime)

    return {A, B, KeyA, KeyB}
}

//Xuất các hàm cần thiết để file khác có thể gọi đến để sử dụng
module.exports = {
    generatePrime,
    generatePrimitive,
    generateSecretKey,
    calculateDiffieHellman
}