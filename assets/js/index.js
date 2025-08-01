const canvas = new fabric.Canvas('posterCanvas', {
  backgroundColor: '#fff',
  selection: false,
});

// Carrega a imagem base (cartaz)
fabric.Image.fromURL('/assets/img/model.png', (img) => {
  img.set({
    selectable: false,
    evented: false,
    scaleX: 1024 / img.width,
    scaleY: 1350 / img.height,
    top: 0,
    left: 0,
  });
  canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
});

// Define posições conforme Photoshop
//const IMAGE_MASK_X = (1024 - 576) / 2; // centro
const IMAGE_MASK_Y = 336;
const IMAGE_MASK_WIDTH = 576;
const IMAGE_MASK_HEIGHT = 584;

// Função para adicionar a imagem do desaparecido
function addProfileImage(imageURL) {
  fabric.Image.fromURL(imageURL, (img) => {
    // Escala automática para caber no mask
    const scale = Math.max(
      IMAGE_MASK_WIDTH / img.width,
      IMAGE_MASK_HEIGHT / img.height
    );

    const imgGroup = new fabric.Group([], {
      left: 576,
      top: 300,
      width: 500,
      height: 500,
      clipPath: new fabric.Rect({
        width: 500,
        height: 500,
        absolutePositioned: true,
      }),
      selectable: true,
    });

    img.set({
      scaleX: scale,
      scaleY: scale,
      left: (IMAGE_MASK_WIDTH - img.width * scale) / 2,
      top: (IMAGE_MASK_HEIGHT - img.height * scale) / 2,
      originX: 'left',
      originY: 'top',
    });

    imgGroup.addWithUpdate(img);
    canvas.add(imgGroup);
    canvas.renderAll();
  });
}

// Adiciona nome
function addNome(nome) {
    const text = new fabric.Textbox(nome, {
        top: 966.36,
        left: canvas.width / 2,
        fontSize: 65,
        fontFamily: 'Red Hat Display',
        fontWeight: '900',
        originX: 'center',
        selectable: true,
        splitByGrapheme: false,
        width: 900, // Define largura fixa para evitar quebra de linha por palavra
    });
    // Centraliza o texto horizontalmente
    text.left = canvas.width / 2;
    canvas.add(text);
}

// Adiciona números
function addNumeros(n1, n2) {
    let numeros = n1 && n2 ? `${n1} / ${n2}` : n1 || n2 || '';
    const text = new fabric.Textbox(numeros, {
        top: 1086.29,
        left: 589,
        fontSize: 65,
        width: 1000,
        fontFamily: 'Red Hat Display',
        fontWeight: '900',
        originX: 'center',
        selectable: false,
        fill: '#b7353a',
    });
    canvas.add(text);
}

// Evento: Upload da foto
document.getElementById('foto').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    addProfileImage(event.target.result);
  };
  reader.readAsDataURL(file);
});

// EVENTOS para adicionar nome/número
document.getElementById('nome').addEventListener('input', (e) => {
  canvas.getObjects('textbox').forEach(obj => {
    if (obj.top === 966.36) canvas.remove(obj);
  });
  addNome(e.target.value);
});

document.getElementById('numero1').addEventListener('input', updateNumeros);
document.getElementById('numero2').addEventListener('input', updateNumeros);

function updateNumeros() {
  const n1 = document.getElementById('numero1').value;
  const n2 = document.getElementById('numero2').value;

  canvas.getObjects('textbox').forEach(obj => {
    if (obj.top === 1086.29) canvas.remove(obj);
  });
  addNumeros(n1, n2);
}
  document.getElementById("download-cartaz").addEventListener("click", function () {
  const dataURL = canvas.toDataURL({
    format: "png",
    quality: 1.0
  });

  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "cartaz-ADA.png";
  link.click();
});