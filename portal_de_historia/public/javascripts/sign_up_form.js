// Função para alternar visibilidade da senha
function toggleSenha(inputName, iconElement) {
  const input = document.querySelector(`input[name="${inputName}"]`);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    iconElement.textContent = '🙂';
  } else {
    input.type = 'password';
    iconElement.textContent = '😊';
  }
}

// Validação do formulário de cadastro
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('cadastroForm');
  if (!form) return;

    form.addEventListener('submit', function (e) {
    const email = form.querySelector('input[name="email"]').value.trim();
    const confirmEmail = form.querySelector('input[name="confirmEmail"]').value.trim();
    const senha = form.querySelector('input[name="senha"]').value;
    const confirmSenha = form.querySelector('input[name="confirmSenha"]').value;
    
    const erros = [];
  
    if (senha.length < 8) {
      e.preventDefault();
      erros.push('A senha deve ter pelo menos 8 caracteres');
    }

    if (email !== confirmEmail) {
      e.preventDefault();
      erros.push('Os e-mails não coincidem');
    }

    if (senha !== confirmSenha) {
      e.preventDefault();
      erros.push('As senhas não coincidem');
    }

    if (erros.length > 0) {
      e.preventDefault();
      alert(erros.join('\n'));
    }
  });
});

const dropdownSelect = document.getElementById('generos-select');
const dropdownOptions = document.getElementById('generos-options');
const inputNovoGenero = document.getElementById('novo-genero');
const btnAddNovo = document.getElementById('btn-add-novo');

dropdownSelect.addEventListener('click', () => {
  dropdownOptions.classList.toggle('hidden');
});

// Fecha o dropdown ao clicar fora
document.addEventListener('click', (e) => {
  if (!dropdownSelect.contains(e.target) && !dropdownOptions.contains(e.target) && e.target !== inputNovoGenero && e.target !== btnAddNovo) {
    dropdownOptions.classList.add('hidden');
  }
});

btnAddNovo.addEventListener('click', () => {
  const novoGenero = inputNovoGenero.value.trim();
  if (!novoGenero) return alert('Digite um gênero para adicionar.');

  // Verifica se já existe
  const inputs = dropdownOptions.querySelectorAll('input[type=checkbox]');
  for (const input of inputs) {
    if (input.value.toLowerCase() === novoGenero.toLowerCase()) {
      alert('Esse gênero já existe.');
      return;
    }
  }

  // Cria novo checkbox
  const id = 'gen-' + novoGenero.toLowerCase().replace(/\s+/g, '-');

  const div = document.createElement('div');
  div.className = 'option';
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = id;
  checkbox.name = 'preferenciasGenero';
  checkbox.value = novoGenero;
  checkbox.checked = true;

  const label = document.createElement('label');
  label.htmlFor = id;
  label.textContent = novoGenero;

  div.appendChild(checkbox);
  div.appendChild(label);

  dropdownOptions.appendChild(div);

  inputNovoGenero.value = '';
  dropdownOptions.classList.remove('hidden');

  atualizarTextoSelecionado();
});

function atualizarTextoSelecionado() {
  const selecionados = [...dropdownOptions.querySelectorAll('input[type=checkbox]:checked')].map(cb => cb.value);
  dropdownSelect.textContent = selecionados.length > 0 ? selecionados.join('; ') : 'Selecione os gêneros...';
}

// Atualiza texto ao clicar nos checkboxes
dropdownOptions.addEventListener('change', atualizarTextoSelecionado);
