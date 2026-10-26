let imgBx = document.querySelectorAll(".imgBx");
imgBx.forEach((popup) =>
  popup.addEventListener("click", () => {
    popup.classList.toggle("active");
  })
);

function toggleMenu() {
  const menuToggle = document.querySelector(".toggle");
  const navigation = document.querySelector(".navigation");
  menuToggle.classList.toggle("active");
  navigation.classList.toggle("active");
}
