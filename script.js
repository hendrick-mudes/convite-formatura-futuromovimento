document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. LÓGICA DE INTERFACE E REGRAS DE EXIBIÇÃO
  // ==========================================
  const guestRadios = document.querySelectorAll('input[name="convidados"]');
  
  // Pegando os wrappers (divs) - aceita com hífen ou underline
  const wrapG1 = document.getElementById("wrap-convidado-1") || document.getElementById("wrap_convidado_1");
  const wrapG2 = document.getElementById("wrap-convidado-2") || document.getElementById("wrap_convidado_2");
  
  // Pegando os inputs (campos de texto) - aceita com hífen ou underline
  const inputG1 = document.getElementById("nome_convidado_1") || document.getElementById("nome-convidado-1");
  const inputG2 = document.getElementById("nome_convidado_2") || document.getElementById("nome-convidado-2");

  function handleGuestFields(value) {
    const numConvidados = parseInt(value, 10);

    if (numConvidados === 0) {
      if (wrapG1) wrapG1.classList.remove("show");
      if (wrapG2) wrapG2.classList.remove("show");
      if (inputG1) inputG1.required = false;
      if (inputG2) inputG2.required = false;
    } else if (numConvidados === 1) {
      if (wrapG1) wrapG1.classList.add("show");
      if (wrapG2) wrapG2.classList.remove("show");
      if (inputG1) inputG1.required = true;
      if (inputG2) inputG2.required = false;
    } else if (numConvidados === 2) {
      if (wrapG1) wrapG1.classList.add("show");
      if (wrapG2) wrapG2.classList.add("show");
      if (inputG1) inputG1.required = true;
      if (inputG2) inputG2.required = true;
    }
  }

  guestRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      handleGuestFields(e.target.value);
    });
  });

  const presencaRadios = document.querySelectorAll('input[name="presenca"]');
  presencaRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      if (e.target.value === "nao") {
        const zeroRadio = document.querySelector(
          'input[name="convidados"][value="0"]'
        );
        if (zeroRadio) zeroRadio.checked = true;
        handleGuestFields("0");
      }
    });
  });

  const checkedGuest = document.querySelector(
    'input[name="convidados"]:checked'
  );
  if (checkedGuest) {
    handleGuestFields(checkedGuest.value);
  }

  // ==========================================
  // 2. LÓGICA DE ENVIO DO FORMULÁRIO (GOOGLE PLANILHAS)
  // ==========================================
  const form = document.querySelector("form");
  
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitBtn = e.target.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = "Enviando...";
      submitBtn.disabled = true;

      // Montando os dados. Agora usamos diretamente a variável inputG1 e inputG2 
      // que já encontraram o campo correto com os nomes.
      const formData = {
        nome: document.getElementById("nome")?.value || "",
        presenca:
          document.querySelector('input[name="presenca"]:checked')?.value === "sim"
            ? "Sim"
            : "Não",
        qtdConvidados:
          document.querySelector('input[name="convidados"]:checked')?.value || "0",
        convidado1: inputG1?.value || "",
        convidado2: inputG2?.value || "",
      };

      try {
        const webhookUrl = "https://script.google.com/macros/s/AKfycbzQgrggiJ4Hmq_55yDu_MJtE-Z_51-eDyg-kYf58dXMvw1CW0jbJGsnauNiCh4UYz4U/exec";

        await fetch(webhookUrl, {
          method: "POST",
          body: JSON.stringify(formData),
        });

        alert("Presença confirmada com sucesso! Nos vemos na formatura.");
        window.location.reload(); 
        
      } catch (error) {
        console.error("Erro:", error);
        alert("Houve um erro de conexão. Tente novamente.");
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }
});
