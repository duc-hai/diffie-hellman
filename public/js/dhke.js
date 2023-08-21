//Phía font end
//Khai báo các elements trên website
const btnSubmit = document.querySelector("#btn-submit");
const key1 = document.getElementById("key1");
const key2 = document.getElementById("key2");
const btnGeneratePri = document.querySelector("#generatePri");
const generateKey1 = document.getElementById("generate-key1");
const generateKey2 = document.getElementById("generate-key2");
const relPrime = document.getElementById("relPrime");
const relPrimitive = document.getElementById("relPrimitive");

//Nếu các ô input của private key đã nhập dữ liệu cũng như đã generate prime number thì show nút trao đổi lên
key2.addEventListener("keyup", function (e) {
  showDisabled();
});

key1.addEventListener("keyup", function (e) {
  showDisabled();
});

//Bắt và xử lý sự kiện Trao đổi 
btnSubmit.addEventListener("click", async function (e) {
  showLoading(); //Show hiệu ứng loading
  //Gọi API đến server để lấy dữ liệu
  let result = await fetch("/dhke", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prime: parseInt(relPrime.innerText),
      primitive: parseInt(relPrimitive.innerText),
      key1: parseInt(key1.value),
      key2: parseInt(key2.value),
    }),
  });
  endLoading(); //Đã hoàn thành lấy dữ liệu, tắt hiệu ứng loading
  let relJson = await result.json(); //Convert về đúng format JSON

  //Show dữ liệu lên
  resultDHKE("block");
  //Set lại dữ liệu cho đúng format  
  document.getElementById("A").innerText = relJson.A;
  document.getElementById("KA").innerText = relJson.KeyA;
  document.getElementById("B").innerText = relJson.B;
  document.getElementById("KB").innerText = relJson.KeyB;
});

//Bắt và xử lý sự kiện generate prime và primitive number, tương tự phía trên
btnGeneratePri.addEventListener("click", async function (e) {
  showLoading();
  let result = await fetch("/generatePri", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bit: document.getElementById("bit").value,
    }),
  });
  endLoading();
  let relJson = await result.json();
  relPrime.innerText = relJson.primeNumber;
  relPrimitive.innerText = relJson.primitiveNumber;
  document.querySelector("#rel-pri").style.display = "block";
  resultDHKE("none");
});

//Generate private key của alice
generateKey1.addEventListener("click", async function (e) {
  let rel = await generateKey();
  key1.value = rel.key;
  showDisabled();
});

//Generate private key của bob
generateKey2.addEventListener("click", async function (e) {
  let rel = await generateKey();
  key2.value = rel.key;
  showDisabled();
});

//Hàm chung để generate key từ server
async function generateKey() {
  showLoading();
  let result = await fetch("/generateKey", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  endLoading();
  resultDHKE("none");
  return await result.json();
}

//Show nút Trao đổi lên khi các dữ liệu đưa vào đã hợp lệ
function showDisabled() {
  if (
    key2.value === "" ||
    key1.value === "" ||
    relPrime.innerText == "" ||
    relPrimitive.innerText == ""
  )
    btnSubmit.classList.add("disabled");
  else btnSubmit.classList.remove("disabled");
}

//Hiện hiệu ứng loading 
function showLoading() {
  document.querySelector(".loading-container").style.display = "flex";
}

//Tắt hiệu ứng loading 
function endLoading() {
  document.querySelector(".loading-container").style.display = "none";
}

//Show kết quả DH sau khi đã tính toán khóa
function resultDHKE(status) {
  const result = document.querySelectorAll(".key-dhke");
  for (let i = 0; i < result.length; i++) {
    result[i].style.display = status;
  }
}
