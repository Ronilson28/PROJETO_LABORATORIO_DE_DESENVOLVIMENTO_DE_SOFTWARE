// Redirecionar ao clicar no destaque
const destaque = document.querySelector('.destaque-banner');
if (destaque) {
  destaque.addEventListener('click', () => {
    const id = destaque.dataset.id;
    if (id) {
      window.location.href = `/historias/${id}/ler?from=index`;
    }
  });
}

// Redirecionar ao clicar em qualquer card de história
document.querySelectorAll('.card-historia').forEach(card => {
  card.addEventListener('click', () => {
    const id = card.dataset.id;
    if (id) {
      window.location.href = `/historias/${id}/ler?from=index`;
    }
  });
});
