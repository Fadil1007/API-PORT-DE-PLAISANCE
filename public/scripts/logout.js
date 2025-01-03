document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logout-button");

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      // Supprimer le token d'authentification du localStorage
      localStorage.removeItem("token");

      // Rediriger vers la page de connexion
      window.location.href = "index.html";
    });
  }
});
