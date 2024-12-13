const form = document.getElementById("formulario");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const ticket = document.getElementById("ticket").checked;

    try {
        const response = await fetch('https://your-vercel-domain.vercel.app/guardar-datos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, phone, ticket })
        });        

        if (response.ok) {
            window.location.href = 'agradecimiento.html';
        } else {
            const result = await response.json();
            alert(result.message);
        };

    } catch (error) {
        console.error("Error al enviar datos:", error);
        alert("Hubo un error. Inténtalo de nuevo.");
    }
});