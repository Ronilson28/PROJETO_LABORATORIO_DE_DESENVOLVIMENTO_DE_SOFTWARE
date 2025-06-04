const btnNovaHistoria = document.getElementById('btn-nova-historia');
const modalNovaHistoria = document.getElementById('modal-nova-historia');
const fecharModal = document.getElementById('fechar-modal');

// Abrir modal ao clicar no botão "Nova História"
btnNovaHistoria.addEventListener('click', () => {
  modalNovaHistoria.style.display = 'flex';
});

// Fechar modal ao clicar no botão de fechar
fecharModal.addEventListener('click', () => {
  modalNovaHistoria.style.display = 'none';
});

// Fechar modal ao clicar fora dele
window.addEventListener('click', (event) => {
  if (event.target === modalNovaHistoria) {
    modalNovaHistoria.style.display = 'none';
  }
});

const categoriaBtns = document.querySelectorAll('.categoria-btn');

let categoriasSelecionadas = []; // Inicializa um array para armazenar as categorias selecionadas
// Adiciona evento de clique a cada botão de categoria
categoriaBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const categoria = btn.dataset.categoria;

    if (categoriasSelecionadas.includes(categoria)) {
      categoriasSelecionadas = categoriasSelecionadas.filter(c => c !== categoria);
      btn.classList.remove('selected');
    } else {
      categoriasSelecionadas.push(categoria);
      btn.classList.add('selected');
    }
  });
});

const salvarHistoriaBtn = document.getElementById('salvar-historia');
// Adiciona evento de clique ao botão de salvar história
salvarHistoriaBtn.addEventListener('click', () => {
  const titulo = document.getElementById('titulo').value.trim();
  const novaCategoria = document.getElementById('nova-categoria').value.trim();

  console.log('Título:', titulo);
  console.log('Nova categoria:', novaCategoria);
  console.log('Categorias selecionadas:', categoriasSelecionadas);
  
  let categorias = [...categoriasSelecionadas];
  if (novaCategoria) categorias.push(novaCategoria); // Adiciona a nova categoria se fornecida

  if (!titulo) {
    alert('Por favor, insira um título para a história.');
    return;
  }

  if (categorias.length === 0) {
    alert('Por favor, selecione pelo menos uma categoria.');
    return;
  }

  const novaHistoria = {
    titulo,
    categorias
  };

  console.log('Nova história:', novaHistoria);

  // Fetch/axios para enviar os dados para o servidor

  // Limpar os campos após salvar
  document.getElementById("titulo").value = "";
  document.getElementById("nova-categoria").value = "";
  categoriasSelecionadas = [];
  document.querySelectorAll(".categoria-btn").forEach(button => button.classList.remove("selected"));
  document.getElementById("modal-nova-historia").style.display = "none";
});

// Adiciona eventos de clique para os botões de excluir e editar histórias
document.querySelectorAll('.btn-excluir-historia').forEach(button => {
  button.addEventListener('click', (e) => {
    const confirmacao = confirm('Tem certeza que quer excluir esta história?');
    if (confirmacao) {
      // Excluir via fetch/axios ou redirecionar.
      console.log('História excluída!');
    }
  });
});

// Adiciona eventos de clique para os botões de editar histórias
document.querySelectorAll('.btn-editar-historia').forEach(button => {
  button.addEventListener('click', (e) => {
    console.log('Editar história - aqui pode abrir um modal ou redirecionar.');
  });
});