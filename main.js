const form = document.querySelector('#pizzaForm');
const shapeSelect = document.querySelector('#FormatoPizza');
const tbody = document.querySelector('#pizzaTable tbody');

let pizzas = [];

form.addEventListener('submit', function (event) {
    adicionarPizza(event);
});

function adicionarPizza(event) {
    event.preventDefault();

    const nome = document.querySelector('#pizzaNome').value;
    const dimensao1 = parseFloat(document.querySelector('#dimension1').value);
    const dimensao2 = parseFloat(document.querySelector('#dimension2').value);
    const preco = parseFloat(document.querySelector('#pizzaPreco').value);

    if (!nome || isNaN(dimensao1) || isNaN(preco)) {
        alert('Preencha todas as informações obrigatórias e insira valores válidos!');
        return;
    }

    if (shapeSelect.value === 'PizzaRetangular' && isNaN(dimensao2)) {
        alert('Insira um valor válido!');
        return;
    }

    let tamanho, area;

    switch (shapeSelect.value) {
        case 'PizzaRedonda':
            const raio = dimensao1 / 2;
            tamanho = dimensao1;
            area = Math.PI * (raio * raio);
            break;
        case 'PizzaQuadrada':
            tamanho = dimensao1 * dimensao1;
            area = tamanho;
            break;
        case 'PizzaRetangular':
            tamanho = dimensao1 * dimensao2;
            area = tamanho;
            break;
        default:
            console.error('Formato desconhecido');
            return;
    }

    const pizza = {
        nome: nome,
        tamanho: tamanho,
        dimensao1: dimensao1,
        dimensao2: dimensao2,
        preco: preco,
        precoPorCm: preco / area,
        forma: shapeSelect.value,
    };

    pizzas.push(pizza);
    updateTable();
    form.reset();
}

function updateTable() {
    tbody.innerHTML = '';

    pizzas.sort((a, b) => a.precoPorCm - b.precoPorCm);

    let melhorCustoBeneficio = pizzas[0];

    pizzas.forEach((pizza, index) => {
        let newLine = document.createElement('tr');

        appendTableCell(newLine, pizza.nome);
        appendTableCell(newLine, formatTamanho(pizza));
        appendTableCell(newLine, formatCurrency(pizza.preco));
        appendTableCell(newLine, formatCurrency(pizza.precoPorCm));
        appendTableCell(newLine, calcularDiferencaPercentual(pizza, melhorCustoBeneficio));

        tbody.appendChild(newLine);

        if (index === 0) {
            newLine.classList.add('table-success');
        }
    });
}

function appendTableCell(row, content) {
    let cell = document.createElement('td');
    cell.textContent = content;
    row.appendChild(cell);
}

function toggleInputs() {
    const dimensao1Label = document.querySelector('#label1');
    const dimensao2Label = document.querySelector('#label2');
    const dimensao2Input = document.querySelector('#dimension2');

    switch (shapeSelect.value) {
        case 'PizzaRedonda':
        case 'PizzaQuadrada':
            dimensao1Label.textContent = 'Tamanho (cm)';
            dimensao2Label.classList.add('hidden');
            dimensao2Input.classList.add('hidden');
            break;
        case 'PizzaRetangular':
            dimensao1Label.textContent = 'Lado 1 (cm)';
            dimensao2Label.textContent = 'Lado 2 (cm):';
            dimensao2Label.classList.remove('hidden');
            dimensao2Input.classList.remove('hidden');
            break;
        default:
        console.error('Formato desconhecido');
    }
}

function formatTamanho(pizza) {
    if (pizza.forma === 'rectanguPizzaRetangularlar') {
        return `${pizza.dimensao1}cm x ${pizza.dimensao2}cm`;
    } else if (pizza.forma === 'PizzaQuadrada') {
        return `${pizza.dimensao1}cm x ${pizza.dimensao1}cm`;
    } else {
        return `${pizza.tamanho}cm`;
    }
}

function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function calcularDiferencaPercentual(pizza, melhorCustoBeneficio) {
    const diferencaPercentual = ((pizza.precoPorCm - melhorCustoBeneficio.precoPorCm) / melhorCustoBeneficio.precoPorCm) * 100;

    if (diferencaPercentual > 0) {
        return `+${diferencaPercentual.toFixed(2)}%`;
    } else {
        return `${diferencaPercentual.toFixed(2)}%`;
    }
}