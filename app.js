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
// FUNÇÕES GERAIS
// ==========================================

function converterValor(valor) {

    if (!valor) {
        return 0;
    }

    let texto = valor
        .toString()
        .replace(/R\$/gi, "")
        .replace(/\s/g, "")
        .replace(/\./g, "")
        .replace(",", ".");

    return parseFloat(texto) || 0;
}


function formatarMoeda(valor) {

    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}


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

    const diaSemana = diasSemana[dataObj.getDay()];

    return `${formatarData(data)} — ${diaSemana}`;

}


function calcularNoites(checkin, checkout) {

    if (!checkin || !checkout) {
        return 0;
    }

    const entrada = new Date(`${checkin}T12:00:00`);
    const saida = new Date(`${checkout}T12:00:00`);

    const diferenca = saida.getTime() - entrada.getTime();

    const noites = Math.round(
        diferenca / (1000 * 60 * 60 * 24)
    );

    return noites > 0 ? noites : 0;

}


function limparValorOCR(valor) {

    if (!valor) {
        return "";
    }

    let texto = valor
        .toString()
        .replace(/R\$/gi, "")
        .replace(/\s/g, "");

    if (texto.includes(",")) {
        texto = texto
            .replace(/\./g, "")
            .replace(",", ".");
    }

    const numero = parseFloat(texto);

    if (isNaN(numero)) {
        return "";
    }

    return numero.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

}



// ==========================================
// OCR — IMPORTAR ORÇAMENTO
// ==========================================

const arquivoOrcamento =
    document.getElementById("arquivoOrcamento");

const imagemSelecionada =
    document.getElementById("imagemSelecionada");

const btnLerOrcamento =
    document.getElementById("btnLerOrcamento");

const statusOcr =
    document.getElementById("statusOcr");

const areaUpload =
    document.getElementById("areaUpload");


// ==========================================
// PROCESSAR IMAGEM
// ==========================================

function processarImagemOrcamento(arquivo) {

    if (!arquivo) {
        return;
    }


    if (!arquivo.type || !arquivo.type.startsWith("image/")) {

        if (statusOcr) {
            statusOcr.textContent =
                "❌ O conteúdo colado não é uma imagem.";
        }

        return;
    }


    // Coloca o arquivo no input
    try {

        const transferencia =
            new DataTransfer();

        transferencia.items.add(arquivo);

        arquivoOrcamento.files =
            transferencia.files;

    } catch (erro) {

        console.warn(
            "Não foi possível atualizar o input:",
            erro
        );

    }


    // Preview
    const leitor =
        new FileReader();


    leitor.onload =
        function (evento) {

            if (imagemSelecionada) {

                imagemSelecionada.innerHTML = `
                    <img
                        src="${evento.target.result}"
                        alt="Print do orçamento"
                        style="
                            max-width:100%;
                            height:auto;
                            display:block;
                            border-radius:12px;
                        "
                    >
                `;

                imagemSelecionada.style.display =
                    "block";

            }


            if (btnLerOrcamento) {

                btnLerOrcamento.disabled =
                    false;

            }


            if (statusOcr) {

                statusOcr.textContent =
                    "✅ Print carregado. Clique em “Ler orçamento” ou use a leitura automática.";

            }

        };


    leitor.onerror =
        function () {

            if (statusOcr) {

                statusOcr.textContent =
                    "❌ Não foi possível carregar o print.";

            }

        };


    leitor.readAsDataURL(arquivo);

}


// ==========================================
// CLICAR NA ÁREA DE UPLOAD
// ==========================================

if (areaUpload) {

    areaUpload.addEventListener(
        "click",
        function () {

            if (arquivoOrcamento) {
                arquivoOrcamento.click();
            }

        }
    );


    areaUpload.addEventListener(
        "keydown",
        function (evento) {

            if (
                evento.key === "Enter" ||
                evento.key === " "
            ) {

                evento.preventDefault();

                if (arquivoOrcamento) {
                    arquivoOrcamento.click();
                }

            }

        }
    );

}


// ==========================================
// SELECIONAR ARQUIVO
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

            processarImagemOrcamento(
                arquivo
            );

        }
    );

}


// ==========================================
// CTRL + V
// ==========================================

document.addEventListener(
    "paste",
    function (evento) {

        const itens =
            evento.clipboardData &&
            evento.clipboardData.items;

        if (!itens) {
            return;
        }


        for (
            let i = 0;
            i < itens.length;
            i++
        ) {

            const item = itens[i];


            if (
                item.kind === "file" &&
                item.type.startsWith("image/")
            ) {

                const arquivo =
                    item.getAsFile();


                if (arquivo) {

                    evento.preventDefault();

                    processarImagemOrcamento(
                        arquivo
                    );

                    if (statusOcr) {

                        statusOcr.textContent =
                            "📋 Print colado com Ctrl + V. Clique em “Ler orçamento automaticamente”.";

                    }

                }

                return;
            }

        }

    }
);


// ==========================================
// PREPARAR IMAGEM PARA OCR
// ==========================================

function prepararImagemParaOCR(arquivo) {

    return new Promise((resolve, reject) => {

        const imagem = new Image();

        imagem.onload = function () {

            const escala = 4;

            const canvas = document.createElement("canvas");

            canvas.width = imagem.naturalWidth * escala;
            canvas.height = imagem.naturalHeight * escala;

            const ctx = canvas.getContext("2d");

            // Fundo branco
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(
                0,
                0,
                canvas.width,
                canvas.height
            );

            // Aumenta a imagem
            ctx.drawImage(
                imagem,
                0,
                0,
                canvas.width,
                canvas.height
            );

            // Pega os pixels
            const dados = ctx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
            );

            const pixels = dados.data;

            // Escala de cinza + contraste
            for (
                let i = 0;
                i < pixels.length;
                i += 4
            ) {

                const r = pixels[i];
                const g = pixels[i + 1];
                const b = pixels[i + 2];

                let cinza =
                    (0.299 * r) +
                    (0.587 * g) +
                    (0.114 * b);

                // Aumenta o contraste
                cinza =
                    ((cinza - 128) * 1.8) + 128;

                cinza = Math.max(
                    0,
                    Math.min(255, cinza)
                );

                pixels[i] = cinza;
                pixels[i + 1] = cinza;
                pixels[i + 2] = cinza;
            }

            ctx.putImageData(
                dados,
                0,
                0
            );

            resolve(canvas);

        };

        imagem.onerror = function () {

            reject(
                new Error(
                    "Não foi possível preparar a imagem para OCR."
                )
            );

        };

        imagem.src =
            URL.createObjectURL(arquivo);

    });

}


// ==========================================
// LER ORÇAMENTO
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
                    "Cole ou selecione o print do orçamento primeiro."
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
                        "⏳ Preparando leitura do orçamento...";

                }


                await carregarTesseract();


                if (statusOcr) {

                    statusOcr.textContent =
                        "⏳ Lendo o orçamento...";

                }


              // ==========================================
// OCR — LEITURA PRINCIPAL
// ==========================================

const imagemPreparada =
    await prepararImagemParaOCR(arquivo);


const resultado =
    await Tesseract.recognize(
        imagemPreparada,
        "eng+por",
        {

            logger: function (info) {

                if (
                    statusOcr &&
                    info.status === "recognizing text"
                ) {

                    const progresso =
                        Math.round(
                            (info.progress || 0) * 100
                        );

                    statusOcr.textContent =
                        `⏳ Lendo o orçamento... ${progresso}%`;

                }

            },

            tessedit_pageseg_mode: 6,

            preserve_interword_spaces: 1

        }
    );


let texto =
    resultado &&
    resultado.data
        ? resultado.data.text
        : "";


console.log(
    "=========================================="
);

console.log(
    "TEXTO OCR — PRIMEIRA LEITURA"
);

console.log(
    texto
);

console.log(
    "=========================================="
);


// ==========================================
// SEGUNDA LEITURA
// USA A IMAGEM ORIGINAL
//
// Isso é importante porque o tratamento
// em preto e branco pode fazer o OCR perder
// números pequenos do Opera.
// ==========================================

if (
    !texto ||
    !/\b\d{4}\b/.test(texto) ||
    !/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i.test(texto)
) {

    if (statusOcr) {

        statusOcr.textContent =
            "⏳ Reforçando a leitura das datas...";

    }


    const resultadoOriginal =
        await Tesseract.recognize(
            arquivo,
            "eng+por",
            {

                logger: function (info) {

                    if (
                        statusOcr &&
                        info.status === "recognizing text"
                    ) {

                        const progresso =
                            Math.round(
                                (info.progress || 0) * 100
                            );

                        statusOcr.textContent =
                            `⏳ Segunda leitura... ${progresso}%`;

                    }

                },

                tessedit_pageseg_mode: 11,

                preserve_interword_spaces: 1

            }
        );


    const textoOriginal =
        resultadoOriginal &&
        resultadoOriginal.data
            ? resultadoOriginal.data.text
            : "";


    console.log(
        "=========================================="
    );

    console.log(
        "TEXTO OCR — SEGUNDA LEITURA"
    );

    console.log(
        textoOriginal
    );

    console.log(
        "=========================================="
    );


    if (textoOriginal.trim()) {

        texto +=
            "\n" +
            textoOriginal;

    }

}


// ==========================================
// TERCEIRA TENTATIVA
//
// Alguns prints do Opera fazem o OCR separar:
//
// 08
// Jan
// 2027
//
// ou:
//
// 08 Jan
// 2027
//
// Por isso reconstruímos as datas
// a partir do texto inteiro.
// ==========================================

function localizarDatasOpera(textoOCR) {

    const datas = [];

    if (!textoOCR) {
        return datas;
    }


    let textoData =
        String(textoOCR)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\r/g, " ")
            .replace(/\n/g, " ")
            .replace(/\s+/g, " ");


    // Corrige erros comuns do OCR
    textoData =
        textoData
            .replace(/2O2([0-9])/gi, "202$1")
            .replace(/20O([0-9])/gi, "20$1")
            .replace(/O([0-9]{3})/gi, "0$1");


    const meses = {

        jan: "01",
        january: "01",
        janeiro: "01",

        feb: "02",
        february: "02",
        fevereiro: "02",

        mar: "03",
        march: "03",
        marco: "03",

        apr: "04",
        april: "04",
        abril: "04",

        may: "05",
        maio: "05",

        jun: "06",
        june: "06",
        junho: "06",

        jul: "07",
        july: "07",
        julho: "07",

        aug: "08",
        august: "08",
        agosto: "08",

        sep: "09",
        september: "09",
        setembro: "09",

        oct: "10",
        october: "10",
        outubro: "10",

        nov: "11",
        november: "11",
        novembro: "11",

        dec: "12",
        december: "12",
        dezembro: "12"

    };


    // ==========================================
    // 08 Jan 2027
    // ==========================================

    const padrao =
        /\b(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})\b/gi;


    let match;


    while (
        (match = padrao.exec(textoData)) !== null
    ) {

        const dia =
            String(match[1]).padStart(2, "0");


        const mesTexto =
            match[2]
                .toLowerCase()
                .trim();


        const mes =
            meses[mesTexto] ||
            meses[mesTexto.substring(0, 3)];


        const ano =
            match[3];


        if (
            mes &&
            Number(dia) >= 1 &&
            Number(dia) <= 31
        ) {

            const data =
                `${ano}-${mes}-${dia}`;


            if (
                !datas.includes(data)
            ) {

                datas.push(data);

            }

        }

    }


    // ==========================================
    // 08/01/2027
    // ==========================================

    const numerico =
        /\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})\b/g;


    while (
        (match = numerico.exec(textoData)) !== null
    ) {

        let ano =
            match[3];


        if (ano.length === 2) {

            ano =
                "20" + ano;

        }


        const dia =
            String(match[1]).padStart(2, "0");


        const mes =
            String(match[2]).padStart(2, "0");


        if (
            Number(mes) <= 12 &&
            Number(dia) <= 31
        ) {

            const data =
                `${ano}-${mes}-${dia}`;


            if (
                !datas.includes(data)
            ) {

                datas.push(data);

            }

        }

    }


    console.log(
        "📅 DATAS EXTRAÍDAS:",
        datas
    );


    return datas;

}


// ==========================================
// ENCONTRAR AS DATAS
// ==========================================

const datasOpera =
    localizarDatasOpera(texto);


// ==========================================
// SE ENCONTROU DATAS, FORÇA NO TEXTO
//
// Isso garante que aplicarResultadoOCR()
// receba as datas mesmo que o OCR tenha
// separado a informação.
// ==========================================

if (
    datasOpera.length >= 2
) {

    console.log(
        "✅ CHECK-IN DETECTADO:",
        datasOpera[0]
    );

    console.log(
        "✅ CHECK-OUT DETECTADO:",
        datasOpera[1]
    );


    texto +=
        `\nDATA_CHECKIN: ${datasOpera[0]}` +
        `\nDATA_CHECKOUT: ${datasOpera[1]}`;

}

                if (!texto.trim()) {

                    throw new Error(
                        "Nenhum texto foi encontrado."
                    );

                }


                aplicarResultadoOCR(
                    texto
                );


                if (statusOcr) {

                    statusOcr.textContent =
                        "✅ Orçamento lido. Confira os dados antes de gerar.";

                }


            } catch (erro) {

                console.error(
                    "Erro completo no OCR:",
                    erro
                );


                if (statusOcr) {

                    statusOcr.textContent =
                        "❌ Não foi possível ler o orçamento.";

                }


                alert(
                    "Não foi possível ler o orçamento. O sistema foi corrigido; tente novamente."
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
                typeof Tesseract !== "undefined"

                            ) {

                resolve();
                return;

            }


            const script =
                document.createElement("script");


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


            document.head.appendChild(script);

        }
    );

}


// ==========================================
// OCR — FUNÇÕES AUXILIARES
// ==========================================

function normalizarTextoOCR(texto) {
    return (texto || "")
        .replace(/\r/g, "")
        .replace(/[ \t]+/g, " ")
        .trim();
}

function converterDataOpera(dia, mes, ano) {
    const meses = {
        jan: "01", january: "01", janeiro: "01",
        feb: "02", february: "02", fevereiro: "02",
        mar: "03", march: "03", marco: "03", março: "03",
        apr: "04", april: "04", abril: "04",
        may: "05", maio: "05",
        jun: "06", june: "06", junho: "06",
        jul: "07", july: "07", julho: "07",
        aug: "08", august: "08", agosto: "08",
        sep: "09", september: "09", setembro: "09",
        oct: "10", october: "10", outubro: "10",
        nov: "11", november: "11", novembro: "11",
        dec: "12", december: "12", dezembro: "12"
    };

    const mesNormalizado = String(mes || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    const numeroMes = meses[mesNormalizado] || meses[mesNormalizado.substring(0, 3)];
    if (!numeroMes) return "";

    return `${ano}-${numeroMes}-${String(dia).padStart(2, "0")}`;
}

function extrairDatasOCR(texto) {

    const resultado = [];

    const textoNormalizado = String(texto || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ")
        .trim();

    console.log("📅 Texto analisado para datas:");
    console.log(textoNormalizado);

    // =====================================================
    // MESES ACEITOS PELO OCR
    // =====================================================
    //
    // O Opera pode aparecer como:
    //
    // Jan / January
    // Feb / February
    // Mar / March
    // Apr / April
    // May
    // Jun / June
    // Jul / July
    // Aug / August
    // Set / Sep / September
    // Oct / October
    // Nov / November
    // Dec / December
    //
    // IMPORTANTE:
    // O OCR do seu Opera está lendo "Set".
    // =====================================================

    const meses = {
        jan: "01",
        january: "01",
        janeiro: "01",

        feb: "02",
        february: "02",
        fevereiro: "02",

        mar: "03",
        march: "03",
        marco: "03",
        março: "03",

        apr: "04",
        april: "04",
        abril: "04",

        may: "05",
        maio: "05",

        jun: "06",
        june: "06",
        junho: "06",

        jul: "07",
        july: "07",
        julho: "07",

        aug: "08",
        august: "08",
        agosto: "08",

        // IMPORTANTE: "Set" é como o OCR está lendo
        set: "09",
        sep: "09",
        september: "09",
        setembro: "09",

        oct: "10",
        october: "10",
        outubro: "10",

        nov: "11",
        november: "11",
        novembro: "11",

        dec: "12",
        december: "12",
        dezembro: "12"
    };


    // =====================================================
    // DATA COM MÊS POR EXTENSO/ABREVIADO
    // Exemplos:
    //
    // 28 Set 2026
    // 29 Set 2026
    // 08 Jan 2027
    // 17 Jan 2027
    // =====================================================

    const padraoTexto =
        /(?:^|[^0-9])(\d{1,2})\s+([A-Za-zÀ-ÿ]{3,10})\s+(\d{4})(?=[^0-9]|$)/gi;

    let match;

    while ((match = padraoTexto.exec(textoNormalizado)) !== null) {

        const dia = match[1];
        const mesTexto = match[2]
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        const ano = match[3];

        const numeroMes = meses[mesTexto];

        if (!numeroMes) {
            console.log(
                "⚠️ Mês não reconhecido:",
                mesTexto
            );
            continue;
        }

        const data =
            `${ano}-${numeroMes}-${String(dia).padStart(2, "0")}`;

        if (!resultado.includes(data)) {

            resultado.push(data);

            console.log(
                "📅 Data encontrada:",
                match[0],
                "→",
                data
            );
        }
    }


    // =====================================================
    // DATA NUMÉRICA
    // Exemplos:
    //
    // 28/09/2026
    // 29-09-2026
    // =====================================================

    const padraoNumerico =
        /(?:^|[^0-9])(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})(?=[^0-9]|$)/g;

    while ((match = padraoNumerico.exec(textoNormalizado)) !== null) {

        let ano = match[3];

        if (ano.length === 2) {
            ano = `20${ano}`;
        }

        const dia = String(match[1]).padStart(2, "0");
        const mes = String(match[2]).padStart(2, "0");

        const data = `${ano}-${mes}-${dia}`;

        if (!resultado.includes(data)) {

            resultado.push(data);

            console.log(
                "📅 Data numérica encontrada:",
                match[0],
                "→",
                data
            );
        }
    }


    console.log(
        "📅 RESULTADO FINAL DAS DATAS:",
        resultado
    );

    return resultado;
}

function limparValorOCR(valor) {
    if (!valor) return "";

    let texto = String(valor)
        .replace(/BRL/gi, "")
        .replace(/R\$/gi, "")
        .replace(/\s/g, "")
        .trim();

    // 3.285,45 -> 3285.45
    if (texto.includes(",")) {
        texto = texto.replace(/\./g, "").replace(",", ".");
    }

    // 3285.45 permanece 3285.45
    const numero = parseFloat(texto);
    if (isNaN(numero)) return "";

    return numero.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function obterValorTotalOCR(texto) {
    const normalizado = String(texto || "").replace(/\r/g, "");

    const matchTotal = normalizado.match(
        /Total\s+Room[\s\S]{0,100}?([\d.,]+)\s*BRL/i
    );

    if (matchTotal) return limparValorOCR(matchTotal[1]);

    const matchBRL = normalizado.match(
        /([\d.,]+)\s*BRL\b/i
    );

    return matchBRL ? limparValorOCR(matchBRL[1]) : "";
}


// ==========================================
// APLICAR RESULTADO DO OCR
// ==========================================

function aplicarResultadoOCR(texto) {
    console.log("===== TEXTO OCR =====");
    console.log(texto);

    const textoLimpo = normalizarTextoOCR(texto);

    // ------------------------------
    // QUARTO
    // ------------------------------
    let codigoQuarto = "";
    let descricaoQuarto = "";

    const matchQuarto = textoLimpo.match(
        /(?:^|\n)\s*\d+\s*-\s*([A-Z0-9]+)\s*-\s*(.+?)(?=\n|$)/i
    );

  if (matchQuarto) {

    codigoQuarto = matchQuarto[1]
        .trim()
        .toUpperCase();

    descricaoQuarto = matchQuarto[2]
        .trim()
        // Remove o preço no final da descrição
        .replace(/\s+\d[\d.,]*\s*BRL\s*$/i, "")
        .trim();
}

    // Fallback para OCR que juntou tudo em uma linha.
    if (!codigoQuarto) {
        const fallbackQuarto = textoLimpo.match(
            /\b(DBB|DBC|TWB|TWC|DSC|S2C)\b\s*-?\s*([^\n]*?)(?=\s+\d+[\s-]+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b|$)/i
        );
        if (fallbackQuarto) {
            codigoQuarto = fallbackQuarto[1].toUpperCase();
            descricaoQuarto = fallbackQuarto[2].replace(/^[-\s]+|[-\s]+$/g, "").trim();
        }
    }

    // ------------------------------
    // TARIFA
    // ------------------------------
    let tarifa = "";
    const matchTarifa = textoLimpo.match(
        /[A-Z0-9]+\s*-\s*(TARIFA[^\n]*?)(?=\n|\s+Sexta|\s+Segunda|\s+Terça|\s+Quarta|\s+Quinta|\s+Sábado|\s+Domingo|$)/i
    );
    if (matchTarifa) tarifa = matchTarifa[1].trim();

    // ------------------------------
    // DATAS
    // ------------------------------
    let datasEncontradas = extrairDatasOCR(textoLimpo);
    let checkin = datasEncontradas[0] || "";
    let checkout = datasEncontradas[1] || "";

    // ------------------------------
    // NOITES
    // ------------------------------
    let noites = "";
    const matchNoites = textoLimpo.match(/\(?\s*(\d+)\s*night(?:s)?/i);
    if (matchNoites) noites = matchNoites[1];

    if (checkin && !checkout && noites) {
        const entrada = new Date(`${checkin}T12:00:00`);
        entrada.setDate(entrada.getDate() + parseInt(noites, 10));
        checkout = `${entrada.getFullYear()}-${String(entrada.getMonth() + 1).padStart(2, "0")}-${String(entrada.getDate()).padStart(2, "0")}`;
    }

    // Se as duas datas foram encontradas, calcula as noites para conferir o OCR.
    if (checkin && checkout) {
        const calculadas = calcularNoites(checkin, checkout);
        if (calculadas > 0) noites = String(calculadas);
    }

    // ------------------------------
    // HÓSPEDES
    // ------------------------------
    let adultos = 0;
    let criancas = 0;

    const matchHospedes = textoLimpo.match(
        /(\d+)\s*Adult\s*\/\s*(\d+)\s*Child/i
    );

    if (matchHospedes) {
        adultos = parseInt(matchHospedes[1], 10) || 0;
        criancas = parseInt(matchHospedes[2], 10) || 0;
    } else {
        const adultoFallback = textoLimpo.match(/(\d+)\s*Adult(?:s)?\b/i);
        const criancaFallback = textoLimpo.match(/(\d+)\s*Child(?:ren)?\b/i);
        adultos = adultoFallback ? parseInt(adultoFallback[1], 10) : 0;
        criancas = criancaFallback ? parseInt(criancaFallback[1], 10) : 0;
    }

    // ------------------------------
    // CAFÉ
    // ------------------------------
    const cafeIncluido = /Breakfast\s+Included/i.test(textoLimpo) ||
        /cafe\s+da\s+manha\s+inclu[ií]do/i.test(textoLimpo) ||
        /cafe\s+da\s+manha/i.test(textoLimpo) && /included|incluido|incluso/i.test(textoLimpo);

    // ------------------------------
    // VALOR
    // ------------------------------
    const valorTotal = obterValorTotalOCR(textoLimpo);

    // ------------------------------
    // PAGAMENTO
    // ------------------------------
    const pagamento = /To\s+be\s+paid\s+at\s+the\s+hotel/i.test(textoLimpo)
        ? "hotel"
        : /paid|payment|pagamento/i.test(textoLimpo)
            ? "antecipado"
            : "hotel";

    // ------------------------------
    // PREENCHER FORMULÁRIO
    // ------------------------------
    const campoCheckin = document.getElementById("checkin");
    const campoCheckout = document.getElementById("checkout");
    const campoNoites = document.getElementById("noites");
    const campoAdultos = document.getElementById("adultos");
    const campoCriancas = document.getElementById("criancas");
    const campoTipoQuarto = document.getElementById("tipoQuarto");
    const campoDescricaoQuarto = document.getElementById("descricaoQuarto");
    const campoTarifa = document.getElementById("tarifa");
    const campoCafe = document.getElementById("cafe");
    const campoValorTotal = document.getElementById("valorTotal");
    const campoPagamento = document.getElementById("pagamento");

    if (campoCheckin) campoCheckin.value = checkin;
    if (campoCheckout) campoCheckout.value = checkout;
    if (campoNoites) campoNoites.value = noites || 0;
    if (campoAdultos) campoAdultos.value = adultos;
    if (campoCriancas) campoCriancas.value = criancas;
    if (campoTipoQuarto) campoTipoQuarto.value = codigoQuarto;
    if (campoDescricaoQuarto) campoDescricaoQuarto.value = descricaoQuarto;
    if (campoTarifa) campoTarifa.value = tarifa;
    if (campoCafe) campoCafe.checked = cafeIncluido;
    if (campoValorTotal) campoValorTotal.value = valorTotal;
    if (campoPagamento) campoPagamento.value = pagamento;

    [
        campoCheckin, campoCheckout, campoNoites,
        campoAdultos, campoCriancas, campoTipoQuarto,
        campoDescricaoQuarto, campoTarifa, campoCafe,
        campoValorTotal, campoPagamento
    ].forEach(campo => {
        if (!campo) return;
        campo.dispatchEvent(new Event("input", { bubbles: true }));
        campo.dispatchEvent(new Event("change", { bubbles: true }));
    });

    console.log("===== DADOS EXTRAÍDOS DO OPERA =====");
    console.log({
        codigoQuarto,
        descricaoQuarto,
        tarifa,
        datasEncontradas,
        checkin,
        checkout,
        noites,
        adultos,
        criancas,
        cafeIncluido,
        valorTotal,
        pagamento
    });

    // Gera a prévia automaticamente somente se os dados essenciais estiverem completos.
    if (checkin && checkout && codigoQuarto && valorTotal) {
        gerarOrcamento();
    }
}


// ==========================================
// GERAR ORÇAMENTO
// ==========================================

function gerarOrcamento() {
    const checkin = document.getElementById("checkin")?.value || "";
    const checkout = document.getElementById("checkout")?.value || "";
    const adultos = parseInt(document.getElementById("adultos")?.value, 10) || 0;
    const criancas = parseInt(document.getElementById("criancas")?.value, 10) || 0;
    const tipoQuarto = (document.getElementById("tipoQuarto")?.value || "").trim().toUpperCase();
    const descricaoQuarto = (document.getElementById("descricaoQuarto")?.value || "").trim();
    const tarifa = (document.getElementById("tarifa")?.value || "").trim();
    const cafe = !!document.getElementById("cafe")?.checked;
    const promocional = !!document.getElementById("promo")?.checked;
    const valorTotal = converterValor(document.getElementById("valorTotal")?.value || "");
    const pagamento = document.getElementById("pagamento")?.value || "hotel";

    if (!checkin || !checkout) {
        alert("Informe o check-in e o check-out.");
        return;
    }

    const noites = calcularNoites(checkin, checkout);
    if (noites <= 0) {
        alert("O check-out deve ser posterior ao check-in.");
        return;
    }

    const dadosQuarto = QUARTOS[tipoQuarto] || null;
    const nomeQuarto = descricaoQuarto || (dadosQuarto ? dadosQuarto.nome : "Acomodação não informada");
    const fotoQuarto = dadosQuarto?.foto || "";
    const quantidadeQuartos = dadosQuarto?.quantidadeQuartos || 1;

    let textoHospedes = "";
    if (adultos > 0) textoHospedes = `${adultos} adulto${adultos !== 1 ? "s" : ""}`;
    if (criancas > 0) textoHospedes += `${textoHospedes ? " • " : ""}${criancas} criança${criancas !== 1 ? "s" : ""}`;
    if (!textoHospedes) textoHospedes = "Não informado";

    const textoPagamento = pagamento === "antecipado"
        ? "Pagamento antecipado"
        : "Pagamento no hotel";

    const preview = document.getElementById("orcamentoPreview");
    if (!preview) return;

    preview.innerHTML = `
        <div class="orcamento">
            <div class="orcamento-topo">
                <div class="logo-hotel">
                    <img src="img/logo.png" alt="ibis Styles Curitiba Centro Cívico">
                    <div class="nome-hotel">Curitiba Centro Cívico</div>
                </div>
                <div class="titulo-orcamento">
                    <h2>ORÇAMENTO DE HOSPEDAGEM</h2>
                </div>
            </div>

            <div class="orcamento-conteudo">
                <section class="estadia-box">
                    <div class="estadia-titulo">ESTADIA</div>
                    <div class="datas-hospedagem">
                        <div class="data-box">
                            <small>CHECK-IN</small>
                            <strong>${formatarDataCompleta(checkin)}</strong>
                        </div>
                        <div class="seta-data">→</div>
                        <div class="data-box">
                            <small>CHECK-OUT</small>
                            <strong>${formatarDataCompleta(checkout)}</strong>
                        </div>
                    </div>
                    <div class="estadia-noites">
                        <span>ESTADIA</span>
                        <strong>${noites} ${noites === 1 ? "NOITE" : "NOITES"}</strong>
                    </div>
                </section>

                <section class="acomodacao-box">
                    ${fotoQuarto ? `
                        <div class="foto-quarto">
                            <img src="${fotoQuarto}" alt="${nomeQuarto}">
                        </div>
                    ` : ""}
                    <div class="acomodacao-info">
                        <div class="label-verde">ACOMODAÇÃO</div>
                        <h3>${nomeQuarto}</h3>
                        <div class="quartos-pill">
                            🛏️ ${quantidadeQuartos} ${quantidadeQuartos === 1 ? "quarto" : "quartos"}
                            ${tipoQuarto === "S2C" ? "conjugados" : ""}
                        </div>
                        <div class="linha-info"></div>
                        <div class="hospedes-info">
                            <span>HÓSPEDES</span>
                            <strong>${textoHospedes}</strong>
                        </div>
                    </div>
                </section>

                <section class="cafe-box">
                    <div class="cafe-icone">☕</div>
                    <div>
                        <span>CAFÉ DA MANHÃ</span>
                        <strong>${cafe ? "Incluído" : "Não incluído"}</strong>
                    </div>
                </section>

                ${tarifa ? `
                    <div class="tarifa-info">
                        <span>TARIFA</span>
                        <strong>${tarifa}${promocional ? " • PROMOCIONAL" : ""}</strong>
                    </div>
                ` : ""}

                <section class="total-box">
                    <div>
                        <span>TOTAL DA HOSPEDAGEM</span>
                        <strong>${formatarMoeda(valorTotal)}</strong>
                    </div>
                    <div class="pagamento-box">${textoPagamento}</div>
                </section>

                <div class="rodape-orcamento">
                    <p>ibis Styles Curitiba Centro Cívico</p>
                    <p>Orçamento sujeito à disponibilidade</p>
                </div>
            </div>
        </div>
    `;

    const previewArea = document.getElementById("previewArea");
    if (previewArea) previewArea.style.display = "block";
}


// ==========================================
// SUBMIT DO FORMULÁRIO
// ==========================================

const formulario = document.getElementById("formOrcamento");

if (formulario) {

    formulario.addEventListener(
        "submit",
        function(evento) {

            evento.preventDefault();

            gerarOrcamento();

        }
    );

}


// ==========================================
// LIMPAR FORMULÁRIO
// ==========================================

function limparFormulario() {

    const campos =
        document.querySelectorAll(
            "input, select"
        );


    campos.forEach(
        campo => {

            if (campo.type === "checkbox") {

                campo.checked = false;

                return;

            }


            if (campo.type === "number") {

                campo.value =
                    campo.id === "noites"
                        ? 1
                        : 0;

                return;

            }


            campo.value = "";

        }
    );


    const previewArea =
        document.getElementById("previewArea");


    if (previewArea) {

        previewArea.style.display =
            "none";

    }


    if (arquivoOrcamento) {

        arquivoOrcamento.value = "";

    }


    if (imagemSelecionada) {

        imagemSelecionada.innerHTML = "";

        imagemSelecionada.style.display =
            "none";

    }


    if (btnLerOrcamento) {

        btnLerOrcamento.disabled =
            true;

    }


    if (statusOcr) {

        statusOcr.textContent = "";

    }

}


// ==========================================
// COPIAR TEXTO
// ==========================================

function copiarOrcamento() {

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

    const tipoQuarto =
        document.getElementById("tipoQuarto").value;

    const descricaoQuarto =
        document.getElementById("descricaoQuarto").value.trim();

    const cafe =
        document.getElementById("cafe").checked;

    const tarifa =
        document.getElementById("tarifa").value.trim();

    const valorTotal =
        converterValor(
            document.getElementById("valorTotal").value
        );

    const pagamento =
        document.getElementById("pagamento").value;


    const noites =
        calcularNoites(
            checkin,
            checkout
        );


    const dadosQuarto =
        QUARTOS[tipoQuarto];


    const nomeQuarto =
        descricaoQuarto ||
        (
            dadosQuarto
                ? dadosQuarto.nome
                : ""
        );


    const texto = `

🏨 IBIS STYLES CURITIBA CENTRO CÍVICO

📅 Check-in:
${formatarDataCompleta(checkin)}

📅 Check-out:
${formatarDataCompleta(checkout)}

👥 Hóspedes:
${adultos} adulto${adultos !== 1 ? "s" : ""}
${criancas > 0 ? ` • ${criancas} criança${criancas !== 1 ? "s" : ""}` : ""}

🛏️ Acomodação:
${nomeQuarto}

☕ Café da manhã:
${cafe ? "Incluso" : "Não incluso"}

💳 Tarifa:
${tarifa || "Não informado"}

🌙 Noites:
${noites}

💵 Valor total:
${formatarMoeda(valorTotal)}

💳 Pagamento:
${
    pagamento === "antecipado"
        ? "Pagamento antecipado"
        : "A ser pago no hotel"
}

Este orçamento está sujeito à disponibilidade no momento da reserva.

ibis Styles Curitiba Centro Cívico
R. Comendador Araújo, 730 — Batel — Curitiba/PR

`;


    if (
        navigator.clipboard &&
        navigator.clipboard.writeText
    ) {

        navigator.clipboard.writeText(
            texto.trim()
        )
        .then(
            () => {

                alert(
                    "Orçamento copiado!"
                );

            }
        )
        .catch(
            () => {

                alert(
                    "Não foi possível copiar o orçamento."
                );

            }
        );

    }

}


// ==========================================
// COMPARTILHAR
// ==========================================

function compartilharOrcamento() {

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

    const tipoQuarto =
        document.getElementById("tipoQuarto").value;

    const descricaoQuarto =
        document.getElementById("descricaoQuarto").value.trim();

    const cafe =
        document.getElementById("cafe").checked;

    const valorTotal =
        converterValor(
            document.getElementById("valorTotal").value
        );


    const noites =
        calcularNoites(
            checkin,
            checkout
        );


    const dadosQuarto =
        QUARTOS[tipoQuarto];


    const nomeQuarto =
        descricaoQuarto ||
        (
            dadosQuarto
                ? dadosQuarto.nome
                : ""
        );


    const texto = `

🏨 *IBIS STYLES CURITIBA CENTRO CÍVICO*

📅 *Check-in:*
${formatarDataCompleta(checkin)}

📅 *Check-out:*
${formatarDataCompleta(checkout)}

👥 *Hóspedes:*
${adultos} adulto${adultos !== 1 ? "s" : ""}
${criancas > 0 ? ` • ${criancas} criança${criancas !== 1 ? "s" : ""}` : ""}

🛏️ *Acomodação:*
${nomeQuarto}

☕ *Café da manhã:*
${cafe ? "Incluso" : "Não incluso"}

🌙 *Noites:*
${noites}

💵 *Valor total:*
${formatarMoeda(valorTotal)}

Este orçamento está sujeito à disponibilidade no momento da reserva.

ibis Styles Curitiba Centro Cívico
R. Comendador Araújo, 730 — Batel — Curitiba/PR

`;


    const url =
        `https://wa.me/?text=${encodeURIComponent(texto.trim())}`;


    window.open(
        url,
        "_blank"
    );

}


// ==========================================
// CARREGAR HTML2CANVAS
// ==========================================

function carregarHtml2Canvas() {

    return new Promise(
        (resolve, reject) => {

            if (window.html2canvas) {

                resolve();

                return;

            }


            const script =
                document.createElement("script");


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

        botao.disabled = true;

        botao.innerHTML =
            "⏳ Preparando imagem...";

    }


    let areaCaptura = null;


    try {

        await carregarHtml2Canvas();


        const copia =
            elemento.cloneNode(true);


        copia.style.width =
            "1100px";

        copia.style.maxWidth =
            "1100px";

        copia.style.minWidth =
            "1100px";

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

                    if (img.complete) {

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
                    imageTimeout: 15000,
                    logging: false,
                    width: 1100,
                    windowWidth: 1100
                }
            );


        if (areaCaptura) {

            areaCaptura.remove();

            areaCaptura = null;

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
// BAIXAR IMAGEM
// ==========================================

function baixarImagemOrcamento(blob) {

    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


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


    URL.revokeObjectURL(url);

}


// ==========================================
// FINALIZAÇÃO
// ==========================================

console.log(
    "✅ Gerador de Orçamentos carregado corretamente."
);
// ==========================================================
// CORREÇÃO DEFINITIVA — DATAS DO OPERA
// ==========================================================

(function () {

    console.log("📅 Correção especial de datas do Opera carregada.");

    function converterMesOpera(mes) {

        const meses = {
            jan: "01",
            january: "01",
            janeiro: "01",

            feb: "02",
            february: "02",
            fevereiro: "02",

            mar: "03",
            march: "03",
            marco: "03",
            março: "03",

            apr: "04",
            april: "04",
            abril: "04",

            may: "05",
            maio: "05",

            jun: "06",
            june: "06",
            junho: "06",

            jul: "07",
            july: "07",
            julho: "07",

            aug: "08",
            august: "08",
            agosto: "08",

            sep: "09",
            september: "09",
            setembro: "09",

            oct: "10",
            october: "10",
            outubro: "10",

            nov: "11",
            november: "11",
            novembro: "11",

            dec: "12",
            december: "12",
            dezembro: "12"
        };

        const texto =
            String(mes || "")
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");

        return (
            meses[texto] ||
            meses[texto.substring(0, 3)] ||
            ""
        );
    }


    function extrairDatasOperaEspecial(texto) {

        if (!texto) {
            return [];
        }

        let textoLimpo =
            String(texto)
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/\r/g, " ")
                .replace(/\n/g, " ")
                .replace(/\s+/g, " ");


        console.log(
            "📅 Texto usado para procurar datas:",
            textoLimpo
        );


        const datas = [];


        // --------------------------------------------------
        // FORMATO:
        //
        // 08 Jan 2027
        // 17 Jan 2027
        // --------------------------------------------------

        const regexMes =
            /(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/gi;


        let resultado;


        while (
            (resultado =
                regexMes.exec(textoLimpo)) !== null
        ) {

            const dia =
                parseInt(
                    resultado[1],
                    10
                );


            const mes =
                converterMesOpera(
                    resultado[2]
                );


            const ano =
                resultado[3];


            if (
                mes &&
                dia >= 1 &&
                dia <= 31
            ) {

                const data =
                    `${ano}-${mes}-${String(dia).padStart(2, "0")}`;


                if (
                    !datas.includes(data)
                ) {

                    datas.push(data);

                }

            }

        }


        // --------------------------------------------------
        // FORMATO:
        //
        // 08/01/2027
        // 17/01/2027
        // --------------------------------------------------

        const regexNumerica =
            /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/g;


        while (
            (resultado =
                regexNumerica.exec(textoLimpo)) !== null
        ) {

            const dia =
                parseInt(
                    resultado[1],
                    10
                );

            const mes =
                parseInt(
                    resultado[2],
                    10
                );

            const ano =
                resultado[3];


            if (
                dia >= 1 &&
                dia <= 31 &&
                mes >= 1 &&
                mes <= 12
            ) {

                const data =
                    `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;


                if (
                    !datas.includes(data)
                ) {

                    datas.push(data);

                }

            }

        }


        console.log(
            "📅 Datas encontradas:",
            datas
        );


        return datas;

    }


    function prepararImagemDatas(arquivo) {

        return new Promise(
            function (resolve, reject) {

                const imagem =
                    new Image();


                imagem.onload =
                    function () {

                        /*
                         * Não vamos cortar uma região fixa.
                         * Vamos aumentar a imagem inteira,
                         * porque dependendo do tamanho do
                         * print o Opera pode colocar as datas
                         * em posições diferentes.
                         */

                        const escala = 5;


                        const canvas =
                            document.createElement(
                                "canvas"
                            );


                        canvas.width =
                            imagem.naturalWidth *
                            escala;


                        canvas.height =
                            imagem.naturalHeight *
                            escala;


                        const ctx =
                            canvas.getContext(
                                "2d"
                            );


                        ctx.fillStyle =
                            "#ffffff";


                        ctx.fillRect(
                            0,
                            0,
                            canvas.width,
                            canvas.height
                        );


                        ctx.drawImage(
                            imagem,
                            0,
                            0,
                            canvas.width,
                            canvas.height
                        );


                        /*
                         * Escala de cinza e contraste
                         */

                        const dados =
                            ctx.getImageData(
                                0,
                                0,
                                canvas.width,
                                canvas.height
                            );


                        const pixels =
                            dados.data;


                        for (
                            let i = 0;
                            i < pixels.length;
                            i += 4
                        ) {

                            const r =
                                pixels[i];

                            const g =
                                pixels[i + 1];

                            const b =
                                pixels[i + 2];


                            let cinza =
                                (
                                    0.299 * r +
                                    0.587 * g +
                                    0.114 * b
                                );


                            cinza =
                                (
                                    (cinza - 128) *
                                    2.5
                                ) + 128;


                            cinza =
                                Math.max(
                                    0,
                                    Math.min(
                                        255,
                                        cinza
                                    )
                                );


                            pixels[i] =
                                cinza;

                            pixels[i + 1] =
                                cinza;

                            pixels[i + 2] =
                                cinza;

                        }


                        ctx.putImageData(
                            dados,
                            0,
                            0
                        );


                        resolve(
                            canvas
                        );

                    };


                imagem.onerror =
                    function () {

                        reject(
                            new Error(
                                "Erro ao preparar imagem."
                            )
                        );

                    };


                imagem.src =
                    URL.createObjectURL(
                        arquivo
                    );

            }
        );

    }


    async function tentarLerDatas() {

        const arquivo =
            document.getElementById(
                "arquivoOrcamento"
            );


        const campoCheckin =
            document.getElementById(
                "checkin"
            );


        const campoCheckout =
            document.getElementById(
                "checkout"
            );


        const campoNoites =
            document.getElementById(
                "noites"
            );


        const status =
            document.getElementById(
                "statusOcr"
            );


        if (
            !arquivo ||
            !arquivo.files ||
            !arquivo.files[0]
        ) {

            console.log(
                "📅 Nenhum arquivo encontrado para leitura das datas."
            );

            return;

        }


        const imagem =
            arquivo.files[0];


        try {

            if (status) {

                status.textContent =
                    "⏳ Procurando as datas do Opera...";

            }


            /*
             * Garante que o Tesseract esteja carregado.
             */

            if (
                typeof Tesseract ===
                "undefined"
            ) {

                if (
                    typeof carregarTesseract ===
                    "function"
                ) {

                    await carregarTesseract();

                }

            }


            if (
                typeof Tesseract ===
                "undefined"
            ) {

                console.error(
                    "Tesseract não está disponível."
                );

                return;

            }


            const imagemPreparada =
                await prepararImagemDatas(
                    imagem
                );


            /*
             * PSM 11:
             * leitura esparsa.
             *
             * É melhor para telas do Opera
             * porque não obriga o OCR a entender
             * a página como um documento inteiro.
             */

            const resultado =
                await Tesseract.recognize(
                    imagemPreparada,
                    "eng",
                    {

                        tessedit_pageseg_mode: 11,

                        preserve_interword_spaces: 1

                    }
                );


            const texto =
                resultado &&
                resultado.data
                    ? resultado.data.text
                    : "";


            console.log(
                "======================================"
            );

            console.log(
                "📅 OCR ESPECIAL DAS DATAS"
            );

            console.log(
                texto
            );

            console.log(
                "======================================"
            );


            let datas =
                extrairDatasOperaEspecial(
                    texto
                );


            /*
             * Segunda tentativa usando português.
             */

            if (
                datas.length < 2
            ) {

                const resultadoPt =
                    await Tesseract.recognize(
                        imagemPreparada,
                        "por",
                        {

                            tessedit_pageseg_mode: 11,

                            preserve_interword_spaces: 1

                        }
                    );


                const textoPt =
                    resultadoPt &&
                    resultadoPt.data
                        ? resultadoPt.data.text
                        : "";


                console.log(
                    "📅 OCR ESPECIAL PT:",
                    textoPt
                );


                const datasPt =
                    extrairDatasOperaEspecial(
                        textoPt
                    );


                datas =
                    [
                        ...new Set(
                            [
                                ...datas,
                                ...datasPt
                            ]
                        )
                    ];

            }


            /*
             * SE ENCONTROU AS DUAS DATAS
             */

            if (
                datas.length >= 2
            ) {

                const checkin =
                    datas[0];

                const checkout =
                    datas[1];


                console.log(
                    "✅ CHECK-IN FINAL:",
                    checkin
                );


                console.log(
                    "✅ CHECK-OUT FINAL:",
                    checkout
                );


                /*
                 * Preenche diretamente os inputs.
                 */

                if (
                    campoCheckin
                ) {

                    campoCheckin.value =
                        checkin;


                    campoCheckin.dispatchEvent(
                        new Event(
                            "input",
                            {
                                bubbles: true
                            }
                        )
                    );


                    campoCheckin.dispatchEvent(
                        new Event(
                            "change",
                            {
                                bubbles: true
                            }
                        )
                    );

                }


                if (
                    campoCheckout
                ) {

                    campoCheckout.value =
                        checkout;


                    campoCheckout.dispatchEvent(
                        new Event(
                            "input",
                            {
                                bubbles: true
                            }
                        )
                    );


                    campoCheckout.dispatchEvent(
                        new Event(
                            "change",
                            {
                                bubbles: true
                            }
                        )
                    );

                }


                /*
                 * Calcula noites.
                 */

                const entrada =
                    new Date(
                        `${checkin}T12:00:00`
                    );


                const saida =
                    new Date(
                        `${checkout}T12:00:00`
                    );


                const noites =
                    Math.round(
                        (
                            saida -
                            entrada
                        ) /
                        (
                            1000 *
                            60 *
                            60 *
                            24
                        )
                    );


                if (
                    campoNoites &&
                    noites > 0
                ) {

                    campoNoites.value =
                        noites;


                    campoNoites.dispatchEvent(
                        new Event(
                            "input",
                            {
                                bubbles: true
                            }
                        )
                    );


                    campoNoites.dispatchEvent(
                        new Event(
                            "change",
                            {
                                bubbles: true
                            }
                        )
                    );

                }


                if (status) {

                    status.textContent =
                        `✅ Datas encontradas: ${checkin.split("-").reverse().join("/")} → ${checkout.split("-").reverse().join("/")}`;

                }


                return true;

            }


            console.warn(
                "⚠️ OCR não encontrou duas datas.",
                datas
            );


            if (status) {

                status.textContent =
                    "⚠️ Não consegui identificar as duas datas no print.";

            }


            return false;


        } catch (erro) {

            console.error(
                "Erro na leitura especial das datas:",
                erro
            );


            return false;

        }

    }


    /*
     * Observa o botão existente.
     *
     * Não substitui o botão.
     * Apenas espera o OCR principal terminar
     * e então faz a leitura específica das datas.
     */

    document.addEventListener(
        "click",
        function (evento) {

            const alvo =
                evento.target;


            if (
                !alvo ||
                alvo.id !==
                "btnLerOrcamento"
            ) {

                return;

            }


            setTimeout(
                function () {

                    const checkin =
                        document.getElementById(
                            "checkin"
                        );


                    const checkout =
                        document.getElementById(
                            "checkout"
                        );


                    /*
                     * Só executa a correção
                     * se o OCR principal deixou
                     * alguma das datas vazia.
                     */

                    if (
                        !checkin ||
                        !checkout ||
                        !checkin.value ||
                        !checkout.value
                    ) {

                        tentarLerDatas();

                    }

                },
                3000
            );

        },
        false
    );


})();
                        
