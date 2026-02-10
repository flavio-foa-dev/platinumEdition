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
        container.innerHTML = `<div class="col-span-full text-center py-20 text-gray-500 font-light">Nenhum equipamento encontrado.</div>`;
        return;
    }

    container.innerHTML = lista.map(item => `
        <div class="group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden cursor-pointer flex flex-col h-full transition-all">
            
            <div class="w-full h-48 bg-white p-4 overflow-hidden flex items-center justify-center">
                <img src="${item.imagem}" 
                     class="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" 
                     alt="${item.nome}">
            </div>

            <div class="p-4 flex-grow border-t border-gray-100">
                <span class="text-[10px] font-bold ${item.disponivel ? 'text-green-600' : 'text-orange-600'} uppercase">
                    ${item.disponivel ? '● Pronta Entrega' : '○ Sob Consulta'}
                </span>
                <h3 class="text-sm text-gray-800 line-clamp-2 mt-1 h-10 font-medium">${item.nome}</h3>
                <div class="mt-2">
                    <span class="text-xs text-gray-500">A partir de</span>
                    <div class="text-2xl text-[#003580] font-normal">R$ ${item.preco}</div>
                </div>
                <p class="text-green-600 text-xs font-bold mt-1">Frete grátis</p>
            </div>
        </div>
    `).join('');
}

// Garante que o script só rode quando o HTML estiver pronto
document.addEventListener('DOMContentLoaded', carregarEquipamentos);