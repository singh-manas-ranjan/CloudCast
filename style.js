const companyLogo = document.getElementById('companyLogo');
const navIcon = document.getElementById('nav-icon');
const searchBar = document.getElementById('search-bar');
const headerSection = document.getElementById('header');
const searchQuery = document.getElementById('searchField');

companyLogo.addEventListener('click',()=>{
    window.location.reload();
})

navIcon.addEventListener('click',()=>{
    searchBar.classList.toggle('active');
    headerSection.classList.toggle('active');
})


