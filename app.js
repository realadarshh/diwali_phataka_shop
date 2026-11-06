const products = [
  {id:'phooljhadi',name:'Classic Phooljhadi',type:'Handheld sparkle',price:249,emoji:'✨',tag:'Bestseller',halo:'#ffd585',rating:'★★★★★'},
  {id:'anar',name:'Gaolden Anar',type:'Colour fountain',price:399,emoji:'🎇',tag:'Crowd favourite',halo:'#ffb875',rating:'★★★★★'},
  {id:'chakri',name:'Super Chakri',type:'Spinning wonder',price:299,emoji:'🌀',tag:'Little magic',halo:'#e9b2a7',rating:'★★★★☆'},
  {id:'rocket',name:'Sky Rocket',type:'A little lift-off',price:449,emoji:'🚀',tag:'Big moment',halo:'#a9c1d2',rating:'★★★★★'},
  {id:'pencil',name:'Bijli Pencils',type:'Bright & brilliant',price:199,emoji:'🕯️',tag:'Family pick',halo:'#f3cf8b',rating:'★★★★☆'},
  {id:'flowerpot',name:'Mini Flower Pots',type:'Garden of sparks',price:349,emoji:'🌋',tag:'New',halo:'#f2a78d',rating:'★★★★★'},
  {id:'bijli',name:'Bijli Crackers',type:'Classic little pop',price:179,emoji:'💥',tag:'Old favourite',halo:'#dbb5d4',rating:'★★★★☆'},
  {id:'twinkling',name:'Twinkling Stars',type:'Shimmering delight',price:279,emoji:'🌟',tag:'Soft sparkle',halo:'#e6d59b',rating:'★★★★★'},
  {id:'shot',name:'Colour Shots',type:'A sky full of colour',price:599,emoji:'🎆',tag:'Party pick',halo:'#b9afe1',rating:'★★★★★'},
  {id:'combo',name:'Diwali Party Box',type:'A little of everything',price:1299,emoji:'🎁',tag:'Best value',halo:'#e9bd82',rating:'★★★★★'}
];
const cart = new Map();
const grid = document.getElementById('product-grid');
const money = value => '₹' + value.toLocaleString('en-IN');

function renderProducts(list=products){
  grid.innerHTML = list.map((p,i)=>`<article class="product-card" data-id="${p.id}" style="animation-delay:${i*35}ms;--halo:${p.halo}">
    <div class="product-visual"><span class="product-tag">${p.tag}</span><span class="product-symbol" aria-hidden="true">${p.emoji}</span></div>
    <div class="product-details"><div class="product-meta"><h3>${p.name}</h3><span class="product-rating" aria-label="Customer rating">${p.rating}</span></div><p class="product-description">${p.type}</p><div class="product-bottom"><span class="product-price">${money(p.price)} <small>/ pack</small></span><button class="add-button" data-add="${p.id}">Add to cart</button></div></div>
  </article>`).join('');
}
function updateCart(){
  const count=[...cart.values()].reduce((sum,item)=>sum+item.qty,0);
  document.getElementById('cart-count').textContent=count;
  document.getElementById('drawer-count').textContent=`(${count})`;
  const lines=[...cart.values()];
  document.getElementById('cart-empty').classList.toggle('hidden',lines.length>0);
  document.getElementById('cart-items').classList.toggle('hidden',lines.length===0);
  document.getElementById('cart-footer').classList.toggle('hidden',lines.length===0);
  document.getElementById('cart-items').innerHTML=lines.map(({product:p,qty})=>`<div class="cart-line"><div class="cart-thumb">${p.emoji}</div><div><h3>${p.name}</h3><small>${money(p.price)} / pack</small><div class="quantity"><button data-qty="${p.id}" data-delta="-1" aria-label="Remove one ${p.name}">−</button><span>${qty}</span><button data-qty="${p.id}" data-delta="1" aria-label="Add one ${p.name}">+</button></div></div><div><div class="cart-line-price">${money(p.price*qty)}</div><button class="remove-item" data-remove="${p.id}">Remove</button></div></div>`).join('');
  document.getElementById('subtotal').textContent=money(lines.reduce((sum,item)=>sum+item.product.price*item.qty,0));
}
function openCart(){document.getElementById('cart-drawer').classList.add('open');document.getElementById('cart-drawer').setAttribute('aria-hidden','false');document.getElementById('overlay').classList.add('open');document.body.style.overflow='hidden'}
function closeCart(){document.getElementById('cart-drawer').classList.remove('open');document.getElementById('cart-drawer').setAttribute('aria-hidden','true');document.getElementById('overlay').classList.remove('open');document.body.style.overflow=''}
let toastTimer;
function showToast(message){const toast=document.getElementById('toast');document.getElementById('toast-message').textContent=message;toast.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('visible'),1900)}
grid.addEventListener('click',event=>{
  const button=event.target.closest('[data-add]');if(!button)return;
  const product=products.find(p=>p.id===button.dataset.add);const entry=cart.get(product.id)||{product,qty:0};entry.qty++;cart.set(product.id,entry);updateCart();
  const card=button.closest('.product-card');card.classList.remove('lighting');void card.offsetWidth;card.classList.add('lighting');button.classList.add('added');button.textContent='Added ✓';showToast(`${product.name} is glowing in your cart`);
  setTimeout(()=>{card.classList.remove('lighting');button.classList.remove('added');button.textContent='Add to cart'},1000);
});
document.getElementById('cart-items').addEventListener('click',event=>{
  const qtyButton=event.target.closest('[data-qty]');const removeButton=event.target.closest('[data-remove]');
  if(removeButton)cart.delete(removeButton.dataset.remove);
  if(qtyButton){const item=cart.get(qtyButton.dataset.qty);if(item){item.qty+=Number(qtyButton.dataset.delta);if(item.qty<=0)cart.delete(qtyButton.dataset.qty)}}
  updateCart();
});
document.getElementById('sort').addEventListener('change',event=>{const sorted=[...products];if(event.target.value==='price-low')sorted.sort((a,b)=>a.price-b.price);if(event.target.value==='price-high')sorted.sort((a,b)=>b.price-a.price);renderProducts(sorted)});
document.getElementById('cart-open').addEventListener('click',openCart);
document.getElementById('cart-close').addEventListener('click',closeCart);
document.getElementById('overlay').addEventListener('click',closeCart);
document.getElementById('continue-shopping').addEventListener('click',closeCart);
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeCart()});
document.getElementById('checkout').addEventListener('click',()=>{const method=document.querySelector('input[name="fulfillment"]:checked').value;showToast(method==='delivery'?'Home delivery selected':'Takeaway pickup selected')});
renderProducts();updateCart();
