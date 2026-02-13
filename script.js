let todosEquipamentos = []; 

async function carregarEquipamentos() {
    const container = document.getElementById('lista-equipamentos');
    const inputBusca = document.getElementById('input-busca');

    // Verifica se os elementos existem na página antes de continuar
    if (!container || !inputBusca) {
        console.error("Erro: IDs 'lista-equipamentos' ou 'input-busca' não encontrados no HTML.");
        return;
    }

    try {
        console.log("Tentando carregar o JSON...");
        const response = await fetch('./data/equipamentos.json');
        
        if (!response.ok) throw new Error("Não foi possível carregar o arquivo JSON.");
        
        todosEquipamentos = await response.json();
        console.log("Dados carregados com sucesso:", todosEquipamentos);

        // Mostra todos ao carregar a página
        exibirCards(todosEquipamentos);

        // EVENTO DE BUSCA
        inputBusca.addEventListener('input', (e) => {
            const termo = e.target.value.toLowerCase().trim();
            console.log("Digitando termo de busca:", termo);

            const filtrados = todosEquipamentos.filter(item => {
                const nome = item.nome ? item.nome.toLowerCase() : "";
                const categoria = item.categoria ? item.categoria.toLowerCase() : "";
                return nome.includes(termo) || categoria.includes(termo);
            });

            exibirCards(filtrados);
        });

    } catch (error) {
        console.error("Erro na execução:", error);
        container.innerHTML = `<div class="col-span-full text-center py-10 text-red-500">Erro ao carregar dados. Verifique o console (F12).</div>`;
    }
}

function exibirCards(lista) {
    const container = document.getElementById('lista-equipamentos');
    
    if (lista.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center py-20 text-gray-500 font-light italic">Nenhum equipamento disponível no momento.</div>`;
        return;
    }

    container.innerHTML = lista.map(item => `
        <div class="group bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            
            <div class="relative">
                <div class="absolute top-4 left-4 z-10">
                    <span class="${item.disponivel ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'} text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        ${item.disponivel ? '● Em Estoque' : '○ Sob Consulta'}
                    </span>
                </div>
                
                <div class="w-full h-60 bg-slate-50 p-8 overflow-hidden flex items-center justify-center">
                    <img src="${item.imagem}" 
                         class="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-110" 
                         alt="${item.nome}">
                </div>
            </div>

            <div class="p-6 flex-grow flex flex-col">
                <h3 class="text-lg text-slate-800 font-bold leading-tight line-clamp-2 mb-4 h-14">
                    ${item.nome}
                </h3>
                
                <div class="mb-6">
                    <span class="text-[11px] text-slate-400 uppercase font-bold tracking-widest block mb-1">Assinatura mensal</span>
                    <div class="flex items-baseline gap-1">
                        <span class="text-sm font-bold text-[#003580]">R$</span>
                        <span class="text-3xl text-[#003580] font-black tracking-tighter">${item.preco}</span>
                    </div>
                    <p class="text-blue-500 text-[11px] font-bold mt-2 flex items-center italic">
                        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg>
                        Instalação e Suporte Grátis na Região
                    </p>
                </div>

                <button class="mt-auto w-full bg-[#003580] text-white py-3 rounded-xl font-bold text-sm transition-all hover:bg-blue-800 group-hover:bg-[#FF9800] border-none shadow-md uppercase tracking-wider">
                    Alugar Agora
                </button>
            </div>
        </div>
    `).join('');
}

const contar = () => {
    const contadores = document.querySelectorAll('.numero');
    const velocidade = 150; // Ajuste para ser mais rápido ou lento

    contadores.forEach(contador => {
      const atualizarTexto = () => {
        const alvo = +contador.getAttribute('data-target');
        const atual = +contador.innerText;
        const incremento = alvo / velocidade;

        if (atual < alvo) {
          contador.innerText = Math.ceil(atual + incremento);
          setTimeout(atualizarTexto, 20);
        } else {
          // Formatação final: adiciona o '+' ou o 'h'
          if(alvo === 2) {
             contador.innerText = alvo + "h";
          } else {
             contador.innerText = alvo + "+";
          }
        }
      };
      atualizarTexto();
    });
  };

  // Inicia quando a seção aparece na tela
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      contar();
      observer.disconnect(); 
    }
  }, { threshold: 0.5 });

  observer.observe(document.querySelector('.numero'));

// Garante que o script só rode quando o HTML estiver pronto
document.addEventListener('DOMContentLoaded', carregarEquipamentos);