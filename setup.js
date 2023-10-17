document.addEventListener('readystatechange', function () {
    if (document.readyState === 'complete') {
        initSetup();
    }
});

var t79WG = {}

async function initSetup() {

    getElements();

    if (!navigator.gpu) {
        throw new Error("WebGPU not supported.");
    }

    await getDevice();
    configCanvas();
    setupEncoder();
}

function getElements() {
    t79WG.canvas = document.getElementById("webgpu-canvas");
    console.log(t79WG.canvas);
}

async function getDevice() {
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
        throw new Error("Adaptor not found.");
    }

    t79WG.device = await adapter.requestDevice();
}

function configCanvas() {
    t79WG.context = t79WG.canvas.getContext("webgpu");
    const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
    t79WG.context.configure({
        device: t79WG.device,
        format: canvasFormat
    })
}

function setupEncoder() {
    const encoder = t79WG.device.createCommandEncoder();

    const pass = encoder.beginRenderPass({
        colorAttachments: [{
            view: t79WG.context.getCurrentTexture().createView(),
            loadOp: "clear",
            storeOp: "store"
        }]
    })
    pass.end();
    const commandBuffer = encoder.finish();
    t79WG.device.queue.submit([commandBuffer]);
    t79WG.device.queue.submit([encoder.finish()]);
}

export {getDevice};