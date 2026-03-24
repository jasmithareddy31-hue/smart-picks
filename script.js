let products = [];
let isAdmin = JSON.parse(localStorage.getItem("isAdmin")) || false;

async function loadProducts() {
  const response = await fetch('http://localhost:3000/api/products');
  products = await response.json();
  display();
}

let buffer="";
document.addEventListener("keydown", e=>{
  buffer += e.key.toLowerCase();
  if(buffer.includes("admin")){
    let pass = prompt("Enter admin password:");
    if(pass==="Jasmi0231"){
      isAdmin=true;
      localStorage.setItem("isAdmin", true);
      document.getElementById("adminPanel").style.display="block";
      display();
    } else alert("Wrong password");
    buffer="";
  }
});

function logout(){
  isAdmin=false;
  localStorage.setItem("isAdmin", false);
  document.getElementById("adminPanel").style.display="none";
  display();
}

async function addProduct(){
  const name = document.getElementById("name").value.trim();
  const category = document.getElementById("category").value.trim();
  const desc = document.getElementById("desc").value.trim();
  const link = document.getElementById("link").value.trim();
  const imageFile = document.getElementById("imageFile").files[0];

  if(!name || !category || !desc || !link || !imageFile){
    alert("Fill all fields and select an image bro 😭"); return;
  }

  // Use FormData to send the actual file along with the text
  const formData = new FormData();
  formData.append('name', name);
  formData.append('category', category);
  formData.append('desc', desc);
  formData.append('link', link);
  formData.append('image', imageFile); 

  await fetch('http://localhost:3000/api/products', {
    method: 'POST',
    body: formData // No Content-Type header needed for FormData
  });

  clearForm();
  await loadProducts();
}

function clearForm(){
  document.getElementById("name").value="";
  document.getElementById("category").value="";
  document.getElementById("desc").value="";
  document.getElementById("link").value="";
  document.getElementById("imageFile").value="";
}

function display(cat="all"){
  let c=document.getElementById("products");
  c.innerHTML="";
  let filtered = cat==="all"?products:products.filter(p=>p.category===cat);

  filtered.slice().reverse().forEach(p => {
    c.innerHTML+=`
    <div class="card">
      <img src="${p.image}" alt="Product Image">
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <a href="${p.link}" target="_blank">Check Price</a>
      ${isAdmin ? `<br><button onclick="del('${p._id}')">Delete</button>` : ""}
    </div>`;
  });
  showCategories();
}

async function del(id){
  await fetch(`http://localhost:3000/api/products/${id}`, { method: 'DELETE' });
  loadProducts();
}

function showCategories(){
  let cats=[...new Set(products.map(p=>p.category))];
  let div=document.getElementById("categories");
  div.innerHTML='<button onclick="display(\'all\')">All</button>';
  cats.forEach(c=>{
    div.innerHTML+=`<button onclick="display('${c}')">${c}</button>`;
  });
}

loadProducts();
if(isAdmin) document.getElementById("adminPanel").style.display="block";