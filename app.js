// ==========================================
// GERADOR DE ORÇAMENTOS
// ==========================================


// ==========================================
// CONFIGURAÇÃO DOS QUARTOS
// ==========================================

const QUARTOS = {

    TWC: {
        nome: "Quarto com 02 camas de solteiro",
        foto: "img/quartos/solteiro.jpg",
        quantidadeQuartos: 1
    },

    TWB: {
        nome: "Quarto Superior com 02 camas de solteiro",
        foto: "img/quartos/solteiro.jpg",
        quantidadeQuartos: 1
    },

    DBC: {
        nome: "Quarto com 01 cama de casal",
        foto: "img/quartos/casal.jpg",
        quantidadeQuartos: 1
    },

    DBB: {
        nome: "Quarto Superior com 01 cama de casal",
        foto: "img/quartos/casal.jpg",
        quantidadeQuartos: 1
    },

    DSC: {
        nome: "Quarto com 01 cama de casal + 01 sofá-cama",
        foto: "img/quartos/sofa-cama.jpg",
        quantidadeQuartos: 1
    },

    S2C: {
        nome: "Apartamento Standard Conjugado — 02 quartos, 01 cama de casal + 02 camas de solteiro",
        foto: "img/quartos/conjugado.jpg",
        quantidadeQuartos: 2
    }

};


// ==========================================
// CONVERTER VALOR PARA NÚMERO
// ==========================================

function converterValor(valor) {

    if (!valor) {
        return 0;
    }

    valor = valor
        .toString()
        .replace("R$", "")
        .replace(/\s/g, "")
        .replace(/\./g, "")
        .replace(",", ".");

    return parseFloat(valor) || 0;
}


// ==========================================
// FORMATAR VALOR EM REAIS
// ==========================================

function formatarMoeda(valor) {

    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


// ==========================================
// FORMATAR DATA
// ==========================================

function formatarData(data) {

    if (!data) {
        return "";
    }

    const partes = data.split("-");

    if (partes.length !== 3) {
        return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


// ==========================================
// FORMATAR DATA + DIA DA SEMANA
// ==========================================

function formatarDataCompleta(data) {

    if (!data) {
        return "";
    }

    const partes = data.split("-");

    if (partes.length !== 3) {
        return data;
    }

    const dataObj = new Date(
        `${partes[0]}-${partes[1]}-${partes[2]}T12:00:00`
    );

    const diasSemana = [
        "domingo",
        "segunda-feira",
        "terça-feira",
        "quarta-feira",
        "quinta-feira",
        "sexta-feira",
        "sábado"
    ];

    const diaSemana =
        diasSemana[dataObj.getDay()];

    return `${formatarData(data)} — ${diaSemana}`;
}


// ==========================================
// CALCULAR NOITES
// ==========================================

function calcularNoites(checkin, checkout) {

    if (!checkin || !checkout) {
        return 0;
    }

    const entrada = new Date(
        `${checkin}T12:00:00`
    );

    const saida = new Date(
        `${checkout}T12:00:00`
    );

    const diferenca =
        saida.getTime() - entrada.getTime();

    const noites =
        Math.round(
            diferenca /
            (1000 * 60 * 60 * 24)
        );

    return noites > 0 ? noites : 0;
}


// ==========================================
// CAPITALIZAR PRIMEIRA LETRA
// ==========================================

function capitalizar(texto) {

    if (!texto) {
        return "";
    }

    return texto.charAt(0).toUpperCase() +
        texto.slice(1);
}


// ==========================================
// ELEMENTOS
// ==========================================

const formulario =
    document.getElementById("formOrcamento");

const orcamentoPreview =
    document.getElementById("orcamentoPreview");


// ==========================================
// GERAR ORÇAMENTO
// ==========================================

function gerarOrcamento() {

    const nome =
        document.getElementById("nomeHospede").value.trim();

    const checkin =
        document.getElementById("checkin").value;

    const checkout =
        document.getElementById("checkout").value;

    const adultos =
        parseInt(
            document.getElementById("adultos").value
        ) || 0;

    const criancas =
        parseInt(
            document.getElementById("criancas").value
        ) || 0;

    const quarto =
        document.getElementById("tipoQuarto").value;

    const cafe =
        document.getElementById("cafe").value;

    const valorDiaria =
        converterValor(
            document.getElementById("valorDiaria").value
        );

    const observacoes =
        document.getElementById("observacoes").value.trim();


    const noites =
        calcularNoites(
            checkin,
            checkout
        );


    if (!checkin || !checkout) {

        alert(
            "Informe as datas de check-in e check-out."
        );

        return;
    }


    if (!quarto) {

        alert(
            "Selecione o tipo de quarto."
        );

        return;
    }


    if (noites <= 0) {

        alert(
            "A data de check-out deve ser posterior ao check-in."
        );

        return;
    }


    const dadosQuarto =
        QUARTOS[quarto];


    const valorTotal =
        valorDiaria * noites;


    const valorFormatado =
        formatarMoeda(valorTotal);


    const diariaFormatada =
        formatarMoeda(valorDiaria);


    let textoHospedes = "";


    if (adultos > 0) {

        textoHospedes +=
            `${adultos} adulto${adultos > 1 ? "s" : ""}`;

    }


    if (criancas > 0) {

        if (textoHospedes) {
            textoHospedes += " • ";
        }

        textoHospedes +=
            `${criancas} criança${criancas > 1 ? "s" : ""}`;

    }


    if (!textoHospedes) {
        textoHospedes = "Não informado";
    }


    const cafeTexto =
        cafe === "sim"
            ? "Café da manhã incluso"
            : "Sem café da manhã";


    orcamentoPreview.innerHTML = `

        <div class="orcamento">

            <div class="orcamento-topo">

                <div class="logo-hotel">

                    <img
                        src="img/logo.png"
                        alt="ibis Styles Curitiba Centro Cívico"
                    >

                </div>

                <div class="titulo-orcamento">

                    <h2>
                        ORÇAMENTO DE HOSPEDAGEM
                    </h2>

                    <p>
                        ibis Styles Curitiba Centro Cívico
                    </p>

                </div>

            </div>


            <div class="orcamento-conteudo">


                ${
                    nome
                        ? `
                            <div class="bloco">
                                <strong>Hóspede</strong>
                                <span>${nome}</span>
                            </div>
                          `
                        : ""
                }


                <div class="bloco">

                    <strong>Período da hospedagem</strong>

                    <div class="datas-hospedagem">

                        <div>

                            <small>Check-in</small>

                            <span>
                                ${formatarDataCompleta(checkin)}
                            </span>

                        </div>


                        <div>

                            <small>Check-out</small>

                            <span>
                                ${formatarDataCompleta(checkout)}
                            </span>

                        </div>


                    </div>

                </div>


                <div class="bloco">

                    <strong>Hóspedes</strong>

                    <span>
                        ${textoHospedes}
                    </span>

                </div>


                <div class="bloco">

                    <strong>Acomodação</strong>

                    <span>
                        ${dadosQuarto.nome}
                    </span>

                </div>


                <div class="bloco">

                    <strong>Café da manhã</strong>

                    <span>
                        ${cafeTexto}
                    </span>

                </div>


                <div class="bloco">

                    <strong>Valor da diária</strong>

                    <span>
                        ${diariaFormatada}
                    </span>

                </div>


                <div class="bloco">

                    <strong>Número de noites</strong>

                    <span>
                        ${noites}
                    </span>

                </div>


                <div class="valor-total">

                    <span>
                        Valor total da hospedagem
                    </span>

                    <strong>
                        ${valorFormatado}
                    </strong>

                </div>


                ${
                    observacoes
                        ? `
                            <div class="observacoes">

                                <strong>
                                    Observações
                                </strong>

                                <p>
                                    ${observacoes}
                                </p>

                            </div>
                          `
                        : ""
                }


                <div class="rodape-orcamento">

                    <p>
                        Este orçamento está sujeito à disponibilidade no momento da reserva.
                    </p>

                    <p>
                        ibis Styles Curitiba Centro Cívico
                    </p>

                    <p>
                        R. Comendador Araújo, 730 — Batel — Curitiba/PR
                    </p>

                </div>


            </div>

        </div>

    `;


    orcamentoPreview.style.display =
        "block";
}


// ==========================================
// EVENTO DO FORMULÁRIO
// ==========================================

if (formulario) {

    formulario.addEventListener(
        "submit",
        function (evento) {

            evento.preventDefault();

            gerarOrcamento();

        }
    );

}


// ==========================================
// COPIAR TEXTO DO ORÇAMENTO
// ==========================================

function copiarOrcamento() {

    const nome =
        document.getElementById("nomeHospede").value.trim();

    const checkin =
        document.getElementById("checkin").value;

    const checkout =
        document.getElementById("checkout").value;

    const adultos =
        parseInt(
            document.getElementById("adultos").value
        ) || 0;

    const criancas =
        parseInt(
            document.getElementById("criancas").value
        ) || 0;

    const quarto =
        document.getElementById("tipoQuarto").value;

    const cafe =
        document.getElementById("cafe").value;

    const valorDiaria =
        converterValor(
            document.getElementById("valorDiaria").value
        );

    const observacoes =
        document.getElementById("observacoes").value.trim();


    const noites =
        calcularNoites(
            checkin,
            checkout
        );


    const valorTotal =
        valorDiaria * noites;


    const dadosQuarto =
        QUARTOS[quarto];


    const textoHospedes =
        `${adultos} adulto${adultos !== 1 ? "s" : ""}` +
        (
            criancas > 0
                ? ` • ${criancas} criança${criancas !== 1 ? "s" : ""}`
                : ""
        );


    const texto = `

🏨 IBIS STYLES CURITIBA CENTRO CÍVICO

${nome ? `👤 Hóspede: ${nome}` : ""}

📅 Check-in: ${formatarDataCompleta(checkin)}
📅 Check-out: ${formatarDataCompleta(checkout)}

👥 Hóspedes: ${textoHospedes}

🛏️ Acomodação:
${dadosQuarto ? dadosQuarto.nome : ""}

☕ Café da manhã:
${
    cafe === "sim"
        ? "Incluso"
        : "Não incluso"
}

🌙 Noites: ${noites}

💰 Valor da diária:
${formatarMoeda(valorDiaria)}

💵 Valor total:
${formatarMoeda(valorTotal)}

${observacoes ? `📝 Observações:\n${observacoes}` : ""}

Este orçamento está sujeito à disponibilidade no momento da reserva.

ibis Styles Curitiba Centro Cívico
R. Comendador Araújo, 730 — Batel — Curitiba/PR
`;


    navigator.clipboard.writeText(
        texto.trim()
    )
        .then(() => {

            alert(
                "Orçamento copiado!"
            );

        })
        .catch(() => {

            alert(
                "Não foi possível copiar o orçamento."
            );

        });

}


// ==========================================
// COMPARTILHAR ORÇAMENTO
// ==========================================

function compartilharOrcamento() {

    const nome =
        document.getElementById("nomeHospede").value.trim();

    const checkin =
        document.getElementById("checkin").value;

    const checkout =
        document.getElementById("checkout").value;

    const adultos =
        parseInt(
            document.getElementById("adultos").value
        ) || 0;

    const criancas =
        parseInt(
            document.getElementById("criancas").value
        ) || 0;

    const quarto =
        document.getElementById("tipoQuarto").value;

    const cafe =
        document.getElementById("cafe").value;

    const valorDiaria =
        converterValor(
            document.getElementById("valorDiaria").value
        );

    const noites =
        calcularNoites(
            checkin,
            checkout
        );

    const valorTotal =
        valorDiaria * noites;

    const dadosQuarto =
        QUARTOS[quarto];


    const textoHospedes =
        `${adultos} adulto${adultos !== 1 ? "s" : ""}` +
        (
            criancas > 0
                ? ` • ${criancas} criança${criancas !== 1 ? "s" : ""}`
                : ""
        );


    const texto = `

🏨 *IBIS STYLES CURITIBA CENTRO CÍVICO*

${nome ? `👤 *Hóspede:* ${nome}` : ""}

📅 *Check-in:* ${formatarDataCompleta(checkin)}
📅 *Check-out:* ${formatarDataCompleta(checkout)}

👥 *Hóspedes:* ${textoHospedes}

🛏️ *Acomodação:*
${dadosQuarto ? dadosQuarto.nome : ""}

☕ *Café da manhã:*
${
    cafe === "sim"
        ? "Incluso"
        : "Não incluso"
}

🌙 *Noites:* ${noites}

💰 *Valor da diária:*
${formatarMoeda(valorDiaria)}

💵 *Valor total:*
${formatarMoeda(valorTotal)}

Este orçamento está sujeito à disponibilidade no momento da reserva.

ibis Styles Curitiba Centro Cívico
R. Comendador Araújo, 730 — Batel — Curitiba/PR
`;


    const mensagem =
        encodeURIComponent(
            texto.trim()
        );


    const url =
        `https://wa.me/?text=${mensagem}`;


    window.open(
        url,
        "_blank"
    );

}


// ==========================================
// OCR — ELEMENTOS
// ==========================================

const arquivoOrcamento =
    document.getElementById(
        "arquivoOrcamento"
    );

const imagemSelecionada =
    document.getElementById(
        "imagemSelecionada"
    );

const btnLerOrcamento =
    document.getElementById(
        "btnLerOrcamento"
    );

const statusOcr =
    document.getElementById(
        "statusOcr"
    );


// ==========================================
// OCR — SELECIONAR IMAGEM
// ==========================================

if (arquivoOrcamento) {

    arquivoOrcamento.addEventListener(
        "change",
        function () {

            const arquivo =
                this.files &&
                this.files[0];

            if (!arquivo) {
                return;
            }


            const leitor =
                new FileReader();


            leitor.onload =
                function (evento) {

                    if (imagemSelecionada) {

                        imagemSelecionada.src =
                            evento.target.result;

                        imagemSelecionada.style.display =
                            "block";

                    }

                    if (btnLerOrcamento) {

                        btnLerOrcamento.disabled =
                            false;

                    }

                    if (statusOcr) {

                        statusOcr.textContent =
                            "Imagem carregada. Clique em “Ler orçamento”.";

                    }

                };


            leitor.readAsDataURL(
                arquivo
            );

        }
    );

}


// ==========================================
// OCR — LER ORÇAMENTO
// ==========================================

if (btnLerOrcamento) {

    btnLerOrcamento.addEventListener(
        "click",
        async function () {

            if (
                !arquivoOrcamento ||
                !arquivoOrcamento.files ||
                !arquivoOrcamento.files[0]
            ) {

                alert(
                    "Selecione uma imagem primeiro."
                );

                return;

            }


            const arquivo =
                arquivoOrcamento.files[0];


            try {

                btnLerOrcamento.disabled =
                    true;


                if (statusOcr) {

                    statusOcr.textContent =
                        "⏳ Lendo o orçamento...";

                }


                if (
                    typeof Tesseract ===
                    "undefined"
                ) {

                    await carregarTesseract();

                }


                const resultado =
                    await Tesseract.recognize(
                        arquivo,
                        "por",
                        {
                            logger:
                                function (info) {

                                    if (
                                        statusOcr &&
                                        info.status
                                    ) {

                                        let progresso =
                                            "";

                                        if (
                                            typeof info.progress ===
                                            "number"
                                        ) {

                                            progresso =
                                                ` ${Math.round(info.progress * 100)}%`;

                                        }

                                        statusOcr.textContent =
                                            `⏳ ${info.status}${progresso}`;

                                    }

                                }
                        }
                    );


                const texto =
                    resultado &&
                    resultado.data
                        ? resultado.data.text
                        : "";


                if (!texto.trim()) {

                    throw new Error(
                        "Nenhum texto foi encontrado na imagem."
                    );

                }


                preencherCamposComOCR(
                    texto
                );


                if (statusOcr) {

                    statusOcr.textContent =
                        "✅ Orçamento lido. Confira os dados antes de gerar.";

                }


            } catch (erro) {

                console.error(
                    "Erro no OCR:",
                    erro
                );


                if (statusOcr) {

                    statusOcr.textContent =
                        "❌ Não foi possível ler o orçamento.";

                }


                alert(
                    "Não foi possível ler o orçamento automaticamente. Confira a imagem e tente novamente."
                );


            } finally {

                btnLerOrcamento.disabled =
                    false;

            }

        }
    );

}


// ==========================================
// CARREGAR TESSERACT
// ==========================================

function carregarTesseract() {

    return new Promise(
        (resolve, reject) => {

            if (
                typeof Tesseract !==
                "undefined"
            ) {

                resolve();

                return;

            }


            const script =
                document.createElement(
                    "script"
                );


            script.src =
                "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";


            script.onload =
                function () {

                    resolve();

                };


            script.onerror =
                function () {

                    reject(
                        new Error(
                            "Não foi possível carregar o OCR."
                        )
                    );

                };


            document.head.appendChild(
                script
            );

        }
    );

}


// ==========================================
// NORMALIZAR TEXTO OCR
// ==========================================

function normalizarTextoOCR(texto) {

    return texto
        .replace(/\r/g, "")
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

}


// ==========================================
// ENCONTRAR DATA NO TEXTO
// ==========================================

function encontrarDatas(texto) {

    const datas = [];


    const padrao =
        /\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})\b/g;


    let resultado;


    while (
        (resultado =
            padrao.exec(texto)) !== null
    ) {

        let dia =
            resultado[1]
                .padStart(2, "0");

        let mes =
            resultado[2]
                .padStart(2, "0");

        let ano =
            resultado[3];


        if (ano.length === 2) {

            ano =
                `20${ano}`;

        }


        datas.push(
            `${ano}-${mes}-${dia}`
        );

    }


    return datas;

}


// ==========================================
// ENCONTRAR VALOR EM REAIS
// ==========================================

function encontrarValores(texto) {

    const valores = [];


    const padrao =
        /R\$\s*([\d.]+(?:,\d{1,2})?)/gi;


    let resultado;


    while (
        (resultado =
            padrao.exec(texto)) !== null
    ) {

        const valor =
            converterValor(
                resultado[1]
            );


        if (valor > 0) {

            valores.push(
                valor
            );

        }

    }


    return valores;

}


// ==========================================
// IDENTIFICAR QUARTO
// ==========================================

function identificarQuarto(texto) {

    const textoNormalizado =
        texto
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            );


    if (
        textoNormalizado.includes(
            "conjugado"
        )
    ) {

        return "S2C";

    }


    if (
        textoNormalizado.includes(
            "sofa"
        ) &&
        textoNormalizado.includes(
            "cama"
        )
    ) {

        return "DSC";

    }


    if (
        textoNormalizado.includes(
            "superior"
        ) &&
        (
            textoNormalizado.includes(
                "casal"
            ) ||
            textoNormalizado.includes(
                "double"
            )
        )
    ) {

        return "DBB";

    }


    if (
        textoNormalizado.includes(
            "superior"
        ) &&
        (
            textoNormalizado.includes(
                "solteiro"
            ) ||
            textoNormalizado.includes(
                "twin"
            )
        )
    ) {

        return "TWB";

    }


    if (
        textoNormalizado.includes(
            "casal"
        ) ||
        textoNormalizado.includes(
            "double"
        )
    ) {

        return "DBC";

    }


    if (
        textoNormalizado.includes(
            "solteiro"
        ) ||
        textoNormalizado.includes(
            "twin"
        )
    ) {

        return "TWC";

    }


    return "";

}


// ==========================================
// PREENCHER CAMPOS COM OCR
// ==========================================

function preencherCamposComOCR(
    textoOriginal
) {

    const texto =
        normalizarTextoOCR(
            textoOriginal
        );


    console.log(
        "Texto OCR:",
        texto
    );


    const datas =
        encontrarDatas(
            texto
        );


    if (datas.length >= 1) {

        const campoCheckin =
            document.getElementById(
                "checkin"
            );


        if (
            campoCheckin &&
            !campoCheckin.value
        ) {

            campoCheckin.value =
                datas[0];

        }

    }


    if (datas.length >= 2) {

        const campoCheckout =
            document.getElementById(
                "checkout"
            );


        if (
            campoCheckout &&
            !campoCheckout.value
        ) {

            campoCheckout.value =
                datas[1];

        }

    }


    const valores =
        encontrarValores(
            texto
        );


    if (valores.length) {

        const campoValor =
            document.getElementById(
                "valorDiaria"
            );


        if (
            campoValor &&
            !campoValor.value
        ) {

            campoValor.value =
                valores[0]
                    .toLocaleString(
                        "pt-BR",
                        {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }
                    );

        }

    }


    const quarto =
        identificarQuarto(
            texto
        );


    if (quarto) {

        const campoQuarto =
            document.getElementById(
                "tipoQuarto"
            );


        if (
            campoQuarto
        ) {

            campoQuarto.value =
                quarto;

        }

    }


    const textoNormalizado =
        texto
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            );


    const campoCafe =
        document.getElementById(
            "cafe"
        );


    if (campoCafe) {

        if (
            textoNormalizado.includes(
                "cafe da manha incluso"
            ) ||
            textoNormalizado.includes(
                "cafe da manha"
            )
        ) {

            campoCafe.value =
                "sim";

        }

    }


    const campoAdultos =
        document.getElementById(
            "adultos"
        );


    if (campoAdultos) {

        const adultoMatch =
            texto.match(
                /(\d+)\s*adultos?/i
            );


        if (
            adultoMatch &&
            !campoAdultos.value
        ) {

            campoAdultos.value =
                adultoMatch[1];

        }

    }


    const campoCriancas =
        document.getElementById(
            "criancas"
        );


    if (campoCriancas) {

        const criancaMatch =
            texto.match(
                /(\d+)\s*crian[cç]as?/i
            );


        if (
            criancaMatch &&
            !campoCriancas.value
        ) {

            campoCriancas.value =
                criancaMatch[1];

        }

    }

}


// ==========================================
// COPIAR IMAGEM DO ORÇAMENTO
// ==========================================

async function copiarImagemOrcamento() {

    const elemento =
        document.querySelector(
            "#orcamentoPreview .orcamento"
        );


    if (!elemento) {

        alert(
            "Primeiro gere o orçamento."
        );

        return;

    }


    const botao =
        document.querySelector(
            '.acoes-compartilhar button[onclick="copiarImagemOrcamento()"]'
        );


    const textoOriginal =
        botao
            ? botao.innerHTML
            : "";


    if (botao) {

        botao.disabled =
            true;

        botao.innerHTML =
            "⏳ Preparando imagem...";

    }


    let areaCaptura =
        null;


    try {

        await carregarHtml2Canvas();


        const copia =
            elemento.cloneNode(true);


        copia.style.width =
            "600px";

        copia.style.maxWidth =
            "600px";

        copia.style.minWidth =
            "600px";

        copia.style.height =
            "auto";

        copia.style.margin =
            "0";

        copia.style.boxSizing =
            "border-box";

        copia.style.overflow =
            "hidden";

        copia.style.background =
            "#ffffff";


        const logo =
            copia.querySelector(
                ".logo-hotel img"
            );


        if (logo) {

            logo.style.width =
                "180px";

            logo.style.maxWidth =
                "180px";

            logo.style.height =
                "auto";

            logo.style.maxHeight =
                "120px";

            logo.style.objectFit =
                "contain";

            logo.style.display =
                "block";

        }


        const topo =
            copia.querySelector(
                ".orcamento-topo"
            );


        if (topo) {

            topo.style.width =
                "100%";

            topo.style.boxSizing =
                "border-box";

            topo.style.overflow =
                "hidden";

            topo.style.display =
                "flex";

            topo.style.alignItems =
                "center";

            topo.style.justifyContent =
                "space-between";

        }


        areaCaptura =
            document.createElement(
                "div"
            );


        areaCaptura.style.position =
            "fixed";

        areaCaptura.style.left =
            "-10000px";

        areaCaptura.style.top =
            "0";

        areaCaptura.style.width =
            "600px";

        areaCaptura.style.background =
            "#ffffff";

        areaCaptura.style.zIndex =
            "-1";


        areaCaptura.appendChild(
            copia
        );


        document.body.appendChild(
            areaCaptura
        );


        const imagens =
            copia.querySelectorAll(
                "img"
            );


        await Promise.all(
            Array.from(imagens).map(
                img => {

                    if (
                        img.complete
                    ) {

                        return Promise.resolve();

                    }


                    return new Promise(
                        resolve => {

                            img.onload =
                                resolve;

                            img.onerror =
                                resolve;

                        }
                    );

                }
            )
        );


        const canvas =
            await html2canvas(
                copia,
                {
                    scale: 2,
                    backgroundColor:
                        "#ffffff",
                    useCORS: true,
                    allowTaint: false,
                    imageTimeout:
                        15000,
                    logging: false,
                    width: 600,
                    windowWidth: 600
                }
            );


        if (areaCaptura) {

            areaCaptura.remove();

            areaCaptura =
                null;

        }


        const blob =
            await new Promise(
                resolve => {

                    canvas.toBlob(
                        resolve,
                        "image/png"
                    );

                }
            );


        if (!blob) {

            throw new Error(
                "Não foi possível criar a imagem."
            );

        }


        if (
            navigator.clipboard &&
            window.ClipboardItem
        ) {

            const item =
                new ClipboardItem({
                    "image/png": blob
                });


            await navigator.clipboard.write(
                [item]
            );


            if (botao) {

                botao.innerHTML =
                    "✅ Imagem copiada!";

            }


            setTimeout(
                () => {

                    if (botao) {

                        botao.innerHTML =
                            textoOriginal;

                    }

                },
                2500
            );


        } else {

            baixarImagemOrcamento(
                blob
            );


            alert(
                "Seu navegador não permite copiar imagens diretamente. A imagem foi salva no computador."
            );


            if (botao) {

                botao.innerHTML =
                    textoOriginal;

            }

        }


    } catch (erro) {

        console.error(
            "Erro ao copiar imagem:",
            erro
        );


        if (areaCaptura) {

            areaCaptura.remove();

        }


        alert(
            "Não foi possível copiar a imagem do orçamento."
        );


        if (botao) {

            botao.innerHTML =
                textoOriginal;

        }

    }


    if (botao) {

        botao.disabled =
            false;

    }

}


// ==========================================
// CARREGAR HTML2CANVAS
// ==========================================

function carregarHtml2Canvas() {

    return new Promise(
        (resolve, reject) => {

            if (
                window.html2canvas
            ) {

                resolve();

                return;

            }


            const script =
                document.createElement(
                    "script"
                );


            script.src =
                "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";


            script.onload =
                resolve;


            script.onerror =
                reject;


            document.head.appendChild(
                script
            );

        }
    );

}


// ==========================================
// BAIXAR IMAGEM DO ORÇAMENTO
// ==========================================

function baixarImagemOrcamento(
    blob
) {

    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        "orcamento-ibis-styles.png";


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    URL.revokeObjectURL(
        url
    );

}
// ==========================================
// FUNÇÕES AUXILIARES PARA OCR
// ==========================================

function extrairNumero(texto) {

    if (!texto) {
        return "";
    }

    const match =
        texto.match(/\d+/);

    return match
        ? match[0]
        : "";
}


// ==========================================
// IDENTIFICAR NÚMERO DE HÓSPEDES
// ==========================================

function identificarHospedes(texto) {

    const resultado = {
        adultos: "",
        criancas: ""
    };


    if (!texto) {
        return resultado;
    }


    const textoNormalizado =
        texto
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            );


    const adultos =
        textoNormalizado.match(
            /(\d+)\s*adultos?/
        );


    if (adultos) {

        resultado.adultos =
            adultos[1];

    }


    const criancas =
        textoNormalizado.match(
            /(\d+)\s*criancas?/
        );


    if (criancas) {

        resultado.criancas =
            criancas[1];

    }


    return resultado;

}


// ==========================================
// IDENTIFICAR CAFÉ DA MANHÃ
// ==========================================

function identificarCafe(texto) {

    if (!texto) {
        return "";
    }


    const textoNormalizado =
        texto
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            );


    if (
        textoNormalizado.includes(
            "cafe da manha incluso"
        )
    ) {

        return "sim";

    }


    if (
        textoNormalizado.includes(
            "cafe da manha"
        )
    ) {

        return "sim";

    }


    if (
        textoNormalizado.includes(
            "sem cafe"
        )
    ) {

        return "nao";

    }


    return "";

}


// ==========================================
// IDENTIFICAR NOME DO HÓSPEDE
// ==========================================

function identificarNomeHospede(texto) {

    if (!texto) {
        return "";
    }


    const linhas =
        texto
            .split("\n")
            .map(
                linha =>
                    linha.trim()
            )
            .filter(Boolean);


    const palavrasIgnoradas = [

        "ibis",
        "styles",
        "curitiba",
        "centro",
        "civico",
        "hotel",
        "orcamento",
        "reserva",
        "check-in",
        "check-out",
        "hospede",
        "adultos",
        "criancas",
        "acomodacao",
        "quarto",
        "cafe",
        "manha",
        "total",
        "diaria"

    ];


    for (
        const linha
        of linhas
    ) {

        const linhaNormalizada =
            linha
                .toLowerCase()
                .normalize("NFD")
                .replace(
                    /[\u0300-\u036f]/g,
                    ""
                );


        if (
            linha.length < 3 ||
            linha.length > 80
        ) {

            continue;

        }


        if (
            palavrasIgnoradas.some(
                palavra =>
                    linhaNormalizada.includes(
                        palavra
                    )
            )
        ) {

            continue;

        }


        if (
            /\d/.test(linha)
        ) {

            continue;

        }


        const palavras =
            linha.split(/\s+/);


        if (
            palavras.length >= 2 &&
            palavras.length <= 6
        ) {

            return linha;

        }

    }


    return "";

}


// ==========================================
// IDENTIFICAR VALOR DA DIÁRIA
// ==========================================

function identificarValorDiaria(
    texto
) {

    if (!texto) {
        return "";
    }


    const linhas =
        texto.split("\n");


    for (
        const linha
        of linhas
    ) {

        if (
            !linha.includes("R$") &&
            !linha.includes("R$")
        ) {

            continue;

        }


        const valores =
            linha.match(
                /R\$\s*[\d.,]+/g
            );


        if (
            valores &&
            valores.length
        ) {

            const ultimo =
                valores[
                    valores.length - 1
                ];


            return ultimo
                .replace(
                    /R\$\s*/i,
                    ""
                )
                .trim();

        }

    }


    const valores =
        encontrarValores(
            texto
        );


    if (
        valores.length
    ) {

        return valores[0]
            .toLocaleString(
                "pt-BR",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );

    }


    return "";

}


// ==========================================
// IDENTIFICAR DATAS COM CONTEXTO
// ==========================================

function identificarDatasComContexto(
    texto
) {

    const resultado = {
        checkin: "",
        checkout: ""
    };


    if (!texto) {
        return resultado;
    }


    const linhas =
        texto.split("\n");


    for (
        let i = 0;
        i < linhas.length;
        i++
    ) {

        const linha =
            linhas[i]
                .trim();


        const normalizada =
            linha
                .toLowerCase()
                .normalize("NFD")
                .replace(
                    /[\u0300-\u036f]/g,
                    ""
                );


        const datas =
            encontrarDatas(
                linha
            );


        if (
            !datas.length
        ) {

            continue;

        }


        if (
            normalizada.includes(
                "check-in"
            ) ||
            normalizada.includes(
                "check in"
            ) ||
            normalizada.includes(
                "entrada"
            )
        ) {

            if (
                !resultado.checkin
            ) {

                resultado.checkin =
                    datas[0];

            }

        }


        if (
            normalizada.includes(
                "check-out"
            ) ||
            normalizada.includes(
                "check out"
            ) ||
            normalizada.includes(
                "saida"
            )
        ) {

            if (
                !resultado.checkout
            ) {

                resultado.checkout =
                    datas[0];

            }

        }

    }


    if (
        !resultado.checkin ||
        !resultado.checkout
    ) {

        const datas =
            encontrarDatas(
                texto
            );


        if (
            !resultado.checkin &&
            datas.length >= 1
        ) {

            resultado.checkin =
                datas[0];

        }


        if (
            !resultado.checkout &&
            datas.length >= 2
        ) {

            resultado.checkout =
                datas[1];

        }

    }


    return resultado;

}


// ==========================================
// PREENCHER CAMPOS OCR — VERSÃO COMPLETA
// ==========================================

function aplicarDadosOCR(
    textoOriginal
) {

    const texto =
        normalizarTextoOCR(
            textoOriginal
        );


    const datas =
        identificarDatasComContexto(
            texto
        );


    const hospedes =
        identificarHospedes(
            texto
        );


    const quarto =
        identificarQuarto(
            texto
        );


    const cafe =
        identificarCafe(
            texto
        );


    const valor =
        identificarValorDiaria(
            texto
        );


    const nome =
        identificarNomeHospede(
            texto
        );


    const campoCheckin =
        document.getElementById(
            "checkin"
        );


    const campoCheckout =
        document.getElementById(
            "checkout"
        );


    const campoAdultos =
        document.getElementById(
            "adultos"
        );


    const campoCriancas =
        document.getElementById(
            "criancas"
        );


    const campoQuarto =
        document.getElementById(
            "tipoQuarto"
        );


    const campoCafe =
        document.getElementById(
            "cafe"
        );


    const campoValor =
        document.getElementById(
            "valorDiaria"
        );


    const campoNome =
        document.getElementById(
            "nomeHospede"
        );


    if (
        campoCheckin &&
        datas.checkin
    ) {

        campoCheckin.value =
            datas.checkin;

    }


    if (
        campoCheckout &&
        datas.checkout
    ) {

        campoCheckout.value =
            datas.checkout;

    }


    if (
        campoAdultos &&
        hospedes.adultos
    ) {

        campoAdultos.value =
            hospedes.adultos;

    }


    if (
        campoCriancas &&
        hospedes.criancas
    ) {

        campoCriancas.value =
            hospedes.criancas;

    }


    if (
        campoQuarto &&
        quarto
    ) {

        campoQuarto.value =
            quarto;

    }


    if (
        campoCafe &&
        cafe
    ) {

        campoCafe.value =
            cafe;

    }


    if (
        campoValor &&
        valor
    ) {

        campoValor.value =
            valor;

    }


    if (
        campoNome &&
        nome
    ) {

        campoNome.value =
            nome;

    }


    // Dispara eventos para manter
    // qualquer lógica adicional da página.

    [
        campoCheckin,
        campoCheckout,
        campoAdultos,
        campoCriancas,
        campoQuarto,
        campoCafe,
        campoValor,
        campoNome

    ].forEach(
        campo => {

            if (campo) {

                campo.dispatchEvent(
                    new Event(
                        "input",
                        {
                            bubbles: true
                        }
                    )
                );


                campo.dispatchEvent(
                    new Event(
                        "change",
                        {
                            bubbles: true
                        }
                    )
                );

            }

        }
    );

}


// ==========================================
// COMPATIBILIDADE COM OCR EXISTENTE
// ==========================================

function preencherCamposComOCRSeguro(
    texto
) {

    try {

        aplicarDadosOCR(
            texto
        );

    } catch (erro) {

        console.error(
            "Erro ao preencher campos pelo OCR:",
            erro
        );


        try {

            preencherCamposComOCR(
                texto
            );

        } catch (
            erroFallback
        ) {

            console.error(
                "Erro no preenchimento alternativo:",
                erroFallback
            );

        }

    }

}


// ==========================================
// BOTÃO LIMPAR OCR
// ==========================================

const btnLimparOcr =
    document.getElementById(
        "btnLimparOcr"
    );


if (btnLimparOcr) {

    btnLimparOcr.addEventListener(
        "click",
        function () {

            if (arquivoOrcamento) {

                arquivoOrcamento.value =
                    "";

            }


            if (imagemSelecionada) {

                imagemSelecionada.src =
                    "";

                imagemSelecionada.style.display =
                    "none";

            }


            if (statusOcr) {

                statusOcr.textContent =
                    "";

            }


            if (btnLerOrcamento) {

                btnLerOrcamento.disabled =
                    true;

            }

        }
    );

}


// ==========================================
// GERAR AUTOMATICAMENTE AO USAR OCR
// ==========================================

const btnGerarOrcamento =
    document.getElementById(
        "btnGerarOrcamento"
    );


if (btnGerarOrcamento) {

    btnGerarOrcamento.addEventListener(
        "click",
        function () {

            gerarOrcamento();

        }
    );

}


// ==========================================
// ATUALIZAR PRÉVIA QUANDO CAMPOS MUDAM
// ==========================================

const camposFormulario = [

    "nomeHospede",
    "checkin",
    "checkout",
    "adultos",
    "criancas",
    "tipoQuarto",
    "cafe",
    "valorDiaria",
    "observacoes"

];


camposFormulario.forEach(
    id => {

        const campo =
            document.getElementById(
                id
            );


        if (!campo) {
            return;
        }


        campo.addEventListener(
            "input",
            function () {

                // Não gera automaticamente
                // se ainda não houver datas.
                // Apenas mantém o comportamento
                // normal do formulário.

            }
        );

    }
);


// ==========================================
// FIM DA PARTE 2
// ==========================================
// ==========================================
// MELHORIAS NO OCR
// ==========================================

// Alguns sistemas de reserva exibem as datas
// no formato DD/MM/YYYY.
// Esta função converte para YYYY-MM-DD,
// que é o formato aceito pelos inputs type="date".

function converterDataParaInput(
    data
) {

    if (!data) {
        return "";
    }


    // Já está no formato correto.

    if (
        /^\d{4}-\d{2}-\d{2}$/.test(
            data
        )
    ) {

        return data;

    }


    const match =
        data.match(
            /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/
        );


    if (!match) {
        return "";
    }


    let dia =
        match[1].padStart(
            2,
            "0"
        );


    let mes =
        match[2].padStart(
            2,
            "0"
        );


    let ano =
        match[3];


    if (
        ano.length === 2
    ) {

        ano =
            `20${ano}`;

    }


    return `${ano}-${mes}-${dia}`;

}


// ==========================================
// LIMPAR VALOR OCR
// ==========================================

function limparValorOCR(
    valor
) {

    if (!valor) {
        return "";
    }


    let texto =
        valor
            .toString()
            .replace(
                /R\$/gi,
                ""
            )
            .trim();


    // Remove espaços.

    texto =
        texto.replace(
            /\s/g,
            ""
        );


    // Se houver ponto e vírgula,
    // considera ponto como separador
    // de milhares.

    if (
        texto.includes(",")
    ) {

        texto =
            texto.replace(
                /\./g,
                ""
            );


        texto =
            texto.replace(
                ",",
                "."
            );

    }


    const numero =
        parseFloat(
            texto
        );


    if (
        isNaN(numero)
    ) {

        return "";

    }


    return numero.toLocaleString(
        "pt-BR",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}


// ==========================================
// OCR — TENTAR ENCONTRAR PREÇO
// ==========================================

function encontrarPrecoOCR(
    texto
) {

    if (!texto) {
        return "";
    }


    const linhas =
        texto.split("\n");


    // Primeiro procura linhas que
    // tenham palavras relacionadas
    // à diária.

    const palavrasDiaria = [

        "diaria",
        "diária",
        "noite",
        "noites",
        "apartamento",
        "acomodacao",
        "acomodação",
        "hospedagem",
        "total"

    ];


    for (
        const linha
        of linhas
    ) {

        const linhaNormalizada =
            linha
                .toLowerCase()
                .normalize("NFD")
                .replace(
                    /[\u0300-\u036f]/g,
                    ""
                );


        const temPalavra =
            palavrasDiaria.some(
                palavra => {

                    const palavraNormalizada =
                        palavra
                            .normalize("NFD")
                            .replace(
                                /[\u0300-\u036f]/g,
                                ""
                            );

                    return linhaNormalizada.includes(
                        palavraNormalizada
                    );

                }
            );


        if (!temPalavra) {
            continue;
        }


        const valores =
            linha.match(
                /(?:R\$\s*)?\d{1,3}(?:\.\d{3})*(?:,\d{2})?/g
            );


        if (
            valores &&
            valores.length
        ) {

            const ultimo =
                valores[
                    valores.length - 1
                ];


            const limpo =
                limparValorOCR(
                    ultimo
                );


            if (limpo) {
                return limpo;
            }

        }

    }


    // Se não encontrar por contexto,
    // procura qualquer valor monetário.

    const valores =
        texto.match(
            /R\$\s*\d{1,3}(?:\.\d{3})*(?:,\d{2})?/g
        );


    if (
        valores &&
        valores.length
    ) {

        return limparValorOCR(
            valores[0]
        );

    }


    return "";

}


// ==========================================
// OCR — IDENTIFICAR TIPO DE QUARTO
// ==========================================

function identificarTipoQuartoOCR(
    texto
) {

    if (!texto) {
        return "";
    }


    const normalizado =
        texto
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            );


    // Conjugado

    if (
        normalizado.includes(
            "conjugado"
        )
    ) {

        return "S2C";

    }


    // Sofá-cama

    if (
        (
            normalizado.includes(
                "sofa"
            ) ||
            normalizado.includes(
                "sofa-cama"
            )
        ) &&
        normalizado.includes(
            "cama"
        )
    ) {

        return "DSC";

    }


    // Superior + casal

    if (
        normalizado.includes(
            "superior"
        ) &&
        (
            normalizado.includes(
                "casal"
            ) ||
            normalizado.includes(
                "double"
            )
        )
    ) {

        return "DBB";

    }


    // Superior + solteiro

    if (
        normalizado.includes(
            "superior"
        ) &&
        (
            normalizado.includes(
                "solteiro"
            ) ||
            normalizado.includes(
                "twin"
            )
        )
    ) {

        return "TWB";

    }


    // Casal

    if (
        normalizado.includes(
            "casal"
        ) ||
        normalizado.includes(
            "double"
        )
    ) {

        return "DBC";

    }


    // Solteiro

    if (
        normalizado.includes(
            "solteiro"
        ) ||
        normalizado.includes(
            "twin"
        )
    ) {

        return "TWC";

    }


    return "";

}


// ==========================================
// OCR — IDENTIFICAR QUANTIDADE DE ADULTOS
// ==========================================

function identificarAdultosOCR(
    texto
) {

    if (!texto) {
        return "";
    }


    const normalizado =
        texto
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            );


    const padroes = [

        /(\d+)\s*adultos?/i,

        /adultos?\s*[:\-]?\s*(\d+)/i,

        /(\d+)\s*pax/i,

        /pax\s*[:\-]?\s*(\d+)/i

    ];


    for (
        const padrao
        of padroes
    ) {

        const resultado =
            normalizado.match(
                padrao
            );


        if (
            resultado
        ) {

            return resultado[1];

        }

    }


    return "";

}


// ==========================================
// OCR — IDENTIFICAR CRIANÇAS
// ==========================================

function identificarCriancasOCR(
    texto
) {

    if (!texto) {
        return "";
    }


    const normalizado =
        texto
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            );


    const resultado =
        normalizado.match(
            /(\d+)\s*criancas?/i
        );


    if (
        resultado
    ) {

        return resultado[1];

    }


    return "";

}


// ==========================================
// OCR — IDENTIFICAR CAFÉ
// ==========================================

function identificarCafeOCR(
    texto
) {

    if (!texto) {
        return "";
    }


    const normalizado =
        texto
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            );


    if (
        normalizado.includes(
            "sem cafe"
        )
    ) {

        return "nao";

    }


    if (
        normalizado.includes(
            "cafe da manha"
        )
    ) {

        return "sim";

    }


    if (
        normalizado.includes(
            "cafe incluso"
        )
    ) {

        return "sim";

    }


    if (
        normalizado.includes(
            "breakfast included"
        )
    ) {

        return "sim";

    }


    return "";

}


// ==========================================
// OCR — APLICAR RESULTADO FINAL
// ==========================================

function processarResultadoOCR(
    texto
) {

    if (!texto) {

        throw new Error(
            "O OCR não retornou texto."
        );

    }


    const textoLimpo =
        normalizarTextoOCR(
            texto
        );


    console.log(
        "===== TEXTO OCR ====="
    );

    console.log(
        textoLimpo
    );


    const datas =
        identificarDatasComContexto(
            textoLimpo
        );


    const valor =
        encontrarPrecoOCR(
            textoLimpo
        );


    const quarto =
        identificarTipoQuartoOCR(
            textoLimpo
        );


    const adultos =
        identificarAdultosOCR(
            textoLimpo
        );


    const criancas =
        identificarCriancasOCR(
            textoLimpo
        );


    const cafe =
        identificarCafeOCR(
            textoLimpo
        );


    const campoNome =
        document.getElementById(
            "nomeHospede"
        );


    const campoCheckin =
        document.getElementById(
            "checkin"
        );


    const campoCheckout =
        document.getElementById(
            "checkout"
        );


    const campoAdultos =
        document.getElementById(
            "adultos"
        );


    const campoCriancas =
        document.getElementById(
            "criancas"
        );


    const campoQuarto =
        document.getElementById(
            "tipoQuarto"
        );


    const campoCafe =
        document.getElementById(
            "cafe"
        );


    const campoValor =
        document.getElementById(
            "valorDiaria"
        );


    // --------------------------------------
    // DATAS
    // --------------------------------------

    if (
        campoCheckin &&
        datas.checkin
    ) {

        campoCheckin.value =
            converterDataParaInput(
                datas.checkin
            );

    }


    if (
        campoCheckout &&
        datas.checkout
    ) {

        campoCheckout.value =
            converterDataParaInput(
                datas.checkout
            );

    }


    // --------------------------------------
    // ADULTOS
    // --------------------------------------

    if (
        campoAdultos &&
        adultos
    ) {

        campoAdultos.value =
            adultos;

    }


    // --------------------------------------
    // CRIANÇAS
    // --------------------------------------

    if (
        campoCriancas &&
        criancas
    ) {

        campoCriancas.value =
            criancas;

    }


    // --------------------------------------
    // QUARTO
    // --------------------------------------

    if (
        campoQuarto &&
        quarto
    ) {

        campoQuarto.value =
            quarto;

    }


    // --------------------------------------
    // CAFÉ
    // --------------------------------------

    if (
        campoCafe &&
        cafe
    ) {

        campoCafe.value =
            cafe;

    }


    // --------------------------------------
    // VALOR
    // --------------------------------------

    if (
        campoValor &&
        valor
    ) {

        campoValor.value =
            valor;

    }


    // --------------------------------------
    // EVENTOS
    // --------------------------------------

    const campos = [

        campoNome,
        campoCheckin,
        campoCheckout,
        campoAdultos,
        campoCriancas,
        campoQuarto,
        campoCafe,
        campoValor

    ];


    campos.forEach(
        campo => {

            if (!campo) {
                return;
            }


            campo.dispatchEvent(
                new Event(
                    "input",
                    {
                        bubbles: true
                    }
                )
            );


            campo.dispatchEvent(
                new Event(
                    "change",
                    {
                        bubbles: true
                    }
                )
            );

        }
    );


    return {

        datas,
        valor,
        quarto,
        adultos,
        criancas,
        cafe

    };

}


// ==========================================
// GARANTIR QUE O BOTÃO OCR USE O PROCESSADOR
// ==========================================

if (btnLerOrcamento) {

    btnLerOrcamento.onclick =
        async function () {

            if (
                !arquivoOrcamento ||
                !arquivoOrcamento.files ||
                !arquivoOrcamento.files.length
            ) {

                alert(
                    "Selecione o print do orçamento primeiro."
                );

                return;

            }


            const arquivo =
                arquivoOrcamento.files[0];


            if (
                !arquivo.type.startsWith(
                    "image/"
                )
            ) {

                alert(
                    "Selecione um arquivo de imagem."
                );

                return;

            }


            try {

                btnLerOrcamento.disabled =
                    true;


                if (statusOcr) {

                    statusOcr.textContent =
                        "⏳ Preparando leitura do print...";

                }


                await carregarTesseract();


                if (statusOcr) {

                    statusOcr.textContent =
                        "⏳ Lendo o print...";

                }


                const resultado =
                    await Tesseract.recognize(
                        arquivo,
                        "por",
                        {

                            logger:
                                info => {

                                    if (
                                        !statusOcr
                                    ) {

                                        return;

                                    }


                                    if (
                                        info.status ===
                                        "recognizing text"
                                    ) {

                                        const porcentagem =
                                            Math.round(
                                                (
                                                    info.progress ||
                                                    0
                                                ) * 100
                                            );


                                        statusOcr.textContent =
                                            `⏳ Lendo o orçamento... ${porcentagem}%`;

                                    } else if (
                                        info.status
                                    ) {

                                        statusOcr.textContent =
                                            `⏳ ${info.status}`;

                                    }

                                }

                        }
                    );


                const texto =
                    resultado &&
                    resultado.data
                        ? resultado.data.text
                        : "";


                if (
                    !texto.trim()
                ) {

                    throw new Error(
                        "Nenhum texto foi identificado no print."
                    );

                }


                processarResultadoOCR(
                    texto
                );


                if (statusOcr) {

                    statusOcr.textContent =
                        "✅ Dados extraídos. Confira os campos antes de gerar o orçamento.";

                }


            } catch (erro) {

                console.error(
                    "Erro completo no OCR:",
                    erro
                );


                if (statusOcr) {

                    statusOcr.textContent =
                        "❌ Erro ao ler o print.";

                }


                alert(
                    "Não foi possível ler o print. Tente novamente com uma imagem mais nítida."
                );


            } finally {

                btnLerOrcamento.disabled =
                    false;

            }

        };

}


// ==========================================
// PREVIEW DA IMAGEM SELECIONADA
// ==========================================

if (arquivoOrcamento) {

    arquivoOrcamento.addEventListener(
        "change",
        function () {

            const arquivo =
                this.files &&
                this.files[0];


            if (!arquivo) {

                return;

            }


            if (
                !arquivo.type.startsWith(
                    "image/"
                )
            ) {

                alert(
                    "Selecione uma imagem válida."
                );


                this.value =
                    "";


                return;

            }


            const leitor =
                new FileReader();


            leitor.onload =
                function (evento) {

                    if (
                        imagemSelecionada
                    ) {

                        imagemSelecionada.src =
                            evento.target.result;

                        imagemSelecionada.style.display =
                            "block";

                    }


                    if (
                        btnLerOrcamento
                    ) {

                        btnLerOrcamento.disabled =
                            false;

                    }


                    if (
                        statusOcr
                    ) {

                        statusOcr.textContent =
                            "✅ Print carregado. Clique em “Ler orçamento”.";

                    }

                };


            leitor.onerror =
                function () {

                    if (
                        statusOcr
                    ) {

                        statusOcr.textContent =
                            "❌ Não foi possível carregar o print.";

                    }

                };


            leitor.readAsDataURL(
                arquivo
            );

        }
    );

}


// ==========================================
// FINALIZAÇÃO
// ==========================================

console.log(
    "✅ Gerador de Orçamentos carregado."
);
